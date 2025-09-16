import React, { useState } from 'react';
import { Bed, Users, Clock, Activity, Settings, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface ResourceAllocation {
  beds: number;
  nurses: number;
  doctors: number;
  equipment: number;
}

export default function Optimization() {
  const [resources, setResources] = useState<ResourceAllocation>({
    beds: 85,
    nurses: 120,
    doctors: 35,
    equipment: 90,
  });

  const [isOptimizing, setIsOptimizing] = useState(false);

  const optimizationResults = [
    { department: 'ICU', current: 78, optimized: 65, improvement: 13 },
    { department: 'Emergency', current: 45, optimized: 32, improvement: 13 },
    { department: 'Surgery', current: 62, optimized: 48, improvement: 14 },
    { department: 'General', current: 35, optimized: 28, improvement: 7 },
    { department: 'Pediatrics', current: 41, optimized: 33, improvement: 8 },
  ];

  const impactMetrics = [
    { metric: 'Wait Time Reduction', value: '28%', color: 'text-green-600' },
    { metric: 'Bed Utilization', value: '92%', color: 'text-blue-600' },
    { metric: 'Staff Efficiency', value: '+15%', color: 'text-purple-600' },
    { metric: 'Patient Satisfaction', value: '+22%', color: 'text-orange-600' },
  ];

  const handleResourceChange = (resource: keyof ResourceAllocation, value: number) => {
    setResources(prev => ({ ...prev, [resource]: value }));
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsOptimizing(false);
  };

  const timeSeriesData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    current: Math.floor(Math.random() * 20) + 40,
    optimized: Math.floor(Math.random() * 15) + 25,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Resource Optimization</h1>
            <p className="text-purple-100 mt-1">AI-powered resource allocation for maximum efficiency</p>
          </div>
          <button
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Zap className="h-5 w-5" />
            <span>{isOptimizing ? 'Optimizing...' : 'Run Optimization'}</span>
          </button>
        </div>
      </div>

      {/* Resource Sliders */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Resource Allocation Controls
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Bed className="h-4 w-4" />
                  <span>Available Beds</span>
                </label>
                <span className="text-sm text-gray-500">{resources.beds}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={resources.beds}
                onChange={(e) => handleResourceChange('beds', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Users className="h-4 w-4" />
                  <span>Nursing Staff</span>
                </label>
                <span className="text-sm text-gray-500">{resources.nurses}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="150"
                value={resources.nurses}
                onChange={(e) => handleResourceChange('nurses', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Activity className="h-4 w-4" />
                  <span>Medical Doctors</span>
                </label>
                <span className="text-sm text-gray-500">{resources.doctors}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={resources.doctors}
                onChange={(e) => handleResourceChange('doctors', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Settings className="h-4 w-4" />
                  <span>Equipment</span>
                </label>
                <span className="text-sm text-gray-500">{resources.equipment}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={resources.equipment}
                onChange={(e) => handleResourceChange('equipment', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Impact Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {impactMetrics.map((metric, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{metric.metric}</p>
            <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Optimization Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wait Time Comparison */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Wait Time by Department (minutes)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={optimizationResults}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="department" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Bar dataKey="current" fill="#ef4444" name="Current" radius={[4, 4, 0, 0]} />
              <Bar dataKey="optimized" fill="#10b981" name="Optimized" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 24-Hour Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            24-Hour Wait Time Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="hour" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="current" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Current"
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="optimized" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Optimized"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Optimization Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          AI Recommendations
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-green-800 dark:text-green-300">
                Redistribute 12 beds from General Ward to ICU
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                Expected impact: 15% reduction in ICU wait times
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-300">
                Schedule additional nursing staff during peak hours (2-6 PM)
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                Expected impact: 20% improvement in patient satisfaction
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-yellow-800 dark:text-yellow-300">
                Relocate portable equipment to Emergency Department
              </p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                Expected impact: 25% faster emergency response times
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}