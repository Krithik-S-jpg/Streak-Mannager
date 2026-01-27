import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Flame, Target, Award } from 'lucide-react';

export const AnalyticsDashboard = ({ streaks = [] }) => {
  // Calculate statistics
  const totalActiveStreaks = streaks.filter(s => !s.archived).length;
  const totalCheckIns = streaks.reduce((sum, s) => sum + (s.currentCount || 0), 0);
  const longestStreak = Math.max(...streaks.map(s => s.bestCount || 0), 0);
  const averageStreak = totalActiveStreaks > 0 
    ? Math.round(streaks.reduce((sum, s) => sum + (s.currentCount || 0), 0) / totalActiveStreaks)
    : 0;

  const stats = [
    {
      label: 'Active Streaks',
      value: totalActiveStreaks,
      icon: Flame,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      label: 'Total Check-ins',
      value: totalCheckIns,
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Best Streak',
      value: longestStreak,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Average Streak',
      value: averageStreak,
      icon: Award,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.bgColor} rounded-xl p-4 border border-slate-700/30 backdrop-blur`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                {stat.label}
              </p>
              <div className={`bg-gradient-to-br ${stat.color} p-2 rounded-lg`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </motion.div>
        );
      })}
    </div>
  );
};
