import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import DataUpload from './pages/DataUpload';
import Predictions from './pages/Predictions';
import Optimization from './pages/Optimization';
import Settings from './pages/Settings';
import Login from './pages/Login';
import ChatbotWidget from './components/ChatbotWidget';
import { useAuth } from './hooks/useAuth';
import { AuthProvider } from './contexts/AuthContext';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:ml-64 pt-16">
          <div className="p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/data-upload" element={<DataUpload />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/optimization" element={<Optimization />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
      </div>
      <ChatbotWidget />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;