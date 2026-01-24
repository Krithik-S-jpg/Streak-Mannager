import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Moon, Zap, LogOut, Lock, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button, Alert } from '../components/common';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    dailyReminder: '09:00',
    strikeNotifications: true,
    soundEnabled: true,
    vibrationEnabled: true,
    analyticsCookie: false,
  });

  const [message, setMessage] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('streakSettings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (err) {
        console.error('Error loading settings:', err);
      }
    }
  }, []);

  const handleSettingChange = (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    
    // Save immediately
    localStorage.setItem('streakSettings', JSON.stringify(updated));
    
    // Apply theme if it's darkMode
    if (key === 'darkMode') {
      if (value) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    setMessage({ type: 'success', text: 'Setting updated!' });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      setMessage({ type: 'error', text: 'Logout failed' });
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'about', label: 'About', icon: 'ℹ️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header totalCheckIns={0} />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Messages */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert type={message.type} message={message.text} onClose={() => setMessage(null)} />
          </motion.div>
        )}

        {/* Back Button & Title */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            title="Back to Dashboard"
          >
            <ChevronLeft className="w-6 h-6 text-slate-400 hover:text-white" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-white">Settings</h1>
            <p className="text-slate-400 mt-1">Customize your experience</p>
          </div>
        </div>

        {/* User Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-slate-800/50 to-slate-700/30 rounded-xl p-6 mb-8 border border-slate-700/50"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
              {user?.displayName ? user.displayName[0].toUpperCase() : '👤'}
            </div>
            <div>
              <p className="font-semibold text-white text-lg">{user?.displayName || 'User'}</p>
              <p className="text-sm text-slate-400">{user?.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Settings Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tabs Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-900/60 to-slate-800/40 rounded-xl border border-slate-700/50 p-3 space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all font-medium flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-sky-600/20 text-sky-300 border border-sky-500/30'
                      : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/30'
                  }`}
                >
                  <span>{tab.icon}</span> {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-gradient-to-br from-slate-900/60 to-slate-800/40 rounded-xl border border-slate-700/50 p-6 space-y-6"
            >
              {/* General Settings */}
              {activeTab === 'general' && (
                <>
                  <div>
                    <label className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={settings.darkMode}
                        onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                        className="w-5 h-5 accent-sky-500 cursor-pointer"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-white flex items-center gap-2">
                          <Moon className="w-5 h-5" />
                          Dark Mode
                        </p>
                        <p className="text-sm text-slate-400">Use dark theme for easy on the eyes</p>
                      </div>
                    </label>
                  </div>

                  <div className="border-t border-slate-700 pt-6">
                    <label className="block">
                      <p className="font-semibold text-white mb-3 flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Daily Reminder Time
                      </p>
                      <input
                        type="time"
                        value={settings.dailyReminder}
                        onChange={(e) => handleSettingChange('dailyReminder', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                      />
                      <p className="text-sm text-slate-400 mt-2">You'll get reminders at this time daily</p>
                    </label>
                  </div>
                </>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={settings.notifications}
                        onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                        className="w-5 h-5 accent-sky-500 cursor-pointer"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-white flex items-center gap-2">
                          <Bell className="w-5 h-5" />
                          Push Notifications
                        </p>
                        <p className="text-sm text-slate-400">Receive notifications on check-ins</p>
                      </div>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={settings.strikeNotifications}
                        onChange={(e) => handleSettingChange('strikeNotifications', e.target.checked)}
                        className="w-5 h-5 accent-sky-500 cursor-pointer"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-white">Streak Warnings</p>
                        <p className="text-sm text-slate-400">Alert when a streak is about to break</p>
                      </div>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={settings.soundEnabled}
                        onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
                        className="w-5 h-5 accent-sky-500 cursor-pointer"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-white">🔊 Sound Effects</p>
                        <p className="text-sm text-slate-400">Play sound on successful check-in</p>
                      </div>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={settings.vibrationEnabled}
                        onChange={(e) => handleSettingChange('vibrationEnabled', e.target.checked)}
                        className="w-5 h-5 accent-sky-500 cursor-pointer"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-white">📳 Haptic Feedback</p>
                        <p className="text-sm text-slate-400">Vibration feedback on mobile devices</p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={settings.analyticsCookie}
                        onChange={(e) => handleSettingChange('analyticsCookie', e.target.checked)}
                        className="w-5 h-5 accent-sky-500 cursor-pointer"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-white flex items-center gap-2">
                          <Lock className="w-5 h-5" />
                          Analytics
                        </p>
                        <p className="text-sm text-slate-400">Help us improve by sharing usage data</p>
                      </div>
                    </label>
                  </div>

                  <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50 space-y-3">
                    <div>
                      <p className="font-semibold text-white mb-2">🔐 Data Privacy</p>
                      <p className="text-sm text-slate-300">
                        Your streak data is encrypted and stored securely in Supabase. We never share your personal information with third parties.
                      </p>
                    </div>
                    <Button variant="secondary" size="sm" className="w-full">
                      📄 View Privacy Policy
                    </Button>
                  </div>

                  <Button variant="secondary" size="sm" className="w-full">
                    📥 Download Your Data
                  </Button>
                </div>
              )}

              {/* About */}
              {activeTab === 'about' && (
                <div className="space-y-6 text-center">
                  <div>
                    <p className="text-6xl mb-4">🔥</p>
                    <h3 className="text-2xl font-bold text-white mb-1">Streak Maintainer</h3>
                    <p className="text-slate-400">v1.0.0 - Progressive Web App</p>
                  </div>

                  <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                    <p className="text-sm font-semibold text-slate-300 mb-3">✨ Features</p>
                    <ul className="text-sm text-slate-400 space-y-2">
                      <li>✅ Track multiple streaks</li>
                      <li>✅ Push notifications</li>
                      <li>✅ Offline support</li>
                      <li>✅ Mobile optimized</li>
                      <li>✅ Install as app</li>
                      <li>✅ Secure storage</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <Button variant="secondary" size="sm" className="w-full">
                      🐛 Report a Bug
                    </Button>
                    <Button variant="secondary" size="sm" className="w-full">
                      💡 Send Feedback
                    </Button>
                  </div>

                  <p className="text-xs text-slate-500 pt-4 border-t border-slate-700">
                    © 2026 Streak Maintainer. Keep your streaks alive! 🔥
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Logout Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-gradient-to-br from-red-900/20 to-red-800/10 rounded-xl border border-red-700/30 p-6"
        >
          <h3 className="text-lg font-bold text-red-300 mb-4">Danger Zone</h3>
          
          {showLogoutConfirm && (
            <div className="bg-red-500/10 rounded-lg p-4 mb-4 border border-red-500/30">
              <p className="text-red-300 font-medium mb-3">Are you sure you want to logout?</p>
              <div className="flex gap-3">
                <Button
                  variant="danger"
                  size="sm"
                  className="flex-1"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Confirm Logout
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {!showLogoutConfirm && (
            <Button
              variant="danger"
              className="w-full"
              onClick={() => setShowLogoutConfirm(true)}
            >
              <LogOut className="w-5 h-5" />
              Logout
            </Button>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};
