import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Target, Zap } from 'lucide-react';
import { statsService } from '../services/statsService';

export const StatisticsView = ({ streak }) => {
  const stats = statsService.getStreakStats(streak);

  const statCards = [
    {
      icon: TrendingUp,
      label: 'Current Streak',
      value: stats.currentStreak,
      color: 'text-orange-400',
      bgColor: 'from-orange-900/20 to-orange-900/5',
    },
    {
      icon: Target,
      label: 'Best Streak',
      value: stats.bestStreak,
      color: 'text-amber-400',
      bgColor: 'from-amber-900/20 to-amber-900/5',
    },
    {
      icon: Calendar,
      label: 'Days Active',
      value: stats.daysActive,
      color: 'text-blue-400',
      bgColor: 'from-blue-900/20 to-blue-900/5',
    },
    {
      icon: Zap,
      label: 'Consistency',
      value: `${stats.consistency}%`,
      color: 'text-yellow-400',
      bgColor: 'from-yellow-900/20 to-yellow-900/5',
    },
  ];

  const detailStats = [
    { label: 'Total Check-ins', value: stats.totalCheckIns, unit: '' },
    { label: 'This Month', value: stats.checkInsThisMonth, unit: 'check-ins' },
    { label: 'This Year', value: stats.checkInsThisYear, unit: 'check-ins' },
    { label: 'Avg per Week', value: stats.averagePerWeek, unit: 'days' },
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative overflow-hidden rounded-xl p-4 border border-slate-700/30 bg-gradient-to-br ${card.bgColor} backdrop-blur-sm`}
            >
              <div className="flex items-start justify-between mb-3">
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className="text-xs font-medium text-slate-400 mb-1">{card.label}</p>
              <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Stats */}
      <div className="bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 rounded-2xl p-6 border border-slate-700/30 backdrop-blur-md">
        <h3 className="text-lg font-bold text-white mb-4">Detailed Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {detailStats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800/50"
            >
              <span className="text-sm text-slate-400">{stat.label}</span>
              <div className="text-right">
                <span className="text-lg font-bold text-white">{stat.value}</span>
                {stat.unit && <p className="text-xs text-slate-500">{stat.unit}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
