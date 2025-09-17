#!/usr/bin/env python3
"""
Test script for LSTM model integration
"""
import sys
import os
sys.path.append('.')

def test_model_loading():
    """Test if LSTM model and scaler can be loaded"""
    print("🧪 Testing LSTM Model Loading...")
    print("=" * 50)
    
    # Test TensorFlow availability
    try:
        import tensorflow as tf
        from tensorflow import keras
        print("✅ TensorFlow version:", tf.__version__)
    except ImportError as e:
        print("❌ TensorFlow not available:", e)
        return False
    
    # Test model loading
    try:
        model_path = "models/lstm_outbreak_model.h5"
        if os.path.exists(model_path):
            model = keras.models.load_model(model_path)
            print("✅ LSTM model loaded successfully!")
            print(f"   Model input shape: {model.input_shape}")
            print(f"   Model output shape: {model.output_shape}")
            print(f"   Model summary:")
            model.summary()
        else:
            print(f"❌ Model file not found: {model_path}")
            return False
    except Exception as e:
        print(f"❌ Error loading LSTM model: {e}")
        return False
    
    # Test scaler loading
    try:
        import joblib
        scaler_path = "models/scaler.pkl"
        if os.path.exists(scaler_path):
            scaler = joblib.load(scaler_path)
            print("✅ Scaler loaded successfully!")
            print(f"   Scaler type: {type(scaler)}")
            if hasattr(scaler, 'feature_names_in_'):
                print(f"   Features: {scaler.feature_names_in_}")
        else:
            print(f"❌ Scaler file not found: {scaler_path}")
            return False
    except Exception as e:
        print(f"❌ Error loading scaler: {e}")
        return False
    
    return True

def test_prediction():
    """Test making a prediction with the loaded model"""
    print("\n🔮 Testing LSTM Prediction...")
    print("=" * 50)
    
    try:
        import tensorflow as tf
        from tensorflow import keras
        import joblib
        import numpy as np
        
        # Load model and scaler
        model = keras.models.load_model("models/lstm_outbreak_model.h5")
        scaler = joblib.load("models/scaler.pkl")
        
        # Create test input
        test_features = np.array([[
            25.5,  # temperature
            60.0,  # humidity
            1500.0,  # populationDensity
            20,    # previousCases
            45.0,  # wastewaterLevels
            0.6    # socialMediaSentiment
        ]])
        
        print("📊 Test input features:")
        print(f"   Temperature: {test_features[0][0]}")
        print(f"   Humidity: {test_features[0][1]}")
        print(f"   Population Density: {test_features[0][2]}")
        print(f"   Previous Cases: {test_features[0][3]}")
        print(f"   Wastewater Levels: {test_features[0][4]}")
        print(f"   Social Media Sentiment: {test_features[0][5]}")
        
        # Scale the features
        scaled_features = scaler.transform(test_features)
        print(f"\n🔧 Scaled features: {scaled_features[0]}")
        
        # Create sequence for LSTM (assuming sequence_length = 7)
        sequence_length = 7
        sequence = np.tile(scaled_features, (sequence_length, 1))
        sequence = sequence.reshape(1, sequence_length, scaled_features.shape[1])
        
        print(f"📈 LSTM input shape: {sequence.shape}")
        
        # Make prediction
        prediction = model.predict(sequence, verbose=0)
        print(f"\n🎯 Prediction output shape: {prediction.shape}")
        print(f"🎯 Prediction values: {prediction[0]}")
        
        # Extract results
        if len(prediction.shape) == 3:  # LSTM output with sequence
            prediction = prediction[0, -1, :]  # Take last timestep
        
        risk_level = float(prediction[0]) if len(prediction) > 0 else 50.0
        predicted_cases = float(prediction[1]) if len(prediction) > 1 else 25.0
        confidence = float(prediction[2]) if len(prediction) > 2 else 85.0
        
        print(f"\n📊 Prediction Results:")
        print(f"   Risk Level: {risk_level:.2f}%")
        print(f"   Predicted Cases: {predicted_cases:.2f}")
        print(f"   Confidence: {confidence:.2f}%")
        
        return True
        
    except Exception as e:
        print(f"❌ Prediction test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Run all tests"""
    print("🚀 LSTM Model Integration Test")
    print("=" * 60)
    
    # Test 1: Model Loading
    loading_success = test_model_loading()
    
    if loading_success:
        # Test 2: Prediction
        prediction_success = test_prediction()
        
        print("\n" + "=" * 60)
        print("📋 Test Results:")
        print(f"Model Loading: {'✅ PASS' if loading_success else '❌ FAIL'}")
        print(f"Prediction: {'✅ PASS' if prediction_success else '❌ FAIL'}")
        
        if loading_success and prediction_success:
            print("\n🎉 All tests passed! Your LSTM model is ready for integration!")
            print("🚀 You can now start the backend with: python main-lstm.py")
        else:
            print("\n⚠️ Some tests failed. Check the errors above.")
    else:
        print("\n❌ Model loading failed. Cannot proceed with prediction test.")

if __name__ == "__main__":
    main()
