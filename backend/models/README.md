# ML Models Directory

Place your trained ML models in this directory.

## Required Models:

### 1. Outbreak Prediction Model
- **File**: `outbreak_model.pkl`
- **Format**: Pickled scikit-learn model or joblib format
- **Input**: 6 features [temperature, humidity, populationDensity, previousCases, wastewaterLevels, socialMediaSentiment]
- **Output**: [riskLevel, predictedCases, confidence] (3 values)

### 2. Resource Optimization Model
- **File**: `optimization_model.pkl`
- **Format**: Pickled scikit-learn model or joblib format
- **Input**: 6 features [beds, nurses, doctors, equipment, avgWaitTime, avgPatientFlow]
- **Output**: [optimizedBeds, optimizedNurses, optimizedDoctors, optimizedEquipment, waitTimeReduction, bedUtilization, staffEfficiency, patientSatisfaction] (8 values)

## Model Training Example:

```python
import joblib
import numpy as np
from sklearn.ensemble import RandomForestRegressor

# Example outbreak prediction model
outbreak_model = RandomForestRegressor(n_estimators=100, random_state=42)
# Train your model with your data
# outbreak_model.fit(X_train, y_train)

# Save the model
joblib.dump(outbreak_model, 'models/outbreak_model.pkl')

# Example optimization model
optimization_model = RandomForestRegressor(n_estimators=100, random_state=42)
# Train your model with your data
# optimization_model.fit(X_train, y_train)

# Save the model
joblib.dump(optimization_model, 'models/optimization_model.pkl')
```

## Supported Formats:
- `.pkl` (pickle/joblib)
- `.joblib` (joblib)
- `.pkl.gz` (compressed pickle)

## Model Requirements:
- Must be compatible with scikit-learn interface
- Should have `.predict()` method
- Input/output dimensions must match the API specification

