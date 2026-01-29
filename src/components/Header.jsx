import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, User, Bell } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { notificationService } from '../services/notificationService';
import { calculateLevel, getNextLevelThreshold } from '../utils/streakUtils';

export const Header = ({ onSettingsClick, totalCheckIns = 0 }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const currentLevelInfo = calculateLevel(totalCheckIns);
  const nextLevelMin = getNextLevelThreshold(currentLevelInfo.level);

  const progress = nextLevelMin
    ? ((totalCheckIns - currentLevelInfo.min) / (nextLevelMin - currentLevelInfo.min)) * 100
    : 100;

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      try {
        await logout();
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
  };

  const testNotification = async () => {
    console.log('🧪 Testing notification...');
    console.log('Permission:', Notification.permission);
    
    if (Notification.permission === 'denied') {
      alert('⚠️ Notifications are blocked. Enable notifications in browser settings.');
      return;
    }

    if (Notification.permission !== 'granted') {
      alert('🔔 Requesting notification permission...');
      const result = await notificationService.requestNotificationPermission();
      console.log('Permission result:', result);
      if (!result) {
        alert('❌ Notification permission denied');
        return;
      }
    }

    try {
      await notificationService.showNotification('🎉 Test Notification!', {
        body: 'If you see this, notifications are working! 🔥',
        tag: 'test-notification',
      });
      console.log('✅ Test notification sent');
    } catch (err) {
      console.error('❌ Failed to send test notification:', err);
      alert('❌ Failed to send notification: ' + err.message);
    }
  };

  return (
    <header className="bg-gradient-to-b from-slate-900/80 to-slate-950 backdrop-blur-xl border-b border-slate-800/50 sticky top-0 z-30 shadow-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 min-w-0"
        >
          <span className="text-2xl sm:text-3xl filter drop-shadow-[0_0_10px_rgba(251,146,60,0.5)] flex-shrink-0">🔥</span>
          <h1 className="text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 truncate">
            Streak Maintainer
          </h1>
        </motion.div>

        {/* Level & Actions */}
        <div className="flex items-center gap-2 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end flex-shrink-0">
          {user && (
            <>
              {/* Level Progress */}
              <div className="flex flex-col items-end mr-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
                  <span>Level {currentLevelInfo.level}</span>
                  <span className="text-slate-500">•</span>
                  <span>{currentLevelInfo.title}</span>
                </div>
                <div className="w-32 h-2 bg-slate-800 rounded-full mt-1 overflow-hidden relative group">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-orange-500 to-red-600"
                  />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/60 flex items-center justify-center text-[8px] text-white transition-opacity">
                    {totalCheckIns} / {nextLevelMin || '∞'} XP
                  </div>
                </div>
              </div>

              {/* User Actions */}
              <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
                <div className="flex items-center gap-2 mr-2">
                   <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-300">
                      {user.displayName ? user.displayName[0].toUpperCase() : <User size={16} />}
                   </div>
                </div>

                {/* Test Notification Button */}
                <button
                  onClick={testNotification}
                  className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-950/30 rounded-lg transition-colors"
                  title="Test Notification"
                >
                  <Bell className="w-5 h-5" />
                </button>

                <button
                  onClick={() => navigate('/settings')}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  title="Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
