import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [appName, setAppName] = useState('ChatConnect');
  const [logoPath, setLogoPath] = useState('/img/logo.png');
  const [darkMode, setDarkMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [loading, setLoading] = useState(true);

  // Fetch app configuration from the server
  useEffect(() => {
    const fetchAppConfig = async () => {
      try {
        const res = await axios.get('/api/config');
        if (res.data) {
          setAppName(res.data.appName);
          setLogoPath(res.data.logoPath);
        }
      } catch (error) {
        console.error('Error fetching app config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppConfig();

    // Set up dark mode listener
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleDarkModeChange = (e) => {
      setDarkMode(e.matches);
    };

    darkModeMediaQuery.addEventListener('change', handleDarkModeChange);

    return () => {
      darkModeMediaQuery.removeEventListener('change', handleDarkModeChange);
    };
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Update app branding (would normally be an admin function)
  const updateAppBranding = async (name, logo) => {
    try {
      // This would typically make an API call to update branding
      setAppName(name);
      if (logo) {
        setLogoPath(logo);
      }
      return true;
    } catch (error) {
      console.error('Error updating app branding:', error);
      return false;
    }
  };

  const value = {
    appName,
    logoPath,
    darkMode,
    loading,
    toggleDarkMode,
    updateAppBranding
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};