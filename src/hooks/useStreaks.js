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
        console.log('📝 Updating streak:', streakId);
        await streakService.updateStreak(userId, streakId, updates);
        console.log('📝 Update complete, refreshing...');
        
        // Wait a moment for Supabase to process
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Manually fetch to force immediate UI update
        console.log('📥 Fetching updated streaks...');
        await new Promise((resolve) => {
          streakService.fetchStreaks(userId, (data) => {
            console.log('✅ UI Updated with changes applied');
            setStreaks(data);
            resolve(data);
          });
        });
      } catch (err) {
        setError(err.message);
        console.error('❌ Update error:', err);
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
        console.log('✓ Checking in to streak:', streakId);
        await streakService.checkInToday(userId, streakId);
        console.log('✓ Check-in complete, refreshing...');
        
        // Wait a moment for Supabase to process
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Manually fetch to force immediate UI update
        console.log('📥 Fetching updated streaks...');
        await new Promise((resolve) => {
          streakService.fetchStreaks(userId, (data) => {
            console.log('✅ UI Updated:', data);
            setStreaks(data);
            resolve(data);
          });
        });
      } catch (err) {
        setError(err.message);
        console.error('❌ Check-in error:', err);
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
        console.log('❄️ Using freeze on streak:', streakId);
        await streakService.useFreeze(userId, streakId);
        console.log('❄️ Freeze applied, refreshing...');
        
        // Wait a moment for Supabase to process
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Manually fetch to force immediate UI update
        console.log('📥 Fetching updated streaks...');
        await new Promise((resolve) => {
          streakService.fetchStreaks(userId, (data) => {
            console.log('✅ UI Updated with freeze applied');
            setStreaks(data);
            resolve(data);
          });
        });
      } catch (err) {
        setError(err.message);
        console.error('❌ Freeze error:', err);
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
        console.log('🔄 Recovering streak:', streakId);
        await streakService.recoverStreak(userId, streakId);
        console.log('🔄 Recovery applied, refreshing...');
        
        // Wait a moment for Supabase to process
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Manually fetch to force immediate UI update
        console.log('📥 Fetching updated streaks...');
        await new Promise((resolve) => {
          streakService.fetchStreaks(userId, (data) => {
            console.log('✅ UI Updated with recovery applied');
            setStreaks(data);
            resolve(data);
          });
        });
      } catch (err) {
        setError(err.message);
        console.error('❌ Recovery error:', err);
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
