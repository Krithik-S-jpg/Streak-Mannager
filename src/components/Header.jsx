import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Header = ({ onSettingsClick }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      try {
        await logout();
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 backdrop-blur-md border-b border-blue-100 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <motion.span 
            className="text-4xl"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            🔥
          </motion.span>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Streak Maintainer
          </h1>
        </motion.div>

        {/* User info and actions */}
        <div className="flex items-center gap-4">
          {user && (
            <>
              <span className="text-sm font-medium text-slate-600 hidden sm:inline">
                {user.email}
              </span>
              <motion.button
                onClick={onSettingsClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-100 rounded-xl transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-100 rounded-xl transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
