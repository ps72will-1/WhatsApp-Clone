import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

const PageNotFound = () => {
  const { appName, logoPath } = useApp();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-dark-bg">
      <img src={logoPath} alt={appName} className="h-20 w-auto mb-4" />
      <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">404 - Page Not Found</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        Go to Home
      </Link>
    </div>
  );
};

export default PageNotFound;