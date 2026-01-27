import React from 'react';
import { motion } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';
import { Button } from './common';
import { StatisticsView } from './StatisticsView';
import { StreakHistory } from './StreakHistory';
import { ReminderSettings } from './ReminderSettings';
import { GoalSettings } from './GoalSettings';

export const StreakDetailsView = ({
  streak,
  reminders,
  onClose,
  onAddReminder,
  onDeleteReminder,
  onUpdateGoal,
  loading,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-l border-slate-800/50"
    >
      {/* Header */}
      <div className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 rounded transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl">{streak.emoji || '🔥'}</span>
                <h1 className="text-2xl font-bold text-white">{streak.name}</h1>
              </div>
              <p className="text-sm text-slate-400 mt-1">{streak.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 max-w-4xl">
        {/* Statistics Section */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Statistics</h2>
          <StatisticsView streak={streak} />
        </div>

        {/* Goals Section */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Daily Goal</h2>
          <GoalSettings
            goalCount={streak.goalCount || 0}
            targetCount={streak.targetCount || 30}
            onUpdateGoal={(updates) => onUpdateGoal(updates)}
            loading={loading}
          />
        </div>

        {/* Reminders Section */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Reminders</h2>
          <ReminderSettings
            reminders={reminders}
            onAddReminder={onAddReminder}
            onDeleteReminder={onDeleteReminder}
            loading={loading}
          />
        </div>

        {/* History Section */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Check-in History</h2>
          <StreakHistory streak={streak} />
        </div>
      </div>
    </motion.div>
  );
};
