import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Trash2, Zap, RotateCcw } from 'lucide-react';
import { hasCheckedInToday, formatDate } from '../utils/streakUtils';
import { Button, Badge } from './common';

export const StreakCard = ({
  streak,
  onCheckIn,
  onUseFreeze,
  onRecover,
  onEdit,
  onDelete,
  loading,
}) => {
  const [showActions, setShowActions] = useState(false);
  const checkedInToday = hasCheckedInToday(streak);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-sky-600/50 transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{streak.icon}</span>
          <div>
            <h3 className="text-lg font-bold text-slate-100">{streak.name}</h3>
            <Badge variant="primary" className="text-xs mt-1">
              {streak.category}
            </Badge>
          </div>
        </div>
        <button
          onClick={() => setShowActions(!showActions)}
          className="text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-slate-900 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-400 mb-1">Current</p>
          <p className="text-2xl font-bold text-sky-400">{streak.currentStreak}</p>
        </div>
        <div className="bg-slate-900 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-400 mb-1">Best</p>
          <p className="text-2xl font-bold text-amber-400">{streak.longestStreak}</p>
        </div>
        <div className="bg-slate-900 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-400 mb-1">Freezes</p>
          <p className="text-2xl font-bold text-purple-400">{streak.freezesLeft}/2</p>
        </div>
      </div>

      {/* Last check-in */}
      {streak.lastCheckIn && (
        <p className="text-xs text-slate-400 mb-4">
          Last check-in: {formatDate(streak.lastCheckIn)}
        </p>
      )}

      {/* Primary action button */}
      <Button
        onClick={() => onCheckIn(streak.id)}
        disabled={checkedInToday || loading}
        variant={checkedInToday ? 'secondary' : 'primary'}
        className="w-full mb-3"
      >
        {checkedInToday ? '✓ Checked In Today' : '🔥 Check In Today'}
      </Button>

      {/* Action menu */}
      {showActions && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-2 pt-3 border-t border-slate-700"
        >
          <Button
            onClick={() => {
              onUseFreeze(streak.id);
              setShowActions(false);
            }}
            disabled={streak.freezesLeft === 0 || loading}
            variant="secondary"
            size="sm"
            className="w-full"
          >
            <Zap className="w-4 h-4" />
            Use Freeze
          </Button>
          <Button
            onClick={() => {
              onRecover(streak.id);
              setShowActions(false);
            }}
            disabled={loading}
            variant="ghost"
            size="sm"
            className="w-full"
          >
            <RotateCcw className="w-4 h-4" />
            Recover (-2 days)
          </Button>
          <Button
            onClick={() => {
              onEdit(streak);
              setShowActions(false);
            }}
            variant="ghost"
            size="sm"
            className="w-full"
          >
            Edit
          </Button>
          <Button
            onClick={() => {
              onDelete(streak.id);
              setShowActions(false);
            }}
            variant="danger"
            size="sm"
            className="w-full"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};
