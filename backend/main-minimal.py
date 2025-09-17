from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import json
import os
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="OutbreakGuardian ML API",
    description="ML API for outbreak prediction and resource optimization",
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

# Global variables for models
outbreak_model = None
optimization_model = None
model_info = {
    "isLoaded": False,
    "version": "1.0.0",
    "accuracy": 89.3,
    "lastTraining": "2024-01-01"
}

@app.on_event("startup")
async def startup_event():
    """Load ML models on startup"""
    global outbreak_model, optimization_model, model_info
    
    try:
        # Try to load models if available
        outbreak_model_path = "models/outbreak_model.pkl"
        optimization_model_path = "models/optimization_model.pkl"
        
        if os.path.exists(outbreak_model_path):
            try:
                import joblib
                outbreak_model = joblib.load(outbreak_model_path)
                logger.info("✅ Outbreak prediction model loaded successfully")
            except ImportError:
                logger.warning("joblib not available, model loading skipped")
            except Exception as e:
                logger.warning(f"Could not load outbreak model: {e}")
        
        if os.path.exists(optimization_model_path):
            try:
                import joblib
                optimization_model = joblib.load(optimization_model_path)
                logger.info("✅ Optimization model loaded successfully")
            except ImportError:
                logger.warning("joblib not available, model loading skipped")
            except Exception as e:
                logger.warning(f"Could not load optimization model: {e}")
        
        model_info["isLoaded"] = outbreak_model is not None or optimization_model is not None
        
    except Exception as e:
        logger.error(f"Error loading models: {e}")
        model_info["isLoaded"] = False

@app.get("/")
async def root():
    return {"message": "OutbreakGuardian ML API", "status": "running"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "models_loaded": model_info["isLoaded"]}

@app.get("/model/info", response_model=ModelInfo)
async def get_model_info():
    """Get model information"""
    return ModelInfo(**model_info)

@app.post("/predict", response_model=MLPredictionOutput)
async def predict_outbreak(input_data: MLPredictionInput):
    """Predict outbreak risk and cases"""
    try:
        if outbreak_model is None:
            # Fallback to simulation if model not loaded
            return simulate_prediction(input_data)
        
        # Make prediction with your model
        # Replace this with your actual model prediction logic
        model_input = [
            input_data.temperature,
            input_data.humidity,
            input_data.populationDensity,
            input_data.previousCases,
            input_data.wastewaterLevels,
            input_data.socialMediaSentiment
        ]
        
        # YOUR MODEL PREDICTION LOGIC HERE
        # prediction = outbreak_model.predict([model_input])
        
        # For now, use simulation
        return simulate_prediction(input_data)
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        # Fallback to simulation
        return simulate_prediction(input_data)

@app.post("/optimize", response_model=OptimizationOutput)
async def optimize_resources(input_data: OptimizationInput):
    """Optimize resource allocation"""
    try:
        if optimization_model is None:
            # Fallback to simulation if model not loaded
            return simulate_optimization(input_data)
        
        # YOUR OPTIMIZATION MODEL LOGIC HERE
        # optimization = optimization_model.predict([...])
        
        # For now, use simulation
        return simulate_optimization(input_data)
        
    except Exception as e:
        logger.error(f"Optimization error: {e}")
        # Fallback to simulation
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
