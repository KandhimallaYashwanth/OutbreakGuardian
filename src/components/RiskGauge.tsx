import React from 'react';

interface RiskGaugeProps {
  value: number; // 0-100
}

export default function RiskGauge({ value }: RiskGaugeProps) {
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  
  const getRiskLevel = (val: number) => {
    if (val >= 70) return { level: 'High', color: 'text-red-600' };
    if (val >= 40) return { level: 'Medium', color: 'text-yellow-600' };
    return { level: 'Low', color: 'text-green-600' };
  };
  
  const risk = getRiskLevel(value);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
        Outbreak Risk Level
      </h3>
      
      <div className="relative flex items-center justify-center">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-gray-200 dark:text-gray-700"
          />
          
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={value >= 70 ? '#dc2626' : value >= 40 ? '#d97706' : '#059669'}
            strokeWidth="6"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-in-out"
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}%
            </div>
            <div className={`text-sm font-medium ${risk.color}`}>
              {risk.level}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-green-600">Low (0-39%)</span>
          <span className="text-yellow-600">Medium (40-69%)</span>
          <span className="text-red-600">High (70-100%)</span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="h-2 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"></div>
        </div>
      </div>
    </div>
  );
}