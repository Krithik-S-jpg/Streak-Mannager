import { supabase } from '../supabase';
import { detectStreakReset, hasCheckedInToday } from '../utils/streakUtils';

const subscribeToStreaks = (userId, callback) => {
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
    const { data, error } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .eq('archived', false);

    if (error) throw error;

    const formatted = (data || []).map((s) => ({
      id: s.id,
      name: s.name,
      emoji: s.emoji,
      category: s.category,
      currentCount: s.current_count || 0,
      bestCount: s.best_count || 0,
      targetCount: s.target_count || 1,
      lastCheckIn: s.last_check_in ? new Date(s.last_check_in) : null,
      createdAt: new Date(s.created_at),
      checkIns: s.check_ins || [],
      freezesLeft: s.freezes_left || 3,
      notes: s.notes || '',
    }));

    callback(formatted);
  } catch (error) {
    console.error('Error fetching streaks:', error);
    callback([]);
  }
};

const createStreak = async (userId, streakData) => {
  try {
    const { data, error } = await supabase
      .from('streaks')
      .insert([
        {
          user_id: userId,
          name: streakData.name,
          emoji: streakData.emoji,
          category: streakData.category || 'personal',
          target_count: streakData.targetCount || 1,
          current_count: 0,
          best_count: 0,
          check_ins: [],
          freezes_left: 3,
          notes: streakData.notes || '',
          created_at: new Date(),
        },
      ])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating streak:', error);
    throw error;
  }
};

const checkInStreak = async (userId, streakId) => {
  try {
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

    const { shouldReset } = detectStreakReset(streak.last_check_in, streak.current_count);
    const newCount = shouldReset ? 1 : (streak.current_count || 0) + 1;
    const newBestCount = Math.max(newCount, streak.best_count || 0);

    const { data, error } = await supabase
      .from('streaks')
      .update({
        current_count: newCount,
        best_count: newBestCount,
        check_ins: [...(streak.check_ins || []), today],
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
    const { data, error } = await supabase
      .from('streaks')
      .update({
        name: streakData.name,
        emoji: streakData.emoji,
        category: streakData.category,
        target_count: streakData.targetCount,
        notes: streakData.notes || '',
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
