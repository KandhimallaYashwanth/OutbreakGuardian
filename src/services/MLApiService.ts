// API Service for ML model integration via backend
export interface MLPredictionInput {
  temperature: number;
  humidity: number;
  populationDensity: number;
  previousCases: number;
  wastewaterLevels: number;
  socialMediaSentiment: number;
  timestamp: string;
}

export interface MLPredictionOutput {
  riskLevel: number;
  predictedCases: number;
  confidence: number;
  featureImportance: {
    temperature: number;
    humidity: number;
    populationDensity: number;
    previousCases: number;
    wastewaterLevels: number;
    socialMediaSentiment: number;
  };
}

export interface OptimizationInput {
  beds: number;
  nurses: number;
  doctors: number;
  equipment: number;
  currentWaitTimes: number[];
  patientFlow: number[];
}

export interface OptimizationOutput {
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
  recommendations: string[];
}

class MLApiService {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string = 'http://localhost:8000/api', apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  // Set API configuration
  setConfig(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  // Get headers for API requests
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  // Predict outbreak risk and cases
  async predictOutbreak(input: MLPredictionInput): Promise<MLPredictionOutput> {
    try {
      const response = await fetch(`${this.baseUrl}/predict`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`Prediction API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Prediction API failed:', error);
      // Fallback to simulation if API fails
      return this.simulatePrediction(input);
    }
  }

  // Optimize resource allocation
  async optimizeResources(input: OptimizationInput): Promise<OptimizationOutput> {
    try {
      const response = await fetch(`${this.baseUrl}/optimize`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`Optimization API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Optimization API failed:', error);
      // Fallback to simulation if API fails
      return this.simulateOptimization(input);
    }
  }

  // Batch prediction for multiple time points
  async predictBatch(inputs: MLPredictionInput[]): Promise<MLPredictionOutput[]> {
    try {
      const response = await fetch(`${this.baseUrl}/predict/batch`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ inputs }),
      });

      if (!response.ok) {
        throw new Error(`Batch prediction API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result.predictions;
    } catch (error) {
      console.error('Batch prediction API failed:', error);
      // Fallback to individual predictions
      const predictions = [];
      for (const input of inputs) {
        const prediction = await this.predictOutbreak(input);
        predictions.push(prediction);
      }
      return predictions;
    }
  }

  // Get model status and information
  async getModelInfo(): Promise<{ isLoaded: boolean; version?: string; accuracy?: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/model/info`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Model info API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Model info API failed:', error);
      return {
        isLoaded: false,
        version: 'Unknown',
        accuracy: 0
      };
    }
  }

  // Health check for API
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // Simulate prediction (fallback when API is unavailable)
  private simulatePrediction(input: MLPredictionInput): MLPredictionOutput {
    const riskLevel = Math.min(100, Math.max(0, 
      30 + (input.temperature - 20) * 0.5 + 
      (input.humidity - 50) * 0.3 + 
      input.previousCases * 0.8 + 
      input.wastewaterLevels * 0.6
    ));

    const predictedCases = Math.max(0, 
      input.previousCases * 1.1 + 
      (input.populationDensity / 1000) * 0.5 +
      (input.socialMediaSentiment - 0.5) * 10
    );

    return {
      riskLevel: Math.round(riskLevel),
      predictedCases: Math.round(predictedCases),
      confidence: Math.min(95, 70 + Math.random() * 25),
      featureImportance: {
        temperature: 0.85,
        humidity: 0.72,
        populationDensity: 0.68,
        previousCases: 0.91,
        wastewaterLevels: 0.63,
        socialMediaSentiment: 0.45
      }
    };
  }

  // Simulate optimization (fallback when API is unavailable)
  private simulateOptimization(input: OptimizationInput): OptimizationOutput {
    const optimizedBeds = Math.min(100, input.beds + 5);
    const optimizedNurses = Math.min(150, input.nurses + 10);
    const optimizedDoctors = Math.min(50, input.doctors + 2);
    const optimizedEquipment = Math.min(100, input.equipment + 3);

    return {
      optimizedAllocation: {
        beds: optimizedBeds,
        nurses: optimizedNurses,
        doctors: optimizedDoctors,
        equipment: optimizedEquipment
      },
      expectedImprovements: {
        waitTimeReduction: 28,
        bedUtilization: 92,
        staffEfficiency: 15,
        patientSatisfaction: 22
      },
      recommendations: [
        'Redistribute 12 beds from General Ward to ICU',
        'Schedule additional nursing staff during peak hours (2-6 PM)',
        'Relocate portable equipment to Emergency Department'
      ]
    };
  }
}

// Export singleton instance
export const mlApiService = new MLApiService();
