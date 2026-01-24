import React from 'react';
import { motion } from 'framer-motion';
import { X, Download, Wifi, WifiOff } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

export const PWABanner = () => {
  const { showInstallPrompt, isOnline, installApp, dismissInstallPrompt, isInstalled } = usePWA();

  if (isInstalled) return null;

  return (
    <>
      {/* Online/Offline indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed top-0 left-0 right-0 py-2 px-4 text-center text-sm font-medium ${
          isOnline 
            ? 'bg-green-500/10 text-green-400' 
            : 'bg-red-500/10 text-red-400'
        } flex items-center justify-center gap-2 z-40`}
      >
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4" />
            You're online
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            You're offline - using cached data
          </>
        )}
      </motion.div>

      {/* Install prompt */}
      {showInstallPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-slate-800 border-t border-sky-500/30 p-4 shadow-2xl md:bottom-6 md:left-6 md:right-auto md:w-96 md:rounded-lg z-40"
        >
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-white mb-1 text-sm md:text-base">Install Streak Maintainer</h3>
              <p className="text-xs md:text-sm text-slate-300 mb-3">
                Get quick access to your streaks right from your home screen.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={installApp}
                  className="flex-1 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-medium py-2 px-4 rounded-lg text-xs md:text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Install
                </button>
                <button
                  onClick={dismissInstallPrompt}
                  className="px-3 py-2 text-slate-300 hover:text-white text-xs md:text-sm transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};
