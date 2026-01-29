import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Trash2, Zap, RotateCcw, Flame, Calendar, Trophy, Lock, Archive, ArchiveRestore } from 'lucide-react';
import { hasCheckedInToday, formatDate, getNextMilestone } from '../utils/streakUtils';
import { Button, Badge } from './common';

export const StreakCard = ({
  streak,
  onCheckIn,
  onUseFreeze,
  onRecover,
  onEdit,
  onDelete,
  onArchive,
  onUnarchive,
  loading,
}) => {
  const [showActions, setShowActions] = useState(false);
  const checkedInToday = hasCheckedInToday(streak.checkIns);

  // Progress to next milestone
  const nextMilestone = getNextMilestone(streak.currentCount);
  const progressPercent = Math.min(100, (streak.currentCount / nextMilestone) * 100);

  // Fire intensity based on streak count (0-5 scale)
  const fireIntensity = Math.min(5, Math.floor(streak.currentCount / 7));
  const fireColors = [
    'text-slate-500', // 0
    'text-orange-300', // 1
    'text-orange-400', // 2
    'text-orange-500', // 3
    'text-red-500',    // 4
    'text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]' // 5+
  ];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-2xl border border-slate-700/40 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md p-6 shadow-2xl hover:shadow-2xl hover:border-orange-500/40 transition-all duration-300 group`}
    >
      {/* Background glow effect */}
      {checkedInToday && (
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/10 blur-3xl rounded-full pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4 sm:mb-6 relative z-10 gap-2">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <div className="relative flex-shrink-0">
             <span className="text-3xl sm:text-4xl filter drop-shadow-lg">{streak.emoji || '🔥'}</span>
             {checkedInToday && (
               <motion.div
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 className="absolute -bottom-1 -right-1 bg-green-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-slate-900"
               >
                 DONE
               </motion.div>
             )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-xl font-bold text-slate-100 tracking-tight group-hover:text-orange-100 transition-colors truncate">
              {streak.name}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
               <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-slate-600 text-slate-400">
                 {streak.category}
               </Badge>
               {streak.targetCount > 1 && (
                  <span className="text-xs text-slate-500">Goal: {streak.targetCount}/day</span>
               )}
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowActions(!showActions)}
          className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${showActions ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6 relative z-10">
        <div className="bg-slate-950/50 rounded-lg p-3 text-center border border-slate-800/50 group-hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-center gap-1 mb-1 text-slate-400">
             <Flame className={`w-3 h-3 ${fireColors[fireIntensity]}`} fill="currentColor" />
             <span className="text-xs font-medium">Streak</span>
          </div>
          <p className={`text-2xl font-black ${fireColors[fireIntensity] || 'text-slate-100'}`}>
            {streak.currentCount}
          </p>
        </div>

        <div className="bg-slate-950/50 rounded-lg p-3 text-center border border-slate-800/50 group-hover:border-slate-700 transition-colors">
           <div className="flex items-center justify-center gap-1 mb-1 text-slate-400">
             <Trophy className="w-3 h-3 text-amber-400" />
             <span className="text-xs font-medium">Best</span>
          </div>
          <p className="text-2xl font-bold text-amber-400">{streak.bestCount || 0}</p>
        </div>

        <div className="bg-slate-950/50 rounded-lg p-3 text-center border border-slate-800/50 group-hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-center gap-1 mb-1 text-slate-400">
             <Lock className="w-3 h-3 text-purple-400" />
             <span className="text-xs font-medium">Freezes</span>
          </div>
          <p className="text-2xl font-bold text-purple-400">{streak.freezesLeft || 0}<span className="text-sm font-normal text-slate-600">/3</span></p>
        </div>
      </div>

      {/* Milestone Progress */}
      <div className="mb-6 relative z-10">
        <div className="flex justify-between text-xs mb-1.5 px-1">
          <span className="text-slate-400">Next Milestone</span>
          <span className="text-slate-300 font-mono">{streak.currentCount} / {nextMilestone}</span>
        </div>
        <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full"
          />
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="relative z-10">
        <Button
          onClick={() => onCheckIn(streak.id)}
          disabled={checkedInToday || loading}
          variant={checkedInToday ? 'outline' : 'primary'}
          className={`w-full py-6 text-lg font-bold relative overflow-hidden group/btn shadow-lg transition-all ${
            checkedInToday
              ? 'border-green-900/50 text-green-400 hover:bg-green-900/20'
              : 'shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]'
          }`}
        >
          {loading ? (
             <span className="flex items-center gap-2">
               <span className="animate-spin">⏳</span> Processing...
             </span>
          ) : checkedInToday ? (
             <span className="flex items-center gap-2">
               <span>✓</span> Done for Today
             </span>
          ) : (
             <span className="flex items-center gap-2">
               <Flame className="w-5 h-5 animate-pulse" fill="currentColor" />
               CHECK IN
             </span>
          )}
        </Button>
      </div>

      {/* Dropdown Actions */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
             <div className="pt-4 mt-4 border-t border-slate-700/50 grid grid-cols-2 gap-2">
                <Button
                  onClick={() => {
                    onUseFreeze(streak.id);
                    setShowActions(false);
                  }}
                  disabled={streak.freezesLeft === 0 || loading}
                  variant="secondary"
                  size="sm"
                  className="w-full text-xs"
                >
                  <Zap className="w-3 h-3 mr-1.5" />
                  Freeze
                </Button>
                <Button
                  onClick={() => {
                    onRecover(streak.id);
                    setShowActions(false);
                  }}
                  disabled={loading}
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs hover:bg-amber-900/20 text-amber-400"
                >
                  <RotateCcw className="w-3 h-3 mr-1.5" />
                  Recover
                </Button>
                <Button
                  onClick={() => {
                    onEdit(streak);
                    setShowActions(false);
                  }}
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs"
                >
                  Edit Streak
                </Button>
                <Button
                  onClick={() => {
                    if (streak.archived) {
                      onUnarchive(streak.id);
                    } else {
                      onArchive(streak.id);
                    }
                    setShowActions(false);
                  }}
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                >
                  {streak.archived ? (
                    <>
                      <ArchiveRestore className="w-3 h-3 mr-1.5" />
                      Restore
                    </>
                  ) : (
                    <>
                      <Archive className="w-3 h-3 mr-1.5" />
                      Archive
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    onDelete(streak.id);
                    setShowActions(false);
                  }}
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <Trash2 className="w-3 h-3 mr-1.5" />
                  Delete
                </Button>
             </div>

             {/* Metadata */}
             <div className="mt-3 text-center">
                <span className="text-[10px] text-slate-600">
                  Created {formatDate(streak.createdAt)}
                </span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
