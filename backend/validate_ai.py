import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
import tensorflow as tf
from tensorflow import keras
import numpy as np

def validate_model(path, name):
    print(f"\n--- Validating {name} ---")
    if not os.path.exists(path):
        print(f"Error: {path} not found.")
        return
    
    try:
        model = keras.models.load_model(path, compile=False)
        print("Model loaded successfully.")
        
        # Test with synthetic scenarios
        scenarios = [
            {"name": "Stable Low", "data": [1000, 1100, 1050]},
            {"name": "Aggressive Spike", "data": [1000, 2000, 3000]},
            {"name": "Downward Trend", "data": [3000, 2000, 1500]},
            {"name": "Volatile", "data": [1000, 5000, 2000]}
        ]
        
        for s in scenarios:
            data = np.array(s["data"], dtype=float).reshape(1, 3, 1)
            max_val = np.max(data) if np.max(data) > 0 else 1.0
            scaled_input = (data / max_val).astype('float32')
            
            prediction = model.predict(scaled_input, verbose=0)
            raw_val = float(prediction[0][0])
            
            # The .h5 model is designed as a residual/correction model
            # Let's see how it behaves on its own vs as a correction
            print(f"Scenario: {s['name']}")
            print(f"  Input: {s['data']}")
            print(f"  Raw Model Output: {raw_val:.4f}")
            
            # If used as primary, it would be raw_val * max_val
            # If used as residual, it's (1 + raw_val) * base
            
    except Exception as e:
        print(f"Validation failed: {e}")

validate_model("../lstm_arima_residuals.h5", "New Residual Model")
validate_model("../hybrid_lstm_model.keras", "Existing Primary Model")
