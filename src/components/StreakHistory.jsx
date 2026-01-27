import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronDown } from 'lucide-react';
import { statsService } from '../services/statsService';

export const StreakHistory = ({ streak }) => {
  const [showHistory, setShowHistory] = useState(false);
  const history = statsService.getStreakHistory(streak);

  // Group by month
  const groupedByMonth = history.reduce((acc, entry) => {
    const monthKey = entry.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(entry);
    return acc;
  }, {});

  const months = Object.entries(groupedByMonth);

  return (
    <div className="bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 rounded-2xl p-6 border border-slate-700/30 backdrop-blur-md">
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="w-full flex items-center justify-between p-3 bg-slate-950/50 hover:bg-slate-950/70 rounded-lg border border-slate-800/50 hover:border-blue-500/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-blue-400" />
          <div className="text-left">
            <p className="text-sm font-medium text-white">Check-in History</p>
            <p className="text-xs text-slate-400">{history.length} total check-ins</p>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${
            showHistory ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* History Timeline */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-4 max-h-96 overflow-y-auto"
          >
            {months.length > 0 ? (
              months.map(([month, entries], idx) => (
                <div key={month}>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                    {month}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {entries.slice(0, 6).map((entry, entryIdx) => (
                      <motion.div
                        key={`${month}-${entryIdx}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-3 py-2 bg-slate-950/50 rounded border border-slate-800/50 text-center"
                      >
                        <p className="text-xs text-slate-400">{entry.dateString}</p>
                        <p className="text-sm font-bold text-green-400">✓</p>
                      </motion.div>
                    ))}
                    {entries.length > 6 && (
                      <div className="px-3 py-2 bg-slate-950/50 rounded border border-slate-800/50 text-center">
                        <p className="text-xs text-slate-400">+{entries.length - 6} more</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-slate-400">No check-ins yet</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
