import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, Eye, Brain, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { useData } from '../contexts/DataContext';

export default function Predictions() {
  const { outbreakData } = useData();
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [selectedModel, setSelectedModel] = useState('lstm');

  // Generate prediction data
  const predictionData = Array.from({ length: 14 }, (_, i) => ({
    date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(),
    risk: Math.max(20, Math.min(80, 45 + Math.sin(i * 0.5) * 15 + Math.random() * 10)),
    cases: Math.max(10, Math.min(50, 25 + Math.sin(i * 0.3) * 8 + Math.random() * 5)),
    confidence: Math.max(70, 95 - i * 2),
  }));

  const featureImportance = [
    { feature: 'Temperature', importance: 0.85 },
    { feature: 'Humidity', importance: 0.72 },
    { feature: 'Population Density', importance: 0.68 },
    { feature: 'Previous Cases', importance: 0.91 },
    { feature: 'Wastewater Levels', importance: 0.63 },
    { feature: 'Social Media Sentiment', importance: 0.45 },
  ];

  const alerts = [
    {
      id: 1,
      severity: 'high',
      message: 'Predicted 40% increase in respiratory cases over next 48 hours',
      timestamp: '2 minutes ago',
      confidence: 89,
    },
    {
      id: 2,
      severity: 'medium',
      message: 'Elevated wastewater viral load detected in district 3',
      timestamp: '15 minutes ago',
      confidence: 76,
    },
    {
      id: 3,
      severity: 'low',
      message: 'Weather patterns suggest increased transmission risk',
      timestamp: '1 hour ago',
      confidence: 62,
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300';
      case 'low': return 'bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300';
      default: return 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AI Predictions & Alerts</h1>
            <p className="text-orange-100 mt-1">Early warning system with 89% accuracy</p>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-white/20 text-white border border-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="lstm">LSTM Neural Network</option>
              <option value="arima">ARIMA Time Series</option>
              <option value="ensemble">Ensemble Model</option>
            </select>
            <select 
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-white/20 text-white border border-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="24h">24 Hours</option>
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Active Alerts
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">3 active alerts</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className={`p-4 border rounded-lg ${getSeverityColor(alert.severity)}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{alert.message}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className="text-sm">{alert.timestamp}</span>
                      <span className="text-sm">Confidence: {alert.confidence}%</span>
                    </div>
                  </div>
                </div>
                <button className="text-sm font-medium hover:underline">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prediction Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Prediction */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              14-Day Risk Forecast
            </h3>
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">AI Model: {selectedModel.toUpperCase()}</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={predictionData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Area 
                type="monotone" 
                dataKey="risk" 
                stroke="#f97316" 
                fill="#f97316" 
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="confidence" 
                stroke="#8b5cf6" 
                fill="#8b5cf6" 
                fillOpacity={0.1}
                strokeWidth={1}
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Feature Importance */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Model Feature Importance
            </h3>
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Explainable AI</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={featureImportance} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis type="number" domain={[0, 1]} className="text-xs" />
              <YAxis dataKey="feature" type="category" width={100} className="text-xs" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value) => [`${(value as number * 100).toFixed(1)}%`, 'Importance']}
              />
              <Bar 
                dataKey="importance" 
                fill="#3b82f6"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Model Performance Metrics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Accuracy</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">89.3%</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">+2.1% from last month</p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Precision</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-300">85.7%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">+1.3% from last month</p>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Recall</p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-300">91.2%</p>
              </div>
              <Eye className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">+0.8% from last month</p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">F1 Score</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">88.4%</p>
              </div>
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">+1.5% from last month</p>
          </div>
        </div>
      </div>
    </div>
  );
}