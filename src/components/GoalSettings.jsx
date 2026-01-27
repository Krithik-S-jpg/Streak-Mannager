import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, ChevronDown } from 'lucide-react';
import { Button } from './common';

export const GoalSettings = ({ goalCount, targetCount, onUpdateGoal, loading }) => {
  const [showForm, setShowForm] = useState(false);
  const [target, setTarget] = useState(targetCount || 30);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onUpdateGoal({
        target_count: Math.max(1, target),
      });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to update goal:', error);
    }
  };

  const progress = targetCount > 0 ? Math.min(100, (goalCount / targetCount) * 100) : 0;

  return (
    <div className="bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 rounded-2xl p-6 border border-slate-700/30 backdrop-blur-md">
      <div className="flex items-center gap-3 mb-4">
        <Target className="w-5 h-5 text-amber-400" />
        <h3 className="text-lg font-bold text-white">Goal</h3>
      </div>

      {/* Progress Display */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">Daily Target</span>
          <span className="text-sm font-bold text-white">{goalCount} / {targetCount || 30}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-2 bg-slate-950/50 rounded-full overflow-hidden border border-slate-800/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 to-orange-500"
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Percentage */}
        <div className="text-center">
          <p className="text-2xl font-bold text-amber-400">{Math.round(progress)}%</p>
          <p className="text-xs text-slate-500 mt-1">
            {Math.max(0, targetCount - goalCount)} left today
          </p>
        </div>
      </div>

      {/* Edit Goal Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full flex items-center justify-between p-3 bg-slate-950/50 hover:bg-slate-950/70 rounded-lg border border-slate-800/50 hover:border-amber-500/30 transition-colors"
      >
        <span className="text-sm text-slate-400">Edit Goal</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${
            showForm ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Edit Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-3 p-3 bg-slate-950/30 rounded-lg border border-slate-700/50 mt-3"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-2">
              Daily Target
            </label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max="100"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white text-sm focus:outline-none focus:border-amber-500"
            />
            <p className="text-xs text-slate-500 mt-1">Set how many times you want to complete this streak today</p>
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="flex-1"
              disabled={loading}
            >
              Update Goal
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
        </motion.form>
      )}
    </div>
  );
};
