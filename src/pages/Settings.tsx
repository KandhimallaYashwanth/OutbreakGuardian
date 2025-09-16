import React, { useState } from 'react';
import { Moon, Sun, Shield, Lock, Bell, Eye, Database, Globe } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function Settings() {
  const { isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    alerts: true,
    reports: true,
    system: false,
  });
  const [privacy, setPrivacy] = useState({
    dataRetention: '90',
    anonymization: true,
    sharing: false,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-600 to-gray-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Settings & Configuration</h1>
        <p className="text-gray-200 mt-1">Customize your OutbreakGuardian experience</p>
      </div>

      {/* Theme Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Appearance
        </h2>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isDark ? <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" /> : <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />}
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isDark ? 'Currently using dark theme' : 'Currently using light theme'}
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isDark ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDark ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span>Notifications</span>
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">High Risk Alerts</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receive notifications for critical outbreak predictions
              </p>
            </div>
            <button
              onClick={() => setNotifications(prev => ({ ...prev, alerts: !prev.alerts }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                notifications.alerts ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.alerts ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Daily Reports</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Get daily summary reports of system performance
              </p>
            </div>
            <button
              onClick={() => setNotifications(prev => ({ ...prev, reports: !prev.reports }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                notifications.reports ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.reports ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">System Notifications</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Updates about system maintenance and features
              </p>
            </div>
            <button
              onClick={() => setNotifications(prev => ({ ...prev, system: !prev.system }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                notifications.system ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.system ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Privacy & Security</span>
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Retention Period
            </label>
            <select
              value={privacy.dataRetention}
              onChange={(e) => setPrivacy(prev => ({ ...prev, dataRetention: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="180">180 days</option>
              <option value="365">1 year</option>
            </select>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              How long to keep historical data for analysis
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Eye className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Data Anonymization</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Automatically anonymize sensitive patient data
                </p>
              </div>
            </div>
            <button
              onClick={() => setPrivacy(prev => ({ ...prev, anonymization: !prev.anonymization }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                privacy.anonymization ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacy.anonymization ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">External Data Sharing</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Share anonymized insights with health authorities
                </p>
              </div>
            </div>
            <button
              onClick={() => setPrivacy(prev => ({ ...prev, sharing: !prev.sharing }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                privacy.sharing ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacy.sharing ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>System Information</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">AI Model Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">LSTM Model Version:</span>
                <span className="text-gray-900 dark:text-white">v2.3.1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Last Training:</span>
                <span className="text-gray-900 dark:text-white">2 days ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Accuracy:</span>
                <span className="text-green-600">89.3%</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">Data Sources</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Weather API:</span>
                <span className="text-green-600">Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Wastewater Data:</span>
                <span className="text-green-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Social Media:</span>
                <span className="text-red-600">Disconnected</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bias Analysis Summary */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800">
        <h2 className="text-xl font-semibold text-indigo-900 dark:text-indigo-300 mb-4">
          AI Bias Analysis Summary
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">92%</div>
            <p className="text-sm text-indigo-700 dark:text-indigo-300">Fairness Score</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">0.85</div>
            <p className="text-sm text-indigo-700 dark:text-indigo-300">Demographic Parity</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">Low</div>
            <p className="text-sm text-indigo-700 dark:text-indigo-300">Bias Risk Level</p>
          </div>
        </div>
        
        <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-4">
          The AI model shows minimal bias across demographic groups and maintains high fairness standards 
          in outbreak predictions and resource allocation recommendations.
        </p>
      </div>
    </div>
  );
}