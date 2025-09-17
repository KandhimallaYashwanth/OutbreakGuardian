# LSTM Model Integration Guide

## 🧠 **LSTM Model Setup**

### **1. Export Your LSTM Model from Colab**

In your Google Colab notebook, add these cells to export your trained LSTM model:

```python
# Export your LSTM model
import tensorflow as tf
from tensorflow import keras

# Save your trained LSTM model
model.save('lstm_model.h5')  # or .keras format
print("✅ LSTM model saved as lstm_model.h5")

# If you have a scaler for preprocessing
import joblib
joblib.dump(scaler, 'scaler.pkl')
print("✅ Scaler saved as scaler.pkl")

# Download the files
from google.colab import files
files.download('lstm_model.h5')
files.download('scaler.pkl')
```

### **2. Model File Structure**

Place your exported files in the `backend/models/` directory:

```
backend/models/
├── lstm_model.h5          # Your trained LSTM model
├── scaler.pkl             # Data scaler (if you have one)
└── optimization_model.pkl # Optional: resource optimization model
```

### **3. LSTM Model Requirements**

Your LSTM model should:

- **Input Shape**: `(batch_size, sequence_length, features)`
  - `sequence_length`: Number of timesteps (e.g., 7 for 7 days)
  - `features`: Number of input features (6 for our case)

- **Output Shape**: `(batch_size, predictions)`
  - Should output at least 3 values: `[risk_level, predicted_cases, confidence]`

### **4. Input Features**

The API expects these 6 features in order:
1. `temperature` - Weather temperature
2. `humidity` - Weather humidity  
3. `populationDensity` - Population density
4. `previousCases` - Previous confirmed cases
5. `wastewaterLevels` - Wastewater viral levels
6. `socialMediaSentiment` - Social media sentiment (0-1)

### **5. Model Training Example**

Here's how your LSTM model should be structured:

```python
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.optimizers import Adam

# Define LSTM model
model = Sequential([
    LSTM(50, return_sequences=True, input_shape=(sequence_length, 6)),
    Dropout(0.2),
    LSTM(50, return_sequences=False),
    Dropout(0.2),
    Dense(25),
    Dense(3)  # Output: [risk_level, predicted_cases, confidence]
])

model.compile(
    optimizer=Adam(learning_rate=0.001),
    loss='mse',
    metrics=['mae']
)

# Train your model
model.fit(X_train, y_train, epochs=100, batch_size=32, validation_split=0.2)

# Save the model
model.save('lstm_model.h5')
```

### **6. Testing Your Model**

Test your model integration:

```bash
cd backend
pip install -r requirements-lstm.txt
python main-lstm.py
```

### **7. API Endpoints**

- `GET /health` - Check if LSTM model is loaded
- `POST /predict` - Make LSTM predictions
- `GET /model/info` - Get model information

### **8. Troubleshooting**

**Common Issues:**

1. **Model not loading**: Check file path and format
2. **Input shape mismatch**: Verify your model expects the right input shape
3. **Output format**: Ensure your model outputs 3 values
4. **TensorFlow version**: Make sure TensorFlow is compatible

**Debug Commands:**

```python
# Check model input/output shapes
model.summary()

# Test prediction
test_input = np.random.random((1, 7, 6))  # batch_size=1, sequence_length=7, features=6
prediction = model.predict(test_input)
print(f"Output shape: {prediction.shape}")
print(f"Output values: {prediction}")
```

### **9. Customization**

If your LSTM model has different requirements, update these functions in `main-lstm.py`:

- `preprocess_input()` - Adjust input preprocessing
- `predict_with_lstm()` - Modify prediction logic
- `load_lstm_model()` - Change model loading method

### **10. Performance Optimization**

For better performance:

```python
# Use TensorFlow Lite for faster inference
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()
with open('lstm_model.tflite', 'wb') as f:
    f.write(tflite_model)
```

## 🚀 **Next Steps**

1. **Export your LSTM model** from Colab
2. **Place it in** `backend/models/lstm_model.h5`
3. **Test the integration** with `python main-lstm.py`
4. **Check the health endpoint** to verify model loading
5. **Make test predictions** via the API

Let me know when you have your LSTM model exported, and I'll help you integrate it!
