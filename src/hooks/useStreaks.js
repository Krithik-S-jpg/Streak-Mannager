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
        const id = await streakService.createStreak(userId, streakData);
        // Refetch streaks to update UI immediately
        streakService.subscribeToStreaks(userId, (data) => {
          setStreaks(data);
        });
        return id;
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
        await streakService.deleteStreak(userId, streakId);
      } catch (err) {
        setError(err.message);
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
