import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
import tensorflow as tf
from tensorflow import keras
import numpy as np

def inspect_model(name, path):
    print(f"\n{'='*20} Inspecting {name} {'='*20}")
    if not os.path.exists(path):
        print(f"Error: {path} not found.")
        return
        
    try:
        model = keras.models.load_model(path)
        print(f"Successfully loaded {path}")
        print("\nInput Details:")
        for i, inp in enumerate(model.inputs):
            print(f"  Input {i}: name={inp.name}, shape={inp.shape}, dtype={inp.dtype}")
        print("\nOutput Details:")
        for i, out in enumerate(model.outputs):
            print(f"  Output {i}: name={out.name}, shape={out.shape}, dtype={out.dtype}")
    except Exception as e:
        print(f"Failed: {e}")

# Inspect both models for comparison
inspect_model("Existing Keras Model", "../hybrid_lstm_model.keras")
inspect_model("New H5 Model", "../lstm_arima_residuals.h5")
