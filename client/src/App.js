import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './contexts/AppContext';
import { useAuth } from './contexts/AuthContext';

// Pages
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PhoneAuth from './components/auth/PhoneAuth';
import SetupAccount from './components/auth/SetupAccount';
import MainLayout from './components/shared/MainLayout';
import ChatView from './components/chat/ChatView';
import StatusView from './components/status/StatusView';
import CallsView from './components/calls/CallsView';
import Settings from './components/shared/Settings';
import PageNotFound from './components/shared/PageNotFound';

const App = () => {
  const { darkMode } = useApp();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Apply dark mode class to document if enabled
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
    
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/phone-auth" element={<PhoneAuth />} />
      <Route path="/setup-account" element={<SetupAccount />} />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<ChatView />} />
        <Route path="status" element={<StatusView />} />
        <Route path="calls" element={<CallsView />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      {/* 404 Page */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default App;