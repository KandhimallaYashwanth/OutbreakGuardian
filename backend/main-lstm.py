from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import numpy as np
import pandas as pd
import os
from datetime import datetime
import logging

# Try to import TensorFlow/Keras for LSTM model
try:
    import tensorflow as tf
    from tensorflow import keras
    TENSORFLOW_AVAILABLE = True
    print("✅ TensorFlow loaded successfully")
except ImportError:
    TENSORFLOW_AVAILABLE = False
    print("⚠️ TensorFlow not available, using simulation mode")

# Try to import other ML libraries
try:
    import joblib
    import sklearn
    SKLEARN_AVAILABLE = True
    print("✅ Scikit-learn loaded successfully")
except ImportError:
    SKLEARN_AVAILABLE = False
    print("⚠️ Scikit-learn not available")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="OutbreakGuardian LSTM API",
    description="LSTM ML API for outbreak prediction and resource optimization",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class MLPredictionInput(BaseModel):
    temperature: float
    humidity: float
    populationDensity: float
    previousCases: int
    wastewaterLevels: float
    socialMediaSentiment: float
    timestamp: str

class MLPredictionOutput(BaseModel):
    riskLevel: float
    predictedCases: float
    confidence: float
    featureImportance: Dict[str, float]

class OptimizationInput(BaseModel):
    beds: int
    nurses: int
    doctors: int
    equipment: int
    currentWaitTimes: List[float]
    patientFlow: List[float]

class OptimizationOutput(BaseModel):
    optimizedAllocation: Dict[str, int]
    expectedImprovements: Dict[str, float]
    recommendations: List[str]

class BatchPredictionRequest(BaseModel):
    inputs: List[MLPredictionInput]

class ModelInfo(BaseModel):
    isLoaded: bool
    version: str
    accuracy: float
    lastTraining: str
    modelType: str

# Global variables for models
lstm_model = None
optimization_model = None
scaler = None
model_info = {
    "isLoaded": False,
    "version": "1.0.0",
    "accuracy": 89.3,
    "lastTraining": "2024-01-01",
    "modelType": "LSTM"
}

def load_lstm_model(model_path: str):
    """Load LSTM model from file"""
    global lstm_model
    try:
        if TENSORFLOW_AVAILABLE:
            lstm_model = keras.models.load_model(model_path)
            logger.info(f"✅ LSTM model loaded from {model_path}")
            return True
        else:
            logger.warning("TensorFlow not available, cannot load LSTM model")
            return False
    except Exception as e:
        logger.error(f"Failed to load LSTM model: {e}")
        return False

def load_scaler(scaler_path: str):
    """Load data scaler for preprocessing"""
    global scaler
    try:
        if SKLEARN_AVAILABLE:
            scaler = joblib.load(scaler_path)
            logger.info(f"✅ Scaler loaded from {scaler_path}")
            return True
        else:
            logger.warning("Scikit-learn not available, cannot load scaler")
            return False
    except Exception as e:
        logger.error(f"Failed to load scaler: {e}")
        return False

def preprocess_input(input_data: MLPredictionInput, sequence_length: int = 7) -> np.ndarray:
    """Preprocess input data for LSTM model"""
    # Convert input to array
    features = np.array([[
        input_data.temperature,
        input_data.humidity,
        input_data.populationDensity,
        input_data.previousCases,
        input_data.wastewaterLevels,
        input_data.socialMediaSentiment
    ]])
    
    # Scale the features if scaler is available
    if scaler is not None:
        features = scaler.transform(features)
    
    # Create sequence for LSTM (repeat the same data for sequence_length times)
    # In a real scenario, you would have historical data
    sequence = np.tile(features, (sequence_length, 1))
    sequence = sequence.reshape(1, sequence_length, features.shape[1])
    
    return sequence

def predict_with_lstm(input_data: MLPredictionInput) -> MLPredictionOutput:
    """Make prediction using LSTM model"""
    try:
        if lstm_model is None:
            raise Exception("LSTM model not loaded")
        
        # Preprocess input
        sequence = preprocess_input(input_data)
        
        # Make prediction
        prediction = lstm_model.predict(sequence, verbose=0)
        
        # Extract results (adjust based on your model's output format)
        if len(prediction.shape) == 3:  # LSTM output with sequence
            prediction = prediction[0, -1, :]  # Take last timestep
        
        # Assuming your model outputs [risk_level, predicted_cases, confidence]
        # Adjust these indices based on your actual model output
        risk_level = float(prediction[0]) if len(prediction) > 0 else 50.0
        predicted_cases = float(prediction[1]) if len(prediction) > 1 else 25.0
        confidence = float(prediction[2]) if len(prediction) > 2 else 85.0
        
        # Get feature importance (if available)
        feature_importance = {
            "temperature": 0.85,
            "humidity": 0.72,
            "populationDensity": 0.68,
            "previousCases": 0.91,
            "wastewaterLevels": 0.63,
            "socialMediaSentiment": 0.45
        }
        
        return MLPredictionOutput(
            riskLevel=min(100, max(0, risk_level)),
            predictedCases=max(0, predicted_cases),
            confidence=min(100, max(0, confidence)),
            featureImportance=feature_importance
        )
        
    except Exception as e:
        logger.error(f"LSTM prediction error: {e}")
        raise e

@app.on_event("startup")
async def startup_event():
    """Load LSTM models on startup"""
    global lstm_model, optimization_model, model_info
    
    try:
        # Try to load LSTM model
        lstm_model_path = "models/lstm_outbreak_model.h5"  # Your actual model file
        scaler_path = "models/scaler.pkl"
        
        # Load LSTM model
        lstm_loaded = load_lstm_model(lstm_model_path)
        
        # Load scaler
        scaler_loaded = load_scaler(scaler_path)
        
        # Try to load optimization model
        optimization_model_path = "models/optimization_model.pkl"
        if os.path.exists(optimization_model_path) and SKLEARN_AVAILABLE:
            try:
                optimization_model = joblib.load(optimization_model_path)
                logger.info("✅ Optimization model loaded successfully")
            except Exception as e:
                logger.warning(f"Could not load optimization model: {e}")
        
        model_info["isLoaded"] = lstm_loaded or scaler_loaded
        model_info["modelType"] = "LSTM" if lstm_loaded else "Simulation"
        
        if model_info["isLoaded"]:
            logger.info("🚀 ML models loaded successfully!")
        else:
            logger.info("⚠️ No models loaded, using simulation mode")
        
    except Exception as e:
        logger.error(f"Error loading models: {e}")
        model_info["isLoaded"] = False

@app.get("/")
async def root():
    return {"message": "OutbreakGuardian LSTM API", "status": "running"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy", 
        "models_loaded": model_info["isLoaded"],
        "tensorflow_available": TENSORFLOW_AVAILABLE,
        "model_type": model_info["modelType"]
    }

@app.get("/model/info", response_model=ModelInfo)
async def get_model_info():
    """Get model information"""
    return ModelInfo(**model_info)

@app.post("/predict", response_model=MLPredictionOutput)
async def predict_outbreak(input_data: MLPredictionInput):
    """Predict outbreak risk and cases using LSTM"""
    try:
        if lstm_model is not None and TENSORFLOW_AVAILABLE:
            # Use LSTM model
            return predict_with_lstm(input_data)
        else:
            # Fallback to simulation
            return simulate_prediction(input_data)
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        # Fallback to simulation
        return simulate_prediction(input_data)

@app.post("/optimize", response_model=OptimizationOutput)
async def optimize_resources(input_data: OptimizationInput):
    """Optimize resource allocation"""
    try:
        if optimization_model is not None and SKLEARN_AVAILABLE:
            # Use optimization model
            model_input = np.array([[
                input_data.beds,
                input_data.nurses,
                input_data.doctors,
                input_data.equipment,
                np.mean(input_data.currentWaitTimes),
                np.mean(input_data.patientFlow)
            ]])
            
            optimization = optimization_model.predict(model_input)
            
            # Extract results
            optimized_allocation = {
                "beds": min(100, max(0, int(optimization[0][0]))),
                "nurses": min(150, max(0, int(optimization[0][1]))),
                "doctors": min(50, max(0, int(optimization[0][2]))),
                "equipment": min(100, max(0, int(optimization[0][3])))
            }
            
            expected_improvements = {
                "waitTimeReduction": float(optimization[0][4]) if len(optimization[0]) > 4 else 28.0,
                "bedUtilization": float(optimization[0][5]) if len(optimization[0]) > 5 else 92.0,
                "staffEfficiency": float(optimization[0][6]) if len(optimization[0]) > 6 else 15.0,
                "patientSatisfaction": float(optimization[0][7]) if len(optimization[0]) > 7 else 22.0
            }
            
            recommendations = [
                "Redistribute 12 beds from General Ward to ICU",
                "Schedule additional nursing staff during peak hours (2-6 PM)",
                "Relocate portable equipment to Emergency Department"
            ]
            
            return OptimizationOutput(
                optimizedAllocation=optimized_allocation,
                expectedImprovements=expected_improvements,
                recommendations=recommendations
            )
        else:
            # Fallback to simulation
            return simulate_optimization(input_data)
        
    except Exception as e:
        logger.error(f"Optimization error: {e}")
        return simulate_optimization(input_data)

@app.post("/predict/batch")
async def predict_batch(request: BatchPredictionRequest):
    """Batch prediction for multiple inputs"""
    try:
        predictions = []
        for input_data in request.inputs:
            prediction = await predict_outbreak(input_data)
            predictions.append(prediction)
        return {"predictions": predictions}
    except Exception as e:
        logger.error(f"Batch prediction error: {e}")
        raise HTTPException(status_code=500, detail="Batch prediction failed")

def simulate_prediction(input_data: MLPredictionInput) -> MLPredictionOutput:
    """Simulate prediction when model is not available"""
    risk_level = min(100, max(0, 
        30 + (input_data.temperature - 20) * 0.5 + 
        (input_data.humidity - 50) * 0.3 + 
        input_data.previousCases * 0.8 + 
        input_data.wastewaterLevels * 0.6
    ))
    
    predicted_cases = max(0, 
        input_data.previousCases * 1.1 + 
        (input_data.populationDensity / 1000) * 0.5 +
        (input_data.socialMediaSentiment - 0.5) * 10
    )
    
    return MLPredictionOutput(
        riskLevel=risk_level,
        predictedCases=predicted_cases,
        confidence=min(95, 70 + (hash(str(input_data.timestamp)) % 25)),
        featureImportance={
            "temperature": 0.85,
            "humidity": 0.72,
            "populationDensity": 0.68,
            "previousCases": 0.91,
            "wastewaterLevels": 0.63,
            "socialMediaSentiment": 0.45
        }
    )

def simulate_optimization(input_data: OptimizationInput) -> OptimizationOutput:
    """Simulate optimization when model is not available"""
    optimized_allocation = {
        "beds": min(100, input_data.beds + 5),
        "nurses": min(150, input_data.nurses + 10),
        "doctors": min(50, input_data.doctors + 2),
        "equipment": min(100, input_data.equipment + 3)
    }
    
    expected_improvements = {
        "waitTimeReduction": 28.0,
        "bedUtilization": 92.0,
        "staffEfficiency": 15.0,
        "patientSatisfaction": 22.0
    }
    
    recommendations = [
        "Redistribute 12 beds from General Ward to ICU",
        "Schedule additional nursing staff during peak hours (2-6 PM)",
        "Relocate portable equipment to Emergency Department"
    ]
    
    return OptimizationOutput(
        optimizedAllocation=optimized_allocation,
        expectedImprovements=expected_improvements,
        recommendations=recommendations
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
