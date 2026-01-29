import { useState, useEffect, useCallback } from 'react';
import { streakService } from '../services/streakService';

export const useStreaks = (userId) => {
  const [streaks, setStreaks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const unsubscribe = streakService.subscribeToStreaks(userId, (data) => {
        setStreaks(data);
        setError(null);
        setLoading(false);
      });

      return unsubscribe;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [userId]);

  const createStreak = useCallback(
    async (streakData) => {
      if (!userId) throw new Error('User not authenticated');
      try {
        setError(null);
        await streakService.createStreak(userId, streakData);
        
        // Wait a moment for Supabase to process the insert
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Manually fetch to force immediate UI update
        await new Promise((resolve) => {
          streakService.fetchStreaks(userId, (data) => {
            setStreaks(data);
            resolve(data);
          });
        });
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [userId]
  );

  const updateStreak = useCallback(
    async (streakId, updates) => {
      if (!userId) throw new Error('User not authenticated');
      try {
        setError(null);
        await streakService.updateStreak(userId, streakId, updates);
        
        // Wait a moment for Supabase to process
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Manually fetch to force immediate UI update
        await new Promise((resolve) => {
          streakService.fetchStreaks(userId, (data) => {
            setStreaks(data);
            resolve(data);
          });
        });
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [userId]
  );

  const deleteStreak = useCallback(
    async (streakId) => {
      if (!userId) throw new Error('User not authenticated');
      try {
        setError(null);
        // Immediately remove from UI
        setStreaks((prevStreaks) => prevStreaks.filter(s => s.id !== streakId));
        
        // Delete from Supabase in background
        await streakService.deleteStreak(userId, streakId);
      } catch (err) {
        setError(err.message);
        // Re-fetch to restore if delete failed
        await new Promise((resolve) => {
          streakService.fetchStreaks(userId, (data) => {
            setStreaks(data);
            resolve(data);
          });
        });
        throw err;
      }
    },
    [userId]
  );

  const checkInToday = useCallback(
    async (streakId) => {
      if (!userId) throw new Error('User not authenticated');
      try {
        setError(null);
        await streakService.checkInToday(userId, streakId);
        
        // Wait a moment for Supabase to process
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Manually fetch to force immediate UI update
        await new Promise((resolve) => {
          streakService.fetchStreaks(userId, (data) => {
            setStreaks(data);
            resolve(data);
          });
        });
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [userId]
  );

  const useFreeze = useCallback(
    async (streakId) => {
      if (!userId) throw new Error('User not authenticated');
      try {
        setError(null);
        await streakService.useFreeze(userId, streakId);
        
        // Wait a moment for Supabase to process
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Manually fetch to force immediate UI update
        await new Promise((resolve) => {
          streakService.fetchStreaks(userId, (data) => {
            setStreaks(data);
            resolve(data);
          });
        });
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [userId]
  );

  const recoverStreak = useCallback(
    async (streakId) => {
      if (!userId) throw new Error('User not authenticated');
      try {
        setError(null);
        await streakService.recoverStreak(userId, streakId);
        
        // Wait a moment for Supabase to process
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Manually fetch to force immediate UI update
        await new Promise((resolve) => {
          streakService.fetchStreaks(userId, (data) => {
            setStreaks(data);
            resolve(data);
          });
        });
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [userId]
  );

  return {
    streaks,
    loading,
    error,
    createStreak,
    updateStreak,
    deleteStreak,
    checkInToday,
    useFreeze,
    recoverStreak,
  };
};
