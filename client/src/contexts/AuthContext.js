import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const navigate = useNavigate();

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is authenticated on load
  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Get user profile
        const res = await axios.get('/api/users/profile');
        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check error:', error);
        // Clear token if invalid
        localStorage.removeItem('token');
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token]);

  // Register user with email
  const register = async (formData) => {
    try {
      const res = await axios.post('/api/auth/register-email', formData);
      
      // Save token and set user
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  // Login user with email
  const login = async (formData) => {
    try {
      const res = await axios.post('/api/auth/login-email', formData);
      
      // Save token and set user
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  // Send OTP for phone verification
  const sendOTP = async (phone) => {
    try {
      const res = await axios.post('/api/auth/send-otp', { phone });
      return { 
        success: true, 
        isNewUser: res.data.isNewUser 
      };
    } catch (error) {
      console.error('Send OTP error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to send OTP' 
      };
    }
  };

  // Verify OTP
  const verifyOTP = async (phone, code) => {
    try {
      const res = await axios.post('/api/auth/verify-otp', { phone, code });
      
      if (res.data.isNewUser) {
        // New user needs to set up account
        return { 
          success: true, 
          isNewUser: true, 
          phone 
        };
      }
      
      // Existing user, set up authentication
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data);
      setIsAuthenticated(true);
      
      return { 
        success: true, 
        isNewUser: false 
      };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Invalid OTP' 
      };
    }
  };

  // Set up account after phone verification
  const setupAccount = async (formData) => {
    try {
      const res = await axios.post('/api/auth/setup-account', formData);
      
      // Save token and set user
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error('Setup account error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to set up account' 
      };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      await axios.post('/api/auth/forgot-password', { email });
      return { success: true };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to send reset email' 
      };
    }
  };

  // Logout
  const logout = async () => {
    try {
      if (token) {
        await axios.post('/api/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear token and user data
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  // Update user profile
  const updateProfile = async (formData) => {
    try {
      const res = await axios.put('/api/users/profile', formData);
      setUser(res.data);
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to update profile' 
      };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    register,
    login,
    sendOTP,
    verifyOTP,
    setupAccount,
    forgotPassword,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};