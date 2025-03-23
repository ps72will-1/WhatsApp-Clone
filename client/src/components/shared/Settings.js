import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const Settings = () => {
  const { appName, logoPath, darkMode, toggleDarkMode, updateAppBranding } = useApp();
  const { user, logout } = useAuth();
  
  const [brandingOpen, setBrandingOpen] = useState(false);
  const [newAppName, setNewAppName] = useState(appName);
  const [newLogoFile, setNewLogoFile] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(logoPath);
  
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewLogoFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleBrandingSubmit = async (e) => {
    e.preventDefault();
    
    // In a real app, you would upload the logo file to a server
    // For this demo, we'll just update the app name and use the preview URL
    const success = await updateAppBranding(newAppName, previewLogo);
    
    if (success) {
      toast.success('Branding updated successfully');
      setBrandingOpen(false);
    } else {
      toast.error('Failed to update branding');
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Settings</h1>
      
      {/* Profile Section */}
      <div className="bg-white dark:bg-dark-panel rounded-lg shadow-sm mb-4 p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Profile</h2>
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden mr-4">
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                <i className="fas fa-user text-2xl"></i>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-800 dark:text-white">{user?.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{user?.status || 'Available'}</p>
            {user?.email && (
              <p className="text-gray-600 dark:text-gray-400 text-sm">{user.email}</p>
            )}
            {user?.phone && (
              <p className="text-gray-600 dark:text-gray-400 text-sm">{user.phone}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Appearance */}
      <div className="bg-white dark:bg-dark-panel rounded-lg shadow-sm mb-4 p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Appearance</h2>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-800 dark:text-white">Dark Mode</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Toggle dark theme</p>
          </div>
          <button 
            onClick={toggleDarkMode}
            className="flex items-center justify-center w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none"
          >
            <div className={`w-5 h-5 rounded-full transition-transform duration-200 transform ${
              darkMode ? 'translate-x-2 bg-primary' : '-translate-x-2 bg-white'
            }`}></div>
          </button>
        </div>
      </div>
      
      {/* Branding (Admin only in a real app) */}
      <div className="bg-white dark:bg-dark-panel rounded-lg shadow-sm mb-4 p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">App Branding</h2>
          <button 
            onClick={() => setBrandingOpen(!brandingOpen)}
            className="text-primary hover:underline focus:outline-none"
          >
            {brandingOpen ? 'Cancel' : 'Customize'}
          </button>
        </div>
        
        {!brandingOpen ? (
          <div className="flex items-center mt-4">
            <img src={logoPath} alt={appName} className="h-10 w-auto mr-3" />
            <h3 className="font-medium text-gray-800 dark:text-white">{appName}</h3>
          </div>
        ) : (
          <form onSubmit={handleBrandingSubmit} className="mt-4">
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                App Name
              </label>
              <input
                type="text"
                value={newAppName}
                onChange={(e) => setNewAppName(e.target.value)}
                className="input-field"
                placeholder="Enter app name"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                Logo
              </label>
              <div className="flex items-center">
                <img 
                  src={previewLogo} 
                  alt="Logo Preview" 
                  className="h-16 w-auto mr-3 rounded"
                />
                <label className="btn btn-secondary cursor-pointer">
                  <input
                    type="file"
                    onChange={handleLogoChange}
                    className="hidden"
                    accept="image/*"
                  />
                  Choose Logo
                </label>
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary">
              Update Branding
            </button>
          </form>
        )}
      </div>
      
      {/* Logout Button */}
      <button 
        onClick={logout}
        className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
      >
        <i className="fas fa-sign-out-alt mr-2"></i> Logout
      </button>
    </div>
  );
};

export default Settings;