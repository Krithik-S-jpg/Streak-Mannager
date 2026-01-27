import { supabase } from '../supabase';

const DEMO_MODE = false;

// Calculate detailed statistics for a streak
const getStreakStats = (streak) => {
  const checkIns = Array.isArray(streak.checkIns) ? streak.checkIns : [];
  
  // Current stats
  const currentStreak = streak.currentCount || 0;
  const bestStreak = streak.bestCount || 0;
  
  // Historical stats
  const totalCheckIns = checkIns.length;
  const createdDate = new Date(streak.createdAt);
  const today = new Date();
  const daysActive = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24)) + 1;
  const consistency = daysActive > 0 ? Math.round((totalCheckIns / daysActive) * 100) : 0;
  
  // Monthly stats
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const checkInsThisMonth = checkIns.filter(date => {
    const d = new Date(date);
    return d >= thisMonth && d <= today;
  }).length;
  
  // Yearly stats
  const thisYear = new Date(today.getFullYear(), 0, 1);
  const checkInsThisYear = checkIns.filter(date => {
    const d = new Date(date);
    return d >= thisYear && d <= today;
  }).length;
  
  return {
    currentStreak,
    bestStreak,
    totalCheckIns,
    daysActive,
    consistency,
    checkInsThisMonth,
    checkInsThisYear,
    averagePerWeek: totalCheckIns > 0 ? (totalCheckIns / (daysActive / 7)).toFixed(1) : 0,
  };
};

// Get all streak statistics
const getAllStreakStats = (streaks) => {
  return streaks.map(streak => ({
    ...streak,
    stats: getStreakStats(streak),
  }));
};

// Get user-wide statistics
const getUserStats = (streaks) => {
  if (!streaks || streaks.length === 0) {
    return {
      totalStreaks: 0,
      activeStreaks: 0,
      totalCheckIns: 0,
      averageConsistency: 0,
      bestStreak: 0,
    };
  }

  const totalStreaks = streaks.length;
  const activeStreaks = streaks.filter(s => (s.currentCount || 0) > 0).length;
  const totalCheckIns = streaks.reduce((sum, s) => sum + (Array.isArray(s.checkIns) ? s.checkIns.length : 0), 0);
  const averageConsistency = streaks.reduce((sum, s) => sum + getStreakStats(s).consistency, 0) / totalStreaks;
  const bestStreak = Math.max(...streaks.map(s => s.bestCount || 0));

  return {
    totalStreaks,
    activeStreaks,
    totalCheckIns,
    averageConsistency: Math.round(averageConsistency),
    bestStreak,
  };
};

// Get streak history (timeline of check-ins)
const getStreakHistory = (streak) => {
  const checkIns = Array.isArray(streak.checkIns) ? streak.checkIns : [];
  return checkIns
    .map(date => ({
      date: new Date(date),
      dateString: new Date(date).toLocaleDateString(),
    }))
    .sort((a, b) => b.date - a.date);
};

// Get snapshots from database
const getSnapshots = async (userId, streakId) => {
  try {
    if (DEMO_MODE) {
      const snapshots = JSON.parse(localStorage.getItem(`snapshots_${streakId}`) || '[]');
      return snapshots;
    }

    const { data, error } = await supabase
      .from('snapshots')
      .select('*')
      .eq('user_id', userId)
      .eq('streak_id', streakId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching snapshots:', error);
    throw error;
  }
};

// Create a snapshot (weekly/monthly report)
const createSnapshot = async (userId, streakId, snapshotData) => {
  try {
    if (DEMO_MODE) {
      const snapshots = JSON.parse(localStorage.getItem(`snapshots_${streakId}`) || '[]');
      const newSnapshot = {
        id: `snapshot_${Date.now()}`,
        user_id: userId,
        streak_id: streakId,
        ...snapshotData,
        created_at: new Date().toISOString(),
      };
      snapshots.push(newSnapshot);
      localStorage.setItem(`snapshots_${streakId}`, JSON.stringify(snapshots));
      return newSnapshot;
    }

    const { data, error } = await supabase
      .from('snapshots')
      .insert([
        {
          user_id: userId,
          streak_id: streakId,
          ...snapshotData,
        },
      ])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating snapshot:', error);
    throw error;
  }
};

export const statsService = {
  getStreakStats,
  getAllStreakStats,
  getUserStats,
  getStreakHistory,
  getSnapshots,
  createSnapshot,
};
