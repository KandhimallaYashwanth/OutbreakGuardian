# Python ML Integration Guide for OutbreakGuardian

This guide shows you how to integrate your Python ML model with the OutbreakGuardian frontend using a FastAPI backend.

## 🚀 Quick Start

### 1. Setup Python Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Create models directory
mkdir -p models

# Start the backend server
python run.py
```

### 2. Start Frontend

```bash
# In the main project directory
npm run dev
```

## 📁 Project Structure

```
backend/
├── main.py              # FastAPI application
├── run.py               # Server startup script
├── test_api.py          # API testing script
├── requirements.txt     # Python dependencies
└── models/              # Your ML models go here
    ├── outbreak_model.pkl
    └── optimization_model.pkl

frontend/ (your existing React app)
├── src/
│   ├── services/
│   │   ├── MLService.ts      # Client-side ML service
│   │   └── MLApiService.ts   # API service
│   └── contexts/
│       └── DataContext.tsx   # Updated to use Python API
```

## 🔧 Integration Steps

### Step 1: Prepare Your ML Models

Place your trained models in the `backend/models/` directory:

```python
# Example: Save your models
import joblib
from sklearn.ensemble import RandomForestRegressor

# Your outbreak prediction model
outbreak_model = RandomForestRegressor(n_estimators=100)
# ... train your model ...
joblib.dump(outbreak_model, 'backend/models/outbreak_model.pkl')

# Your optimization model
optimization_model = RandomForestRegressor(n_estimators=100)
# ... train your model ...
joblib.dump(optimization_model, 'backend/models/optimization_model.pkl')
```

### Step 2: Update Model Loading in main.py

Replace the model loading section in `backend/main.py`:

```python
@app.on_event("startup")
async def startup_event():
    """Load ML models on startup"""
    global outbreak_model, optimization_model, model_info
    
    try:
        # Update these paths to your actual model files
        outbreak_model_path = "models/your_outbreak_model.pkl"
        optimization_model_path = "models/your_optimization_model.pkl"
        
        if os.path.exists(outbreak_model_path):
            outbreak_model = joblib.load(outbreak_model_path)
            logger.info("✅ Outbreak prediction model loaded successfully")
        else:
            logger.warning(f"⚠️ Outbreak model not found at {outbreak_model_path}")
        
        if os.path.exists(optimization_model_path):
            optimization_model = joblib.load(optimization_model_path)
            logger.info("✅ Optimization model loaded successfully")
        else:
            logger.warning(f"⚠️ Optimization model not found at {optimization_model_path}")
        
        model_info["isLoaded"] = outbreak_model is not None or optimization_model is not None
        
    except Exception as e:
        logger.error(f"❌ Error loading models: {e}")
        model_info["isLoaded"] = False
```

### Step 3: Update Prediction Logic

Replace the prediction methods in `backend/main.py` with your actual model logic:

```python
@app.post("/predict", response_model=MLPredictionOutput)
async def predict_outbreak(input_data: MLPredictionInput):
    """Predict outbreak risk and cases"""
    try:
        if outbreak_model is None:
            return simulate_prediction(input_data)
        
        # Prepare input for your model
        model_input = np.array([[
            input_data.temperature,
            input_data.humidity,
            input_data.populationDensity,
            input_data.previousCases,
            input_data.wastewaterLevels,
            input_data.socialMediaSentiment
        ]])
        
        # YOUR MODEL PREDICTION LOGIC HERE
        prediction = outbreak_model.predict(model_input)
        
        # Extract results based on your model's output format
        risk_level = float(prediction[0][0])  # Adjust indices based on your model
        predicted_cases = float(prediction[0][1])
        confidence = float(prediction[0][2])
        
        # Get feature importance (if your model supports it)
        if hasattr(outbreak_model, 'feature_importances_'):
            feature_importance = {
                "temperature": float(outbreak_model.feature_importances_[0]),
                "humidity": float(outbreak_model.feature_importances_[1]),
                "populationDensity": float(outbreak_model.feature_importances_[2]),
                "previousCases": float(outbreak_model.feature_importances_[3]),
                "wastewaterLevels": float(outbreak_model.feature_importances_[4]),
                "socialMediaSentiment": float(outbreak_model.feature_importances_[5])
            }
        else:
            # Default feature importance
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
        logger.error(f"Prediction error: {e}")
        return simulate_prediction(input_data)
```

### Step 4: Update Optimization Logic

Similarly, update the optimization method:

```python
@app.post("/optimize", response_model=OptimizationOutput)
async def optimize_resources(input_data: OptimizationInput):
    """Optimize resource allocation"""
    try:
        if optimization_model is None:
            return simulate_optimization(input_data)
        
        # Prepare input for your optimization model
        model_input = np.array([[
            input_data.beds,
            input_data.nurses,
            input_data.doctors,
            input_data.equipment,
            np.mean(input_data.currentWaitTimes),
            np.mean(input_data.patientFlow)
        ]])
        
        # YOUR OPTIMIZATION MODEL LOGIC HERE
        optimization = optimization_model.predict(model_input)
        
        # Extract results based on your model's output format
        optimized_allocation = {
            "beds": min(100, max(0, int(optimization[0][0]))),
            "nurses": min(150, max(0, int(optimization[0][1]))),
            "doctors": min(50, max(0, int(optimization[0][2]))),
            "equipment": min(100, max(0, int(optimization[0][3])))
        }
        
        expected_improvements = {
            "waitTimeReduction": float(optimization[0][4]),
            "bedUtilization": float(optimization[0][5]),
            "staffEfficiency": float(optimization[0][6]),
            "patientSatisfaction": float(optimization[0][7])
        }
        
        # Generate recommendations based on your model
        recommendations = generate_recommendations(optimization)
        
        return OptimizationOutput(
            optimizedAllocation=optimized_allocation,
            expectedImprovements=expected_improvements,
            recommendations=recommendations
        )
        
    except Exception as e:
        logger.error(f"Optimization error: {e}")
        return simulate_optimization(input_data)
```

## 🧪 Testing Your Integration

### 1. Test the Backend API

```bash
cd backend
python test_api.py
```

### 2. Test the Frontend Connection

1. Start the backend: `python run.py`
2. Start the frontend: `npm run dev`
3. Open browser console and look for: "✅ Connected to Python ML API backend"

### 3. Manual API Testing

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test prediction
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 25.5,
    "humidity": 60.0,
    "populationDensity": 1500.0,
    "previousCases": 20,
    "wastewaterLevels": 45.0,
    "socialMediaSentiment": 0.6,
    "timestamp": "2024-01-01T12:00:00Z"
  }'
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Backend Configuration
HOST=0.0.0.0
PORT=8000
RELOAD=true

# Model Paths
OUTBREAK_MODEL_PATH=models/outbreak_model.pkl
OPTIMIZATION_MODEL_PATH=models/optimization_model.pkl

# API Configuration
API_KEY=your-secret-key
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend Configuration

Update the API URL in `src/services/MLApiService.ts` if needed:

```typescript
// For production, update the base URL
constructor(baseUrl: string = 'http://your-production-api.com', apiKey?: string) {
  this.baseUrl = baseUrl;
  this.apiKey = apiKey;
}
```

## 🚀 Production Deployment

### 1. Backend Deployment

```bash
# Install production dependencies
pip install gunicorn

# Run with Gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### 2. Docker Deployment

Create `backend/Dockerfile`:

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["python", "run.py"]
```

### 3. Environment-Specific Configuration

Update `backend/main.py` for production:

```python
# Add environment detection
import os

# Production settings
if os.getenv("ENVIRONMENT") == "production":
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["https://your-frontend-domain.com"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
```

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Check that your frontend URL is in the CORS origins list
   - Verify the backend is running on the correct port

2. **Model Loading Errors:**
   - Ensure model files are in the correct directory
   - Check file permissions
   - Verify model format compatibility

3. **Prediction Errors:**
   - Check input format matches your model expectations
   - Verify model output format
   - Check logs for detailed error messages

4. **Connection Issues:**
   - Verify backend is running: `curl http://localhost:8000/health`
   - Check firewall settings
   - Ensure ports are not blocked

### Debug Mode:

Enable debug logging in `backend/main.py`:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 📊 Monitoring

### Health Check Endpoint

The API provides several monitoring endpoints:

- `GET /health` - Basic health check
- `GET /model/info` - Model status and information
- `GET /docs` - Interactive API documentation

### Logging

The backend logs all requests and errors. Check logs for:

- Model loading status
- Prediction requests
- Error messages
- Performance metrics

## 🔄 Model Updates

To update your models:

1. Replace model files in `backend/models/`
2. Restart the backend server
3. The new models will be loaded automatically

## 📈 Performance Optimization

### For Large Models:

1. **Use model caching:**
   ```python
   # Cache predictions for similar inputs
   from functools import lru_cache
   
   @lru_cache(maxsize=1000)
   def cached_prediction(input_hash):
       return model.predict(input_data)
   ```

2. **Batch processing:**
   ```python
   # Process multiple predictions at once
   def batch_predict(inputs):
       return model.predict(np.array(inputs))
   ```

3. **Async processing:**
   ```python
   # Use background tasks for heavy computations
   from fastapi import BackgroundTasks
   
   @app.post("/predict/async")
   async def predict_async(input_data, background_tasks: BackgroundTasks):
       background_tasks.add_task(process_prediction, input_data)
   ```

## 🎯 Next Steps

1. **Provide your ML model files** - I'll help you integrate them
2. **Test the integration** - Run the test scripts
3. **Customize the prediction logic** - Update the methods with your model specifics
4. **Deploy to production** - Follow the deployment guide

Let me know when you have your ML model ready, and I'll help you integrate it with the backend!

