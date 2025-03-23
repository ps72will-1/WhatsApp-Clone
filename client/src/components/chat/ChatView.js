import React from 'react';
import { useApp } from '../../contexts/AppContext';

const ChatView = () => {
  const { appName } = useApp();
  
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Welcome to {appName}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
        This is a placeholder for the chat interface. In a complete implementation, 
        this would show your conversations and messages.
      </p>
    </div>
  );
};

export default ChatView;