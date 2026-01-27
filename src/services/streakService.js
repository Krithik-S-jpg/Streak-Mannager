import { supabase } from '../supabase';
import { detectStreakReset, hasCheckedInToday } from '../utils/streakUtils';

// Force Supabase mode - disable demo mode
const DEMO_MODE = false;

const subscribeToStreaks = (userId, callback) => {
  if (DEMO_MODE) {
    // Demo mode - use localStorage
    const streaks = JSON.parse(localStorage.getItem(`streaks_${userId}`) || '[]');
    callback(streaks);
    return () => {};
  }

  const subscription = supabase
    .channel(`streaks:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'streaks',
        filter: `user_id=eq.${userId}`,
      },
      () => fetchStreaks(userId, callback)
    )
    .subscribe();

  fetchStreaks(userId, callback);
  return () => supabase.removeChannel(subscription);
};

const fetchStreaks = async (userId, callback) => {
  try {
    if (DEMO_MODE) {
      const streaks = JSON.parse(localStorage.getItem(`streaks_${userId}`) || '[]');
      callback(streaks);
      return;
    }

    const { data, error } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .eq('archived', false);

    if (error) throw error;

    const formatted = (data || []).map((s) => ({
      id: s.id,
      name: s.name,
      emoji: s.icon,
      category: s.category,
      frequency: s.frequency,
      currentCount: s.current_streak || 0,
      bestCount: s.longest_streak || 0,
      lastCheckIn: s.last_check_in ? new Date(s.last_check_in) : null,
      createdAt: s.created_at ? new Date(s.created_at) : new Date(),
      checkIns: Array.isArray(s.check_ins) ? s.check_ins : [],
      freezesLeft: s.freezes_left || 3,
    }));

    callback(formatted);
  } catch (error) {
    console.error('Error fetching streaks:', error);
    callback([]);
  }
};

const createStreak = async (userId, streakData) => {
  try {
    if (DEMO_MODE) {
      // Demo mode - create in localStorage
      const streaks = JSON.parse(localStorage.getItem(`streaks_${userId}`) || '[]');
      const newStreak = {
        id: `streak_${Date.now()}`,
        name: streakData.name,
        emoji: streakData.icon || '🔥',
        category: streakData.category || 'habit',
        frequency: streakData.frequency || 'daily',
        reminderTime: streakData.reminderTime || '09:00',
        currentCount: 0,
        bestCount: 0,
        targetCount: streakData.targetCount || 1,
        checkIns: [],
        freezesLeft: 3,
        lastCheckIn: null,
        createdAt: new Date().toISOString(),
        notes: '',
      };
      streaks.push(newStreak);
      localStorage.setItem(`streaks_${userId}`, JSON.stringify(streaks));
      return newStreak;
    }

    const { data, error } = await supabase
      .from('streaks')
      .insert([
        {
          user_id: userId,
          name: streakData.name,
          icon: streakData.icon || '🔥',
          category: streakData.category || 'personal',
          frequency: streakData.frequency || 'daily',
          reminder_time: streakData.reminderTime || '09:00',
          current_streak: 0,
          longest_streak: 0,
          check_ins: [],
          freezes_left: 3,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    
    // Trigger a refetch by calling fetchStreaks
    // This ensures the UI updates immediately
    return data;
  } catch (error) {
    console.error('Error creating streak:', error);
    throw error;
  }
};

const checkInStreak = async (userId, streakId) => {
  try {
    if (DEMO_MODE) {
      // Demo mode - update in localStorage
      const streaks = JSON.parse(localStorage.getItem(`streaks_${userId}`) || '[]');
      const streakIndex = streaks.findIndex(s => s.id === streakId);
      if (streakIndex === -1) throw new Error('Streak not found');

      const streak = streaks[streakIndex];
      const now = new Date();
      const today = now.toISOString().split('T')[0];

      if (hasCheckedInToday(streak.checkIns || [], now)) {
        throw new Error('Already checked in today!');
      }

      const newCount = (streak.currentCount || 0) + 1;

      streak.currentCount = newCount;
      streak.checkIns = [...(streak.checkIns || []), today];
      streak.lastCheckIn = now.toISOString();

      streaks[streakIndex] = streak;
      localStorage.setItem(`streaks_${userId}`, JSON.stringify(streaks));
      return streak;
    }

    const { data: streak, error: fetchError } = await supabase
      .from('streaks')
      .select('*')
      .eq('id', streakId)
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;

    const now = new Date();
    const today = now.toISOString().split('T')[0];

    if (hasCheckedInToday(streak.check_ins || [], now)) {
      throw new Error('Already checked in today!');
    }

    const { shouldReset } = detectStreakReset(streak.last_check_in, streak.current_streak);
    const newCount = shouldReset ? 1 : (streak.current_streak || 0) + 1;
    const newBestCount = Math.max(newCount, streak.longest_streak || 0);
    const checkIns = Array.isArray(streak.check_ins) ? streak.check_ins : [];

    const { data, error } = await supabase
      .from('streaks')
      .update({
        current_streak: newCount,
        longest_streak: newBestCount,
        check_ins: [...checkIns, today],
        last_check_in: now.toISOString(),
      })
      .eq('id', streakId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error checking in:', error);
    throw error;
  }
};

const updateStreak = async (userId, streakId, streakData) => {
  try {
    if (DEMO_MODE) {
      // Demo mode - update in localStorage
      const streaks = JSON.parse(localStorage.getItem(`streaks_${userId}`) || '[]');
      const streakIndex = streaks.findIndex(s => s.id === streakId);
      if (streakIndex === -1) throw new Error('Streak not found');

      streaks[streakIndex] = {
        ...streaks[streakIndex],
        name: streakData.name,
        emoji: streakData.icon || streakData.emoji,
        category: streakData.category,
        targetCount: streakData.targetCount,
      };

      localStorage.setItem(`streaks_${userId}`, JSON.stringify(streaks));
      return streaks[streakIndex];
    }

    const { data, error } = await supabase
      .from('streaks')
      .update({
        name: streakData.name,
        icon: streakData.icon || streakData.emoji,
        category: streakData.category,
        frequency: streakData.frequency,
        reminder_time: streakData.reminderTime,
      })
      .eq('id', streakId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating streak:', error);
    throw error;
  }
};

const deleteStreak = async (userId, streakId) => {
  try {
    if (DEMO_MODE) {
      // Demo mode - delete from localStorage
      const streaks = JSON.parse(localStorage.getItem(`streaks_${userId}`) || '[]');
      const filtered = streaks.filter(s => s.id !== streakId);
      localStorage.setItem(`streaks_${userId}`, JSON.stringify(filtered));
      return;
    }

    const { error } = await supabase
      .from('streaks')
      .delete()
      .eq('id', streakId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting streak:', error);
    throw error;
  }
};

const archiveStreak = async (userId, streakId) => {
  try {
    if (DEMO_MODE) {
      // Demo mode - update in localStorage
      const streaks = JSON.parse(localStorage.getItem(`streaks_${userId}`) || '[]');
      const streakIndex = streaks.findIndex(s => s.id === streakId);
      if (streakIndex === -1) throw new Error('Streak not found');

      streaks[streakIndex].archived = true;
      localStorage.setItem(`streaks_${userId}`, JSON.stringify(streaks));
      return streaks[streakIndex];
    }

    const { error } = await supabase
      .from('streaks')
      .update({ archived: true })
      .eq('id', streakId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error archiving streak:', error);
    throw error;
  }
};

const freezeStreak = async (userId, streakId) => {
  try {
    if (DEMO_MODE) {
      // Demo mode - update in localStorage
      const streaks = JSON.parse(localStorage.getItem(`streaks_${userId}`) || '[]');
      const streakIndex = streaks.findIndex(s => s.id === streakId);
      if (streakIndex === -1) throw new Error('Streak not found');

      const streak = streaks[streakIndex];
      if ((streak.freezesLeft || 0) <= 0) throw new Error('No freezes left!');

      streak.freezesLeft = (streak.freezesLeft || 3) - 1;
      streaks[streakIndex] = streak;
      localStorage.setItem(`streaks_${userId}`, JSON.stringify(streaks));
      return streak;
    }

    const { data: streak, error: fetchError } = await supabase
      .from('streaks')
      .select('freezes_left')
      .eq('id', streakId)
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;
    if ((streak.freezes_left || 0) <= 0) throw new Error('No freezes left!');

    const { data, error } = await supabase
      .from('streaks')
      .update({ freezes_left: (streak.freezes_left || 3) - 1 })
      .eq('id', streakId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error freezing streak:', error);
    throw error;
  }
};

export const streakService = {
  subscribeToStreaks,
  createStreak,
  checkInStreak,
  updateStreak,
  deleteStreak,
  archiveStreak,
  freezeStreak,
};
