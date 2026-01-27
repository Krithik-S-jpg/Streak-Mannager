import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Plus, Clock } from 'lucide-react';
import { Button, Badge } from './common';

export const ReminderSettings = ({ reminders, onAddReminder, onDeleteReminder, loading }) => {
  const [showForm, setShowForm] = useState(false);
  const [time, setTime] = useState('09:00');
  const [label, setLabel] = useState('Daily Reminder');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onAddReminder({
        time,
        label,
        enabled: true,
      });
      setTime('09:00');
      setLabel('Daily Reminder');
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add reminder:', error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 rounded-2xl p-6 border border-slate-700/30 backdrop-blur-md">
      <div className="flex items-center gap-3 mb-4">
        <Bell className="w-5 h-5 text-orange-400" />
        <h3 className="text-lg font-bold text-white">Reminders</h3>
      </div>

      {/* Reminders List */}
      <div className="space-y-3 mb-4">
        {reminders && reminders.length > 0 ? (
          reminders.map((reminder) => (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800/50"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-orange-400" />
                <div>
                  <p className="text-sm font-medium text-white">{reminder.label || 'Reminder'}</p>
                  <p className="text-xs text-slate-400">{reminder.time}</p>
                </div>
              </div>
              <button
                onClick={() => onDeleteReminder(reminder.id)}
                disabled={loading}
                className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))
        ) : (
          <p className="text-sm text-slate-400 text-center py-2">No reminders set yet</p>
        )}
      </div>

      {/* Add Reminder Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="space-y-3 p-3 bg-slate-950/30 rounded-lg border border-slate-700/50 mb-3"
          >
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white text-sm focus:outline-none focus:border-orange-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">
                Label (optional)
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Daily Reminder"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white text-sm placeholder-slate-600 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="flex-1"
                disabled={loading}
              >
                Add Reminder
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
      </AnimatePresence>

      {!showForm && (
        <Button
          onClick={() => setShowForm(true)}
          variant="ghost"
          size="sm"
          className="w-full text-xs text-orange-400 hover:bg-orange-900/20"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Reminder
        </Button>
      )}
    </div>
  );
};
