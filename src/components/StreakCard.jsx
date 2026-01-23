import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.2)" }}
      className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 border-2 border-blue-100 hover:border-blue-300 transition-all group cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <motion.span 
            className="text-6xl"
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
          >
            {streak.icon}
          </motion.span>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{streak.name}</h3>
            <Badge variant="primary" className="text-xs font-semibold capitalize">
              {streak.category}
            </Badge>
          </div>
        </div>
        <motion.button
          onClick={() => setShowActions(!showActions)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${showActions ? 'rotate-180' : ''}`} />
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-200 rounded-2xl p-4 text-center hover:border-blue-300 transition-all"
        >
          <p className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-wider">Current</p>
          <motion.p 
            key={streak.currentStreak}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold text-blue-600"
          >
            {streak.currentStreak}
          </motion.p>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-amber-100 to-amber-50 border-2 border-amber-200 rounded-2xl p-4 text-center hover:border-amber-300 transition-all"
        >
          <p className="text-xs font-bold text-amber-600 mb-2 uppercase tracking-wider">Best</p>
          <motion.p 
            key={streak.longestStreak}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold text-amber-600"
          >
            {streak.longestStreak}
          </motion.p>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-purple-100 to-purple-50 border-2 border-purple-200 rounded-2xl p-4 text-center hover:border-purple-300 transition-all"
        >
          <p className="text-xs font-bold text-purple-600 mb-2 uppercase tracking-wider">Freezes</p>
          <motion.p 
            key={streak.freezesLeft}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold text-purple-600"
          >
            {streak.freezesLeft}
          </motion.p>
        </motion.div>
      </div>

      {/* Last check-in */}
      {streak.lastCheckIn && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm font-medium text-slate-600 mb-6 flex items-center gap-2"
        >
          <motion.span 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-3 h-3 bg-green-500 rounded-full"
          ></motion.span>
          Last checked in: {formatDate(streak.lastCheckIn)}
        </motion.p>
      )}

      {/* Primary action button */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={() => onCheckIn(streak.id)}
          disabled={checkedInToday || loading}
          variant={checkedInToday ? 'secondary' : 'primary'}
          size="lg"
          className="w-full mb-4"
        >
          {checkedInToday ? '✓ Checked In Today' : '🔥 Check In Today'}
        </Button>
      </motion.div>

      {/* Action menu */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 pt-6 border-t-2 border-slate-200"
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
      </AnimatePresence>
    </motion.div>
  );
};
