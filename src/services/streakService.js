import { supabase } from '../supabase';
import { detectStreakReset, hasCheckedInToday } from '../utils/streakUtils';
import { parseError, ErrorCodes, AppError } from '../utils/errorHandler';

// Enable demo mode if no Supabase connection
let DEMO_MODE = !supabase;

console.log(DEMO_MODE ? '🔴 Demo Mode Active' : '📡 Supabase Mode Active');

// Test Supabase connection on startup with timeout (skip if already in demo mode)
const testSupabaseConnection = async () => {
  if (DEMO_MODE) {
    console.log('⏭️  Skipping Supabase test - already in demo mode');
    return false;
  }

  return new Promise((resolve) => {
    // Set timeout to prevent hanging
    const timeout = setTimeout(() => {
      console.warn('⚠️ Supabase connection test timeout, falling back to demo mode');
      DEMO_MODE = true;
      resolve(false);
    }, 3000);

    try {
      supabase
        .from('streaks')
        .select('count', { count: 'exact' })
        .limit(1)
        .then(({ error }) => {
          clearTimeout(timeout);
          if (error) {
            console.warn('⚠️ Supabase connection failed, falling back to demo mode:', error.message);
            DEMO_MODE = true;
            resolve(false);
          } else {
            console.log('✅ Supabase connection successful');
            DEMO_MODE = false;
            resolve(true);
          }
        })
        .catch((e) => {
          clearTimeout(timeout);
          console.warn('⚠️ Supabase error, using demo mode:', e.message);
          DEMO_MODE = true;
          resolve(false);
        });
    } catch (e) {
      clearTimeout(timeout);
      console.warn('⚠️ Supabase initialization error, using demo mode:', e.message);
      DEMO_MODE = true;
      resolve(false);
    }
  });
};

testSupabaseConnection();

const subscribeToStreaks = (userId, callback) => {
  if (DEMO_MODE) {
    const streaks = JSON.parse(localStorage.getItem(`streaks_${userId}`) || '[]');
    callback(streaks);
    return () => {};
  }

  console.log('📡 Subscribing to streaks for user:', userId);

  fetchStreaks(userId, callback).catch(error => {
    console.error('❌ Initial fetch failed:', error);
    callback([]);
  });

  let subscription = null;
  let disconnectTimeout = null;
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 5;

  const setupSubscription = () => {
    try {
      subscription = supabase
        .channel(`streaks:${userId}:${Date.now()}`, {
          config: { broadcast: { self: true } }
        })
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'streaks',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            console.log('🔄 Real-time streak change detected:', payload.eventType);
            clearTimeout(disconnectTimeout);
            fetchStreaks(userId, callback).catch(console.error);
          }
        )
        .subscribe((status) => {
          console.log(`📡 Realtime subscription status: ${status}`);
          if (status === 'SUBSCRIBED') {
            reconnectAttempts = 0;
            window.dispatchEvent(new CustomEvent('realtime:status', { detail: { status: 'subscribed' } }));
          } else if (status === 'CHANNEL_ERROR' || status === 'CLOSED') {
            console.warn('⚠️ Realtime connection lost');
            if (reconnectAttempts < maxReconnectAttempts) {
              reconnectAttempts++;
              setTimeout(() => {
                console.log(`🔄 Reconnecting (${reconnectAttempts}/${maxReconnectAttempts})`);
                setupSubscription();
              }, 2000 * reconnectAttempts);
            } else {
              console.warn('❌ Max reconnection attempts reached, using polling');
              window.dispatchEvent(new CustomEvent('realtime:status', { detail: { status: 'polling' } }));
              startPolling();
            }
          }
        });
    } catch (err) {
      console.error('Error setting up subscription:', err);
      startPolling();
    }
  };

  let pollingInterval = null;
  const startPolling = () => {
    if (pollingInterval) clearInterval(pollingInterval);
    const pollInterval = /Mobile|iPhone|iPad|Android/i.test(navigator.userAgent) ? 4000 : 8000;
    console.log(`🔄 Starting polling (${pollInterval}ms)`);
    pollingInterval = setInterval(() => {
      fetchStreaks(userId, callback).catch(console.error);
    }, pollInterval);
  };

  // Set disconnect timeout (if no update for 45 seconds, try polling)
  const resetDisconnectTimeout = () => {
    clearTimeout(disconnectTimeout);
    disconnectTimeout = setTimeout(() => {
      console.warn('⚠️ No realtime updates for 45s, checking connection...');
      if (pollingInterval) return; // Already polling
      startPolling();
    }, 45000);
  };
  resetDisconnectTimeout();

  setupSubscription();

  return () => {
    console.log('🛑 Unsubscribing from streaks');
    if (subscription) {
      supabase.removeChannel(subscription);
    }
    if (pollingInterval) clearInterval(pollingInterval);
    if (disconnectTimeout) clearTimeout(disconnectTimeout);
  };
};

const fetchStreaks = async (userId, callback) => {
  try {
    if (!userId) {
      callback([]);
      return;
    }

    if (DEMO_MODE) {
      const streaks = JSON.parse(localStorage.getItem(`streaks_${userId}`) || '[]');
      callback(streaks);
      return;
    }

    const { data, error } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .eq('archived', false)
      .order('updated_at', { ascending: false });

    if (error) {
      throw parseError(error, 'fetchStreaks');
    }

    const formatted = (data || []).map(formatStreakFromDB);
    callback(formatted);
  } catch (error) {
    console.error('❌ Error fetching streaks:', error);
    callback([]);
  }
};

const formatStreakFromDB = (s) => ({
  id: s.id,
  name: s.name,
  emoji: s.icon || '🔥',
  category: s.category || 'personal',
  frequency: s.frequency || 'daily',
  currentCount: s.current_streak || 0,
  bestCount: s.longest_streak || 0,
  lastCheckIn: s.last_check_in ? new Date(s.last_check_in) : null,
  createdAt: s.created_at ? new Date(s.created_at) : new Date(),
  checkIns: Array.isArray(s.check_ins) ? s.check_ins : [],
  freezesLeft: s.freezes_left || 3,
  targetCount: s.target_count || 30,
  reminderTime: s.reminder_time || '09:00',
  goalCount: s.goal_count || 0,
  archived: s.archived || false,
});

const createStreak = async (userId, streakData) => {
  try {
    if (!userId) throw new AppError('User not authenticated', ErrorCodes.UNAUTHORIZED);
    
    // Validate input
    if (!streakData.name || streakData.name.trim().length === 0) {
      throw new AppError('Streak name is required', ErrorCodes.VALIDATION_ERROR);
    }
    if (streakData.name.length > 100) {
      throw new AppError('Streak name must be less than 100 characters', ErrorCodes.VALIDATION_ERROR);
    }

    if (DEMO_MODE) {
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
      };
      streaks.push(newStreak);
      localStorage.setItem(`streaks_${userId}`, JSON.stringify(streaks));
      console.log('✅ Streak created (demo):', newStreak);
      return newStreak;
    }

    const { data, error } = await supabase
      .from('streaks')
      .insert([
        {
          user_id: userId,
          name: streakData.name.trim(),
          icon: streakData.icon || '🔥',
          category: streakData.category || 'personal',
          frequency: streakData.frequency || 'daily',
          reminder_time: streakData.reminderTime || '09:00',
          target_count: streakData.targetCount || 30,
          goal_count: 0,
          current_streak: 0,
          longest_streak: 0,
          check_ins: [],
          freezes_left: 3,
          archived: false,
        },
      ])
      .select()
      .single();

    if (error) throw parseError(error, 'createStreak');
    
    console.log('✅ Streak created:', data);
    return formatStreakFromDB(data);
  } catch (error) {
    throw error instanceof AppError ? error : parseError(error, 'createStreak');
  }
};

const checkInStreak = async (userId, streakId) => {
  try {
    if (!userId) throw new AppError('User not authenticated', ErrorCodes.UNAUTHORIZED);
    if (!streakId) throw new AppError('Streak ID is required', ErrorCodes.INVALID_INPUT);

    if (DEMO_MODE) {
      const streaks = JSON.parse(localStorage.getItem(`streaks_${userId}`) || '[]');
      const streakIndex = streaks.findIndex(s => s.id === streakId);
      if (streakIndex === -1) {
        throw new AppError('Streak not found', ErrorCodes.STREAK_NOT_FOUND);
      }

      const streak = streaks[streakIndex];
      const now = new Date();
      const today = now.toISOString().split('T')[0];

      if (hasCheckedInToday(streak.checkIns || [], now)) {
        throw new AppError('Already checked in today', ErrorCodes.OPERATION_FAILED);
      }

      const newCount = (streak.currentCount || 0) + 1;
      streak.currentCount = newCount;
      streak.bestCount = Math.max(newCount, streak.bestCount || 0);
      streak.checkIns = [...(streak.checkIns || []), today];
      streak.lastCheckIn = now.toISOString();

      streaks[streakIndex] = streak;
      localStorage.setItem(`streaks_${userId}`, JSON.stringify(streaks));
      console.log('✅ Check-in successful (demo):', streak);
      return streak;
    }

    const { data: streak, error: fetchError } = await supabase
      .from('streaks')
      .select('*')
      .eq('id', streakId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !streak) {
      throw new AppError('Streak not found', ErrorCodes.STREAK_NOT_FOUND);
    }

    const now = new Date();
    const today = now.toISOString().split('T')[0];

    if (hasCheckedInToday(streak.check_ins || [], now)) {
      throw new AppError('Already checked in today', ErrorCodes.OPERATION_FAILED);
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
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw parseError(error, 'checkInStreak');
    
    console.log('✅ Check-in successful:', data);
    return formatStreakFromDB(data);
  } catch (error) {
    throw error instanceof AppError ? error : parseError(error, 'checkInStreak');
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

const unarchiveStreak = async (userId, streakId) => {
  try {
    if (DEMO_MODE) {
      // Demo mode - update in localStorage
      const streaks = JSON.parse(localStorage.getItem(`streaks_${userId}`) || '[]');
      const streakIndex = streaks.findIndex(s => s.id === streakId);
      if (streakIndex === -1) throw new Error('Streak not found');

      streaks[streakIndex].archived = false;
      localStorage.setItem(`streaks_${userId}`, JSON.stringify(streaks));
      return streaks[streakIndex];
    }

    const { error } = await supabase
      .from('streaks')
      .update({ archived: false })
      .eq('id', streakId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error unarchiving streak:', error);
    throw error;
  }
};

const freezeStreak = async (userId, streakId) => {
  try {
    console.log('❄️ Attempting to freeze streak:', streakId);
    
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

    if (fetchError) {
      console.error('❌ Error fetching freeze data:', fetchError);
      throw fetchError;
    }
    
    console.log('📊 Current freezes left:', streak.freezes_left);
    
    if ((streak.freezes_left || 0) <= 0) throw new Error('No freezes left!');

    const { data, error } = await supabase
      .from('streaks')
      .update({ freezes_left: (streak.freezes_left || 3) - 1 })
      .eq('id', streakId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error applying freeze:', error);
      throw error;
    }
    
    console.log('✅ Freeze applied successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Error freezing streak:', error);
    throw error;
  }
};

const recoverStreak = async (userId, streakId) => {
  try {
    console.log('🔄 Attempting to recover streak:', streakId);
    
    const { data, error } = await supabase
      .from('streaks')
      .update({ current_streak: 0, freezes_left: 3 })
      .eq('id', streakId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error recovering streak:', error);
      throw error;
    }
    
    console.log('✅ Streak recovered successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Error recovering streak:', error);
    throw error;
  }
};

const updateGoal = async (userId, streakId, goalUpdates) => {
  try {
    const { data, error } = await supabase
      .from('streaks')
      .update(goalUpdates)
      .eq('id', streakId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating goal:', error);
    throw error;
  }
};

export const streakService = {
  subscribeToStreaks,
  fetchStreaks,
  createStreak,
  checkInStreak,
  checkInToday: checkInStreak,
  updateStreak,
  deleteStreak,
  archiveStreak,
  unarchiveStreak,
  useFreeze: freezeStreak,
  freezeStreak,
  recoverStreak,
  updateGoal,
};
