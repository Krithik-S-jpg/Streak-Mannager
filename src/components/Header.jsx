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
    <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <span className="text-3xl">🔥</span>
          <h1 className="text-2xl font-bold text-slate-100">Streak Maintainer</h1>
        </motion.div>

        {/* User info and actions */}
        <div className="flex items-center gap-4">
          {user && (
            <>
              <span className="text-sm text-slate-400 hidden sm:inline">
                {user.email}
              </span>
              <button
                onClick={onSettingsClick}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-red-900/20 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
