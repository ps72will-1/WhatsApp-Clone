import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Header from './Header';

const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-dark-bg">
      <Header />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-panel">
          <NavLink 
            to="/" 
            end
            className={({ isActive }) => 
              isActive 
                ? "nav-tab active" 
                : "nav-tab"
            }
          >
            <i className="fas fa-comment mr-2"></i>
            <span>Chats</span>
          </NavLink>
          <NavLink 
            to="/status" 
            className={({ isActive }) => 
              isActive 
                ? "nav-tab active" 
                : "nav-tab"
            }
          >
            <i className="fas fa-circle mr-2"></i>
            <span>Status</span>
          </NavLink>
          <NavLink 
            to="/calls" 
            className={({ isActive }) => 
              isActive 
                ? "nav-tab active" 
                : "nav-tab"
            }
          >
            <i className="fas fa-phone mr-2"></i>
            <span>Calls</span>
          </NavLink>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;