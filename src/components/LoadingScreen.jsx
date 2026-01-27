import React from 'react';
import { motion } from 'framer-motion';

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <div className="text-center">
        {/* Fire symbol with animation */}
        <motion.div
          className="text-7xl mb-8"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          🔥
        </motion.div>

        {/* App name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold text-orange-500 mb-2">
            Streak Maintainer
          </h1>
          <p className="text-slate-400 text-sm">Building habits, one day at a time</p>
        </motion.div>

        {/* Loading dots */}
        <motion.div
          className="mt-12 flex justify-center items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            className="w-2 h-2 bg-orange-500 rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="w-2 h-2 bg-orange-500 rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 bg-orange-500 rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
          />
        </motion.div>

        {/* Status text */}
        <motion.p
          className="text-slate-500 text-xs mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Getting your streaks ready...
        </motion.p>
      </div>
    </div>
  );
};
