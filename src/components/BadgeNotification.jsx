import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const BadgeNotification = ({ badges }) => {
  return (
    <AnimatePresence>
      {badges && badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className="relative bg-gradient-to-br from-yellow-900/90 via-amber-900/90 to-orange-900/90 rounded-2xl p-6 border-2 border-yellow-400/50 backdrop-blur-md shadow-2xl overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-orange-400/10 animate-pulse" />
            
            {/* Glow effect */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400/20 blur-3xl rounded-full" />

            <div className="relative z-10">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl"
                >
                  🏆
                </motion.div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <p className="text-sm font-bold text-yellow-100">Badge Unlocked!</p>
                  </div>
                  <h3 className="text-lg font-bold text-white">{badges[0].name}</h3>
                  <p className="text-xs text-yellow-200">{badges[0].description}</p>
                </div>
              </div>

              {/* Show rarity */}
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${
                    badges[0].rarity === 'legendary'
                      ? 'bg-yellow-500/30 text-yellow-200 border border-yellow-400'
                      : badges[0].rarity === 'epic'
                      ? 'bg-purple-500/30 text-purple-200 border border-purple-400'
                      : badges[0].rarity === 'rare'
                      ? 'bg-blue-500/30 text-blue-200 border border-blue-400'
                      : 'bg-slate-500/30 text-slate-200 border border-slate-400'
                  }`}
                >
                  {badges[0].rarity}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
