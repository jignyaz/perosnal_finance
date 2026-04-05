import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
import tensorflow as tf
from tensorflow import keras
import sys

path = "../lstm_arima_residuals.h5"
print(f"Attempting to load: {path}")

if not os.path.exists(path):
    print("File not found.")
    sys.exit(1)

try:
    # Try loading with compile=False to avoid issues with custom optimizers/layers
    model = keras.models.load_model(path, compile=False)
    print("Load Successful (compile=False)")
    
    print("\nInputs:")
    for inp in model.inputs:
        print(f"  {inp}")
    
    print("\nOutputs:")
    for out in model.outputs:
        print(f"  {out}")
        
    # Also print layer names to understand architecture
    print("\nLayers:")
    for layer in model.layers:
        print(f"  {layer.name} ({layer.__class__.__name__})")

except Exception as e:
    print(f"Error during load: {e}")
    import traceback
    traceback.print_exc()
