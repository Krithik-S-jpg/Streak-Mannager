import React from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { badgeService } from '../services/badgeService';

export const BadgesDisplay = ({ earnedBadges, maxDisplay = 6 }) => {
  const displayed = earnedBadges.slice(0, maxDisplay);
  const remaining = Math.max(0, earnedBadges.length - maxDisplay);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Award className="w-5 h-5 text-yellow-400" />
        <h3 className="text-sm font-bold text-white">
          Achievements ({earnedBadges.length})
        </h3>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {displayed.map((badge, idx) => {
          const badgeInfo = badgeService.getBadgeById(badge.badge_id || badge.id);
          if (!badgeInfo) return null;

          const rarityColors = {
            legendary: 'from-yellow-500/20 via-yellow-400/10 to-yellow-500/20 border-yellow-400/50',
            epic: 'from-purple-500/20 via-purple-400/10 to-purple-500/20 border-purple-400/50',
            rare: 'from-blue-500/20 via-blue-400/10 to-blue-500/20 border-blue-400/50',
            common: 'from-slate-600/20 via-slate-500/10 to-slate-600/20 border-slate-500/50',
          };

          return (
            <motion.div
              key={badgeInfo.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`relative group rounded-lg p-3 text-center border bg-gradient-to-br ${
                rarityColors[badgeInfo.rarity]
              } backdrop-blur-sm hover:shadow-lg transition-all`}
            >
              <div className="text-3xl mb-1">{badgeInfo.icon}</div>
              <p className="text-[10px] font-bold text-white leading-tight line-clamp-2">
                {badgeInfo.name.split(' ').pop()}
              </p>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-left whitespace-nowrap text-xs text-slate-200 shadow-lg">
                  <p className="font-bold text-white">{badgeInfo.name}</p>
                  <p>{badgeInfo.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* +X More */}
        {remaining > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-lg p-3 text-center border border-slate-500/50 bg-gradient-to-br from-slate-700/20 via-slate-600/10 to-slate-700/20 backdrop-blur-sm flex items-center justify-center"
          >
            <span className="text-sm font-bold text-slate-300">+{remaining}</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};
