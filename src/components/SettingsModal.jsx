import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Moon, Zap, LogOut, Eye, Lock, X } from 'lucide-react';
import { Modal, Button, Select, Badge } from './common';
import { useAuth } from '../hooks/useAuth';

export const SettingsModal = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    dailyReminder: '09:00',
    theme: 'dark',
    strikeNotifications: true,
    soundEnabled: true,
    vibrationEnabled: true,
    analyticsCookie: false,
  });

  const [activeTab, setActiveTab] = useState('general');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
    // Save to localStorage
    localStorage.setItem('streakSettings', JSON.stringify({
      ...settings,
      [key]: value,
    }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'about', label: 'About', icon: 'ℹ️' },
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Settings"
      actions={
        <Button variant="secondary" onClick={onClose}>
          <X className="w-4 h-4" />
          Close
        </Button>
      }
    >
      <div className="space-y-6">
        {/* User Info */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/30 rounded-lg p-4 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold">
              {user?.displayName ? user.displayName[0].toUpperCase() : '👤'}
            </div>
            <div>
              <p className="font-semibold text-white">{user?.displayName || 'User'}</p>
              <p className="text-sm text-slate-400">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-700 -mx-6 px-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-sky-500 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {/* General Tab */}
          {activeTab === 'general' && (
            <>
              <div>
                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                    className="w-4 h-4 accent-sky-500"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-white flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Dark Mode
                    </p>
                    <p className="text-sm text-slate-400">Use dark theme for easy on the eyes</p>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  <Zap className="w-4 h-4 inline mr-1" />
                  Daily Reminder Time
                </label>
                <input
                  type="time"
                  value={settings.dailyReminder}
                  onChange={(e) => handleSettingChange('dailyReminder', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-200 mb-3">Theme Color</p>
                <div className="grid grid-cols-4 gap-2">
                  {['orange', 'blue', 'purple', 'green'].map(color => (
                    <button
                      key={color}
                      onClick={() => handleSettingChange('theme', color)}
                      className={`h-10 rounded-lg transition-all border-2 ${
                        settings.theme === color
                          ? `border-${color}-400`
                          : 'border-slate-700'
                      } bg-${color}-600/30`}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <>
              <div>
                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                    className="w-4 h-4 accent-sky-500"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-white flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Push Notifications
                    </p>
                    <p className="text-sm text-slate-400">Receive notifications on check-ins</p>
                  </div>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={settings.strikeNotifications}
                    onChange={(e) => handleSettingChange('strikeNotifications', e.target.checked)}
                    className="w-4 h-4 accent-sky-500"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-white">Streak Notifications</p>
                    <p className="text-sm text-slate-400">Alert when streak is about to break</p>
                  </div>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
                    className="w-4 h-4 accent-sky-500"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-white">Sound Effects</p>
                    <p className="text-sm text-slate-400">Play sound on check-in</p>
                  </div>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={settings.vibrationEnabled}
                    onChange={(e) => handleSettingChange('vibrationEnabled', e.target.checked)}
                    className="w-4 h-4 accent-sky-500"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-white">Haptic Feedback</p>
                    <p className="text-sm text-slate-400">Vibration on mobile devices</p>
                  </div>
                </label>
              </div>
            </>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <>
              <div>
                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={settings.analyticsCookie}
                    onChange={(e) => handleSettingChange('analyticsCookie', e.target.checked)}
                    className="w-4 h-4 accent-sky-500"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-white flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Analytics Cookies
                    </p>
                    <p className="text-sm text-slate-400">Help us improve the app</p>
                  </div>
                </label>
              </div>

              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                <p className="text-sm text-slate-300 mb-3">
                  <strong>Data Privacy:</strong> Your streak data is encrypted and stored securely. We never share your personal information.
                </p>
                <Button variant="secondary" size="sm" className="w-full">
                  View Privacy Policy
                </Button>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-200 mb-2">Export Data</p>
                <Button variant="secondary" size="sm" className="w-full">
                  Download Your Data
                </Button>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-200 mb-2">Danger Zone</p>
                <Button variant="danger" size="sm" className="w-full text-red-300">
                  Delete Account
                </Button>
              </div>
            </>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <>
              <div className="text-center py-4">
                <div className="text-5xl mb-4">🔥</div>
                <h3 className="text-xl font-bold text-white mb-1">Streak Maintainer</h3>
                <p className="text-slate-400 text-sm mb-2">v1.0.0</p>
                <p className="text-slate-400 text-sm">Progressive Web App</p>
              </div>

              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50 space-y-3">
                <div>
                  <p className="text-sm font-semibold text-slate-300">Features:</p>
                  <ul className="text-sm text-slate-400 space-y-1 mt-2">
                    <li>✅ Track multiple streaks</li>
                    <li>✅ Push notifications</li>
                    <li>✅ Offline support</li>
                    <li>✅ Mobile optimized</li>
                    <li>✅ Install as app</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <Button variant="secondary" size="sm" className="w-full">
                  🐛 Report a Bug
                </Button>
                <Button variant="secondary" size="sm" className="w-full">
                  💡 Send Feedback
                </Button>
                <Button variant="secondary" size="sm" className="w-full">
                  📱 Visit Website
                </Button>
              </div>

              <p className="text-center text-xs text-slate-500 pt-4">
                © 2026 Streak Maintainer. Keep your streaks alive! 🔥
              </p>
            </>
          )}
        </div>

        {/* Logout Button */}
        <div className="border-t border-slate-700 pt-4">
          <Button
            variant="danger"
            className="w-full"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Logout Confirmation */}
        {showLogoutConfirm && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-300 mb-3">Are you sure you want to logout?</p>
            <div className="flex gap-2">
              <Button
                variant="danger"
                size="sm"
                className="flex-1"
                onClick={handleLogout}
              >
                Logout
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
      </div>
    </Modal>
  );
};
