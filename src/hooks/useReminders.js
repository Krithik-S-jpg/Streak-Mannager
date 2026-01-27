import { useState, useEffect, useCallback } from 'react';
import { reminderService } from '../services/reminderService';
import { pushNotificationService } from '../services/pushNotificationService';

export const useReminders = (userId, streakId) => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Subscribe to reminders
  useEffect(() => {
    if (!userId || !streakId) {
      setReminders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = reminderService.subscribeToReminders(
      userId,
      streakId,
      (data) => {
        setReminders(data);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [userId, streakId]);

  const addReminder = useCallback(
    async (reminderData) => {
      try {
        setError(null);
        const newReminder = await reminderService.createReminder(
          userId,
          streakId,
          reminderData
        );
        
        // If reminder is enabled, schedule it
        if (reminderData.enabled && reminderData.time) {
          pushNotificationService.scheduleDailyReminder(
            reminderData.label || `Time for your streak!`,
            reminderData.time,
            {
              body: `Don't break your streak!`,
              tag: `reminder_${streakId}`,
            }
          );
        }

        return newReminder;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [userId, streakId]
  );

  const updateReminder = useCallback(
    async (reminderId, updates) => {
      try {
        setError(null);
        const updated = await reminderService.updateReminder(userId, reminderId, updates);
        return updated;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [userId]
  );

  const deleteReminder = useCallback(
    async (reminderId) => {
      try {
        setError(null);
        await reminderService.deleteReminder(userId, reminderId);
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [userId]
  );

  return {
    reminders,
    loading,
    error,
    addReminder,
    updateReminder,
    deleteReminder,
  };
};
