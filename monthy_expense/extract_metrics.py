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
test_df = pd.read_csv('data/processed/test_monthly.csv')
test_df['date'] = pd.to_datetime(test_df['date'])
test_df.set_index('date', inplace=True)
test_actuals = test_df['amount']

train_df = pd.read_csv('data/processed/train_monthly.csv')
train_actuals = train_df['amount'].values

# 2. Load Models
with open('models/arima_hybrid_base.pkl', 'rb') as f:
    arima_res = pickle.load(f)
with open('models/ets_hybrid_base.pkl', 'rb') as f:
    ets_res = pickle.load(f)

lstm_res_model = tf.keras.models.load_model('models/lstm_arima_residuals.h5', compile=False)
gru_res_model = tf.keras.models.load_model('models/gru_ets_residuals.h5', compile=False)

with open('models/scaler_arima.pkl', 'rb') as f:
    scaler_arima = pickle.load(f)
with open('models/scaler_ets.pkl', 'rb') as f:
    scaler_ets = pickle.load(f)

# 3. Generate Predictions
n_test = len(test_actuals)
arima_preds = arima_res.forecast(n_test).values
ets_preds = ets_res.forecast(n_test).values

# Residuals for inference
arima_train_res = train_actuals - arima_res.fittedvalues.values
ets_train_res = train_actuals - ets_res.fittedvalues.values

lstm_res_forecast = get_nn_forecast(lstm_res_model, scaler_arima, arima_train_res, n_test)
gru_res_forecast = get_nn_forecast(gru_res_model, scaler_ets, ets_train_res, n_test)

hybrid_arima_lstm = arima_preds + lstm_res_forecast
hybrid_ets_gru = ets_preds + gru_res_forecast

# Master Ensemble
master_forecast = (0.4 * arima_preds + 0.3 * ets_preds + 0.15 * hybrid_arima_lstm + 0.15 * hybrid_ets_gru)

# 4. Calculate Metrics
results = []

def add_stat(name, pred):
    mae = mean_absolute_error(test_actuals, pred)
    rmse = np.sqrt(mean_squared_error(test_actuals, pred))
    mape = np.mean(np.abs((test_actuals.values - pred) / test_actuals.values)) * 100
    results.append({'Model': name, 'MAE': mae, 'RMSE': rmse, 'MAPE': mape})

add_stat('ARIMA (Base)', arima_preds)
add_stat('ETS (Base)', ets_preds)
add_stat('Hybrid (ARIMA + LSTM)', hybrid_arima_lstm)
add_stat('Hybrid (ETS + GRU)', hybrid_ets_gru)
add_stat('Master Ensemble', master_forecast)

# Print as CSV for easy parsing
print("Model,MAE,RMSE,MAPE")
for r in results:
    print(f"{r['Model']},{r['MAE']:.2f},{r['RMSE']:.2f},{r['MAPE']:.2f}")
