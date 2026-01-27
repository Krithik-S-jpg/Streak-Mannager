import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Filter, Lock } from 'lucide-react';
import { badgeService } from '../services/badgeService';

export const AchievementsView = ({ userId }) => {
  const [allBadges, setAllBadges] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBadges = async () => {
      try {
        const badges = await badgeService.getAllBadgesWithStatus(userId);
        setAllBadges(badges);
        setLoading(false);
      } catch (error) {
        console.error('Error loading badges:', error);
        setLoading(false);
      }
    };

    if (userId) {
      loadBadges();
    }
  }, [userId]);

  const filteredBadges = allBadges.filter(badge => {
    if (filter === 'earned') return badge.earned;
    if (filter === 'locked') return !badge.earned;
    if (filter === 'legendary') return badge.rarity === 'legendary';
    if (filter === 'epic') return badge.rarity === 'epic';
    return true;
  });

  const earnedCount = allBadges.filter(b => b.earned).length;
  const totalCount = allBadges.length;

  const rarityColors = {
    legendary: {
      bg: 'from-yellow-500/20 via-yellow-400/10 to-yellow-500/20',
      border: 'border-yellow-400/50',
      text: 'text-yellow-300',
      label: 'bg-yellow-500/20 text-yellow-200 border border-yellow-400',
    },
    epic: {
      bg: 'from-purple-500/20 via-purple-400/10 to-purple-500/20',
      border: 'border-purple-400/50',
      text: 'text-purple-300',
      label: 'bg-purple-500/20 text-purple-200 border border-purple-400',
    },
    rare: {
      bg: 'from-blue-500/20 via-blue-400/10 to-blue-500/20',
      border: 'border-blue-400/50',
      text: 'text-blue-300',
      label: 'bg-blue-500/20 text-blue-200 border border-blue-400',
    },
    common: {
      bg: 'from-slate-600/20 via-slate-500/10 to-slate-600/20',
      border: 'border-slate-500/50',
      text: 'text-slate-300',
      label: 'bg-slate-500/20 text-slate-200 border border-slate-400',
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-slate-400">Loading achievements...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-900/20 via-amber-900/20 to-orange-900/20 rounded-2xl p-6 border border-yellow-700/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-yellow-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Achievements</h2>
              <p className="text-sm text-slate-400">
                {earnedCount} of {totalCount} badges earned
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-yellow-400">{earnedCount}</p>
            <p className="text-xs text-slate-400">Badges</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950/50 rounded-full h-2 border border-slate-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(earnedCount / totalCount) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {['all', 'earned', 'locked', 'legendary', 'epic'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              filter === f
                ? 'bg-orange-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.length > 0 ? (
          filteredBadges.map((badge, idx) => {
            const colors = rarityColors[badge.rarity];
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`relative rounded-xl p-6 border bg-gradient-to-br ${colors.bg} ${colors.border} backdrop-blur-sm group cursor-pointer hover:shadow-lg transition-all ${
                  !badge.earned ? 'opacity-60' : ''
                }`}
              >
                {/* Locked overlay */}
                {!badge.earned && (
                  <div className="absolute inset-0 bg-slate-950/40 rounded-xl flex items-center justify-center group-hover:bg-slate-950/20 transition-all">
                    <Lock className="w-8 h-8 text-slate-400" />
                  </div>
                )}

                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{badge.icon}</div>
                  {badge.earned && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    >
                      ✓
                    </motion.div>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{badge.name}</h3>
                <p className="text-sm text-slate-300 mb-3">{badge.description}</p>

                {/* Rarity badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-block px-3 py-1 rounded text-xs font-bold uppercase tracking-wide ${colors.label}`}
                  >
                    {badge.rarity}
                  </span>
                  {badge.earned && badge.earnedAt && (
                    <span className="text-xs text-slate-400">
                      {new Date(badge.earnedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-400">No badges in this category yet</p>
          </div>
        )}
      </div>

      {/* Rarity Legend */}
      <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
        <p className="text-xs font-bold text-slate-400 uppercase mb-3">Rarity Levels</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries({
            Legendary: 'legendary',
            Epic: 'epic',
            Rare: 'rare',
            Common: 'common',
          }).map(([label, rarity]) => (
            <div key={rarity} className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full border-2 ${
                  rarity === 'legendary'
                    ? 'bg-yellow-400 border-yellow-300'
                    : rarity === 'epic'
                    ? 'bg-purple-400 border-purple-300'
                    : rarity === 'rare'
                    ? 'bg-blue-400 border-blue-300'
                    : 'bg-slate-400 border-slate-300'
                }`}
              />
              <span className="text-xs text-slate-400">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
