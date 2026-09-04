import pandas as pd
import numpy as np
import tensorflow as tf
import pickle
from sklearn.metrics import mean_absolute_error, mean_squared_error
import os

# Set environment to suppress TF logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

def get_nn_forecast(model, scaler, base_residuals, n_forecast, window=3):
    # Ensure base_residuals is a numpy array
    if hasattr(base_residuals, 'values'):
        base_residuals = base_residuals.values
    
    # Take last window values and scale them
    # Note: the scaler expects 2D input
    last_res_scaled = scaler.transform(base_residuals[-window:].reshape(-1, 1))
    current_window = last_res_scaled.reshape(1, window, 1)
    
    forecasts_scaled = []
    
    for _ in range(n_forecast):
        pred_scaled = model.predict(current_window, verbose=0)
        forecasts_scaled.append(pred_scaled[0,0])
        # Update window: shift and add new prediction
        # new_val must be (1, 1, 1) or compatible to append to (1, window-1, 1)
        new_val = pred_scaled.reshape(1, 1, 1)
        current_window = np.concatenate([current_window[:, 1:, :], new_val], axis=1)
    
    # Inverse transform all forecasts at once
    return scaler.inverse_transform(np.array(forecasts_scaled).reshape(-1, 1)).flatten()

# 1. Load Data
if os.path.exists('data/processed'):
    data_dir = 'data/processed'
elif os.path.exists('monthy_expense/data/processed'):
    data_dir = 'monthy_expense/data/processed'
else:
    data_dir = '.'

test_path = os.path.join(data_dir, 'test_weekly.csv') if os.path.exists(os.path.join(data_dir, 'test_weekly.csv')) else os.path.join(data_dir, 'test_weekly1.csv')
train_path = os.path.join(data_dir, 'train_weekly.csv') if os.path.exists(os.path.join(data_dir, 'train_weekly.csv')) else os.path.join(data_dir, 'train_weekly1.csv')

test_df = pd.read_csv(test_path)
test_df['date'] = pd.to_datetime(test_df['date'])
test_df.set_index('date', inplace=True)
test_actuals = test_df['amount']

train_df = pd.read_csv(train_path)
train_actuals = train_df['amount'].values

# 2. Load Models
if os.path.exists('models'):
    model_dir = 'models'
elif os.path.exists('monthy_expense/models'):
    model_dir = 'monthy_expense/models'
else:
    model_dir = '.'

with open(os.path.join(model_dir, 'arima_hybrid_base.pkl'), 'rb') as f:
    arima_res = pickle.load(f)
with open(os.path.join(model_dir, 'ets_hybrid_base.pkl'), 'rb') as f:
    ets_res = pickle.load(f)

lstm_res_model = tf.keras.models.load_model(os.path.join(model_dir, 'lstm_arima_residuals.h5'), compile=False)
gru_res_model = tf.keras.models.load_model(os.path.join(model_dir, 'gru_ets_residuals.h5'), compile=False)

with open(os.path.join(model_dir, 'scaler_arima.pkl'), 'rb') as f:
    scaler_arima = pickle.load(f)
with open(os.path.join(model_dir, 'scaler_ets.pkl'), 'rb') as f:
    scaler_ets = pickle.load(f)

# 3. Generate Predictions
n_test = len(test_actuals)
arima_fc = arima_res.forecast(n_test)
arima_preds = arima_fc.values if hasattr(arima_fc, 'values') else np.array(arima_fc)

ets_fc = ets_res.forecast(n_test)
ets_preds = ets_fc.values if hasattr(ets_fc, 'values') else np.array(ets_fc)

# Residuals for inference
arima_fitted = arima_res.fittedvalues.values if hasattr(arima_res.fittedvalues, 'values') else np.array(arima_res.fittedvalues)
ets_fitted = ets_res.fittedvalues.values if hasattr(ets_res.fittedvalues, 'values') else np.array(ets_res.fittedvalues)

arima_train_res = train_actuals - arima_fitted
ets_train_res = train_actuals - ets_fitted

lstm_res_forecast = get_nn_forecast(lstm_res_model, scaler_arima, arima_train_res, n_test)
gru_res_forecast = get_nn_forecast(gru_res_model, scaler_ets, ets_train_res, n_test)

hybrid_arima_lstm = arima_preds + lstm_res_forecast
hybrid_ets_gru = ets_preds + gru_res_forecast

# Master Ensemble
master_forecast = (0.4 * arima_preds + 0.3 * ets_preds + 0.15 * hybrid_arima_lstm + 0.15 * hybrid_ets_gru)

# Load Prophet Model
prophet_model = None
prophet_path = 'models/prophet_base.pkl' if os.path.exists('models/prophet_base.pkl') else 'monthy_expense/models/prophet_base.pkl'
if os.path.exists(prophet_path):
    with open(prophet_path, 'rb') as f:
        prophet_model = pickle.load(f)

if prophet_model is not None:
    future_prophet = pd.DataFrame({'ds': test_df.index})
    prophet_fc = prophet_model.predict(future_prophet)
    prophet_preds = prophet_fc['yhat'].clip(lower=0).values
else:
    prophet_preds = np.zeros(n_test)

# 4. Calculate Metrics
results = []

def add_stat(name, pred):
    mae = mean_absolute_error(test_actuals, pred)
    rmse = np.sqrt(mean_squared_error(test_actuals, pred))
    mape = np.mean(np.abs((test_actuals.values - pred) / test_actuals.values)) * 100
    results.append({'Model': name, 'MAE': mae, 'RMSE': rmse, 'MAPE': mape})

add_stat('ARIMA (Base)', arima_preds)
add_stat('ETS (Base)', ets_preds)
if prophet_model is not None:
    add_stat('Prophet (Base)', prophet_preds)
add_stat('Hybrid (ARIMA + LSTM)', hybrid_arima_lstm)
add_stat('Hybrid (ETS + GRU)', hybrid_ets_gru)
add_stat('Master Ensemble', master_forecast)

# Print as CSV for easy parsing
print("Model,MAE,RMSE,MAPE")
for r in results:
    print(f"{r['Model']},{r['MAE']:.2f},{r['RMSE']:.2f},{r['MAPE']:.2f}")
