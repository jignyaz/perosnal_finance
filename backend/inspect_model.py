import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Suppress TF logging
import tensorflow as tf
from tensorflow import keras

try:
    model_path = "hybrid_lstm_model.keras"
    if not os.path.exists(model_path):
        print(f"Error: {model_path} not found in current directory.")
        exit(1)
        
    print(f"Loading {model_path}...")
    model = keras.models.load_model(model_path)
    
    print("\n--- Model Summary ---")
    model.summary()
    
    print("\n--- Input Details ---")
    for i, input_tensor in enumerate(model.inputs):
        print(f"Input {i}: shape={input_tensor.shape}, dtype={input_tensor.dtype}")
        
except Exception as e:
    print(f"Failed to load model: {e}")
