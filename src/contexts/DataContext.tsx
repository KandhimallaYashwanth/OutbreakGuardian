import React, { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    // Initialize with sample data
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

    // Simulate real-time updates every 10 seconds
    const interval = setInterval(() => {
      const newDataPoint: OutbreakData = {
        timestamp: new Date().toISOString(),
        riskLevel: Math.floor(Math.random() * 30) + 30,
        confirmedCases: Math.floor(Math.random() * 20) + 15,
        predictedCases: Math.floor(Math.random() * 25) + 20,
        bedUtilization: Math.floor(Math.random() * 20) + 70,
        staffLoad: Math.floor(Math.random() * 30) + 60,
        waitTime: Math.floor(Math.random() * 20) + 30,
      };

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
  }, []);

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
    <DataContext.Provider value={{ outbreakData, currentMetrics, updateMetrics }}>
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