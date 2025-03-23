import React from 'react';

const StatusView = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Status</h2>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
        This is a placeholder for the status view. In a complete implementation,
        this would show status updates from your contacts.
      </p>
    </div>
  );
};

export default StatusView;