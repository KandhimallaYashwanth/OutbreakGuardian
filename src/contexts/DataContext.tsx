import React, { createContext, useContext, useState, useEffect } from 'react';
import { mlService, MLPredictionInput, MLPredictionOutput } from '../services/MLService';
import { mlApiService } from '../services/MLApiService';

interface OutbreakData {
  timestamp: string;
  riskLevel: number;
  confirmedCases: number;
  predictedCases: number;
  bedUtilization: number;
  staffLoad: number;
  waitTime: number;
}

interface DataContextType {
  outbreakData: OutbreakData[];
  currentMetrics: {
    riskLevel: number;
    activeCases: number;
    bedUtilization: number;
    avgWaitTime: number;
    staffEfficiency: number;
  };
  updateMetrics: () => void;
  useMLPredictions: boolean;
  setUseMLPredictions: (use: boolean) => void;
  mlModelInfo: {
    isLoaded: boolean;
    version?: string;
    accuracy?: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [outbreakData, setOutbreakData] = useState<OutbreakData[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState({
    riskLevel: 45,
    activeCases: 23,
    bedUtilization: 78,
    avgWaitTime: 42,
    staffEfficiency: 85,
  });
  const [useMLPredictions, setUseMLPredictions] = useState(false);
  const [mlModelInfo, setMlModelInfo] = useState({
    isLoaded: false,
    version: undefined as string | undefined,
    accuracy: undefined as number | undefined,
  });

  // Initialize ML model
  useEffect(() => {
    const initializeML = async () => {
      try {
        // Try to load client-side model first
        await mlService.loadModel('/models/outbreak-model.json');
        setMlModelInfo(mlService.getModelInfo());
        setUseMLPredictions(true);
      } catch (error) {
        console.log('Client-side model not available, trying API...');
        try {
          // Try API service
          const isHealthy = await mlApiService.healthCheck();
          if (isHealthy) {
            const modelInfo = await mlApiService.getModelInfo();
            setMlModelInfo(modelInfo);
            setUseMLPredictions(true);
          }
        } catch (apiError) {
          console.log('API model not available, using simulation mode');
          setUseMLPredictions(false);
        }
      }
    };

    initializeML();
  }, []);

  // Generate ML prediction input from current data
  const generateMLInput = (): MLPredictionInput => {
    const now = new Date();
    return {
      temperature: 20 + Math.random() * 15, // Simulate weather data
      humidity: 40 + Math.random() * 40,
      populationDensity: 1000 + Math.random() * 2000,
      previousCases: currentMetrics.activeCases,
      wastewaterLevels: Math.random() * 100,
      socialMediaSentiment: 0.3 + Math.random() * 0.4,
      timestamp: now.toISOString(),
    };
  };

  // Get ML prediction
  const getMLPrediction = async (): Promise<MLPredictionOutput | null> => {
    if (!useMLPredictions) return null;

    try {
      const input = generateMLInput();
      return await mlService.predictOutbreak(input);
    } catch (error) {
      console.error('ML prediction failed:', error);
      return null;
    }
  };

  useEffect(() => {
    // Initialize with sample data
    const initializeData = async () => {
      const initialData = Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
        riskLevel: Math.floor(Math.random() * 30) + 30,
        confirmedCases: Math.floor(Math.random() * 20) + 15,
        predictedCases: Math.floor(Math.random() * 25) + 20,
        bedUtilization: Math.floor(Math.random() * 20) + 70,
        staffLoad: Math.floor(Math.random() * 30) + 60,
        waitTime: Math.floor(Math.random() * 20) + 30,
      }));
      setOutbreakData(initialData);
    };

    initializeData();

    // Simulate real-time updates every 10 seconds
    const interval = setInterval(async () => {
      let newDataPoint: OutbreakData;

      if (useMLPredictions) {
        // Use ML model for predictions
        const mlPrediction = await getMLPrediction();
        if (mlPrediction) {
          newDataPoint = {
            timestamp: new Date().toISOString(),
            riskLevel: mlPrediction.riskLevel,
            confirmedCases: currentMetrics.activeCases,
            predictedCases: mlPrediction.predictedCases,
            bedUtilization: Math.floor(Math.random() * 20) + 70,
            staffLoad: Math.floor(Math.random() * 30) + 60,
            waitTime: Math.floor(Math.random() * 20) + 30,
          };
        } else {
          // Fallback to simulation
          newDataPoint = {
            timestamp: new Date().toISOString(),
            riskLevel: Math.floor(Math.random() * 30) + 30,
            confirmedCases: Math.floor(Math.random() * 20) + 15,
            predictedCases: Math.floor(Math.random() * 25) + 20,
            bedUtilization: Math.floor(Math.random() * 20) + 70,
            staffLoad: Math.floor(Math.random() * 30) + 60,
            waitTime: Math.floor(Math.random() * 20) + 30,
          };
        }
      } else {
        // Use simulation
        newDataPoint = {
          timestamp: new Date().toISOString(),
          riskLevel: Math.floor(Math.random() * 30) + 30,
          confirmedCases: Math.floor(Math.random() * 20) + 15,
          predictedCases: Math.floor(Math.random() * 25) + 20,
          bedUtilization: Math.floor(Math.random() * 20) + 70,
          staffLoad: Math.floor(Math.random() * 30) + 60,
          waitTime: Math.floor(Math.random() * 20) + 30,
        };
      }

      setOutbreakData(prev => [...prev.slice(1), newDataPoint]);
      
      // Update current metrics
      setCurrentMetrics({
        riskLevel: newDataPoint.riskLevel,
        activeCases: newDataPoint.confirmedCases,
        bedUtilization: newDataPoint.bedUtilization,
        avgWaitTime: newDataPoint.waitTime,
        staffEfficiency: 100 - newDataPoint.staffLoad,
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [useMLPredictions]);

  const updateMetrics = () => {
    setCurrentMetrics(prev => ({
      ...prev,
      riskLevel: Math.floor(Math.random() * 30) + 30,
      activeCases: Math.floor(Math.random() * 20) + 15,
      bedUtilization: Math.floor(Math.random() * 20) + 70,
      avgWaitTime: Math.floor(Math.random() * 20) + 30,
      staffEfficiency: Math.floor(Math.random() * 20) + 75,
    }));
  };

  return (
    <DataContext.Provider value={{ 
      outbreakData, 
      currentMetrics, 
      updateMetrics,
      useMLPredictions,
      setUseMLPredictions,
      mlModelInfo
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}