import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertCircle, Database, Wifi } from 'lucide-react';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  status: 'processing' | 'completed' | 'error';
}

export default function DataUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [apiConnections, setApiConnections] = useState({
    weather: true,
    social: false,
    wastewater: true,
    medical: true,
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      status: 'processing' as const,
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate file processing
    setTimeout(() => {
      setUploadedFiles(prev => 
        prev.map(file => 
          newFiles.some(newFile => newFile.name === file.name)
            ? { ...file, status: 'completed' }
            : file
        )
      );
    }, 2000);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    multiple: true,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Data Upload & Integration</h1>
        <p className="text-green-100 mt-1">Upload datasets and manage API connections for AI analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Upload */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Upload Data Files
          </h2>
          
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
              isDragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-blue-600 dark:text-blue-400">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Supports CSV, JSON, and Excel files
                </p>
              </div>
            )}
          </div>

          {/* File List */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Uploaded Files
              </h3>
              <div className="space-y-3">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    {getStatusIcon(file.status)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* API Connections */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            API Data Sources
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="flex items-center space-x-3">
                <Wifi className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Weather API</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Climate data integration</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {apiConnections.weather ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-600">Disconnected</span>
                  </div>
                )}
                <button
                  onClick={() => setApiConnections(prev => ({ ...prev, weather: !prev.weather }))}
                  className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800"
                >
                  {apiConnections.weather ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="flex items-center space-x-3">
                <Database className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Social Media API</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Social sentiment analysis</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {apiConnections.social ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-600">Disconnected</span>
                  </div>
                )}
                <button
                  onClick={() => setApiConnections(prev => ({ ...prev, social: !prev.social }))}
                  className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800"
                >
                  {apiConnections.social ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="flex items-center space-x-3">
                <Database className="h-5 w-5 text-teal-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Wastewater API</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">CDC wastewater monitoring</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {apiConnections.wastewater ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-600">Disconnected</span>
                  </div>
                )}
                <button
                  onClick={() => setApiConnections(prev => ({ ...prev, wastewater: !prev.wastewater }))}
                  className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800"
                >
                  {apiConnections.wastewater ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="flex items-center space-x-3">
                <Database className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Medical Records</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Hospital EHR integration</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {apiConnections.medical ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-600">Disconnected</span>
                  </div>
                )}
                <button
                  onClick={() => setApiConnections(prev => ({ ...prev, medical: !prev.medical }))}
                  className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800"
                >
                  {apiConnections.medical ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
              Data Processing Status
            </h3>
            <div className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
              <p>• Weather data: Last updated 5 minutes ago</p>
              <p>• Wastewater data: Last updated 1 hour ago</p>
              <p>• Medical records: Real-time sync active</p>
              <p>• Social media: Connection needed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}