# ML Model Integration Guide for OutbreakGuardian

This guide explains how to integrate your trained ML model into the OutbreakGuardian application.

## Overview

The application has been updated to support both client-side and server-side ML model integration. You can choose the approach that best fits your model format and deployment preferences.

## Integration Options

### Option 1: Client-Side Integration (Recommended for small models)

If your model is in a JavaScript-compatible format (TensorFlow.js, ONNX.js, or custom JS), you can run it directly in the browser.

#### Supported Formats:
- **TensorFlow.js**: `.json` + `.bin` files
- **ONNX.js**: `.onnx` files
- **Custom JavaScript**: `.js` files with model logic

#### Steps:

1. **Prepare your model files:**
   ```bash
   # Create models directory
   mkdir public/models
   
   # Copy your model files
   cp your-model.json public/models/outbreak-model.json
   cp your-model.bin public/models/outbreak-model.bin  # if using TensorFlow.js
   ```

2. **Update the MLService.ts file:**
   
   Replace the simulation methods in `src/services/MLService.ts` with your actual model logic:

   ```typescript
   // In MLService.ts, replace simulatePrediction method:
   private simulatePrediction(input: MLPredictionInput): any {
     // Replace this with your actual model prediction
     const modelInput = [
       input.temperature,
       input.humidity,
       input.populationDensity,
       input.previousCases,
       input.wastewaterLevels,
       input.socialMediaSentiment
     ];
     
     // Your model prediction logic here
     const prediction = yourModel.predict(modelInput);
     
     return {
       riskLevel: prediction.riskLevel,
       predictedCases: prediction.predictedCases,
       confidence: prediction.confidence,
       featureImportance: prediction.featureImportance
     };
   }
   ```

3. **For TensorFlow.js models:**
   ```typescript
   // Uncomment and modify the TensorFlow.js section in loadModel method:
   const tf = await import('@tensorflow/tfjs');
   this.model = await tf.loadLayersModel('/models/outbreak-model.json');
   ```

4. **For ONNX.js models:**
   ```typescript
   // Uncomment and modify the ONNX.js section in loadModel method:
   const ort = await import('onnxruntime-web');
   this.model = await ort.InferenceSession.create('/models/outbreak-model.onnx');
   ```

### Option 2: Backend API Integration (Recommended for large models)

If your model is deployed as a REST API or you prefer server-side processing.

#### Steps:

1. **Deploy your model as a REST API:**
   
   Create a backend service (Python Flask/FastAPI, Node.js, etc.) with endpoints:
   
   ```python
   # Example Flask API
   from flask import Flask, request, jsonify
   import your_model

   app = Flask(__name__)
   model = your_model.load_model()

   @app.route('/api/predict', methods=['POST'])
   def predict():
       data = request.json
       prediction = model.predict(data)
       return jsonify(prediction)

   @app.route('/api/optimize', methods=['POST'])
   def optimize():
       data = request.json
       optimization = model.optimize(data)
       return jsonify(optimization)

   @app.route('/api/health', methods=['GET'])
   def health():
       return jsonify({"status": "healthy"})
   ```

2. **Update API configuration:**
   
   In `src/services/MLApiService.ts`, update the base URL:
   
   ```typescript
   // Update the constructor
   constructor(baseUrl: string = 'http://your-api-server:8000/api', apiKey?: string) {
     this.baseUrl = baseUrl;
     this.apiKey = apiKey;
   }
   ```

3. **Configure CORS:**
   
   Make sure your API server allows CORS requests from your frontend domain.

## Model Input/Output Format

### Input Format (MLPredictionInput):
```typescript
interface MLPredictionInput {
  temperature: number;        // Weather temperature
  humidity: number;          // Weather humidity
  populationDensity: number; // Population density in area
  previousCases: number;     // Previous confirmed cases
  wastewaterLevels: number;  // Wastewater viral levels
  socialMediaSentiment: number; // Social media sentiment (0-1)
  timestamp: string;         // ISO timestamp
}
```

### Output Format (MLPredictionOutput):
```typescript
interface MLPredictionOutput {
  riskLevel: number;         // Outbreak risk (0-100)
  predictedCases: number;    // Predicted number of cases
  confidence: number;        // Model confidence (0-100)
  featureImportance: {       // Feature importance scores
    temperature: number;
    humidity: number;
    populationDensity: number;
    previousCases: number;
    wastewaterLevels: number;
    socialMediaSentiment: number;
  };
}
```

### Optimization Input (OptimizationInput):
```typescript
interface OptimizationInput {
  beds: number;              // Available beds
  nurses: number;            // Nursing staff count
  doctors: number;           // Doctor count
  equipment: number;         // Equipment availability
  currentWaitTimes: number[]; // Current wait times by department
  patientFlow: number[];     // Patient flow by department
}
```

### Optimization Output (OptimizationOutput):
```typescript
interface OptimizationOutput {
  optimizedAllocation: {
    beds: number;
    nurses: number;
    doctors: number;
    equipment: number;
  };
  expectedImprovements: {
    waitTimeReduction: number;
    bedUtilization: number;
    staffEfficiency: number;
    patientSatisfaction: number;
  };
  recommendations: string[]; // AI-generated recommendations
}
```

## Testing Your Integration

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Check the browser console:**
   - Look for "ML model loaded successfully" message
   - Check for any error messages

3. **Test predictions:**
   - Navigate to the Predictions page
   - Verify that real predictions are being generated
   - Check that feature importance matches your model

4. **Test optimization:**
   - Navigate to the Optimization page
   - Click "Run Optimization"
   - Verify that ML-based recommendations are generated

## Troubleshooting

### Common Issues:

1. **Model not loading:**
   - Check that model files are in the correct location
   - Verify file paths in the code
   - Check browser console for errors

2. **CORS errors (API integration):**
   - Configure CORS on your API server
   - Check API endpoint URLs

3. **Prediction errors:**
   - Verify input format matches your model expectations
   - Check that your model returns the expected output format

4. **Performance issues:**
   - Consider using Web Workers for large models
   - Implement model caching
   - Use batch predictions when possible

## Advanced Configuration

### Environment Variables:
Create a `.env` file for configuration:
```env
VITE_ML_API_URL=http://localhost:8000/api
VITE_ML_API_KEY=your-api-key
VITE_ML_MODEL_PATH=/models/outbreak-model.json
```

### Model Versioning:
Update the model version in `MLService.ts`:
```typescript
getModelInfo(): { isLoaded: boolean; version?: string; accuracy?: number } {
  return {
    isLoaded: this.isModelLoaded,
    version: '2.0.0', // Update version
    accuracy: 92.5 // Update accuracy
  };
}
```

### Custom Model Loading:
For custom model formats, modify the `loadModel` method in `MLService.ts`:
```typescript
async loadModel(modelPath: string): Promise<void> {
  try {
    // Your custom model loading logic here
    const modelData = await fetch(modelPath);
    this.model = await this.parseCustomModel(await modelData.json());
    this.isModelLoaded = true;
  } catch (error) {
    console.error('Failed to load model:', error);
    throw error;
  }
}
```

## Production Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy model files:**
   - Ensure model files are accessible via HTTP
   - Consider using CDN for better performance

3. **Configure production API:**
   - Update API URLs for production environment
   - Set up proper authentication
   - Configure rate limiting

## Support

If you encounter issues with the integration:

1. Check the browser console for error messages
2. Verify your model input/output format matches the interfaces
3. Test your model independently before integration
4. Check network requests in browser dev tools

The application will gracefully fall back to simulation mode if your ML model fails to load or predict, ensuring the application remains functional.

