import { supabase } from '../supabase';

const DEMO_MODE = false;

// Get reminders for a streak
const getReminders = async (userId, streakId) => {
  try {
    if (DEMO_MODE) {
      const reminders = JSON.parse(localStorage.getItem(`reminders_${streakId}`) || '[]');
      return reminders;
    }

    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', userId)
      .eq('streak_id', streakId)
      .order('time', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching reminders:', error);
    throw error;
  }
};

// Create a new reminder
const createReminder = async (userId, streakId, reminderData) => {
  try {
    if (DEMO_MODE) {
      const reminders = JSON.parse(localStorage.getItem(`reminders_${streakId}`) || '[]');
      const newReminder = {
        id: `reminder_${Date.now()}`,
        streak_id: streakId,
        user_id: userId,
        ...reminderData,
        created_at: new Date().toISOString(),
      };
      reminders.push(newReminder);
      localStorage.setItem(`reminders_${streakId}`, JSON.stringify(reminders));
      return newReminder;
    }

    const { data, error } = await supabase
      .from('reminders')
      .insert([
        {
          user_id: userId,
          streak_id: streakId,
          ...reminderData,
        },
      ])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating reminder:', error);
    throw error;
  }
};

// Update a reminder
const updateReminder = async (userId, reminderId, updates) => {
  try {
    if (DEMO_MODE) {
      const allReminders = JSON.parse(localStorage.getItem('all_reminders') || '[]');
      const index = allReminders.findIndex(r => r.id === reminderId);
      if (index !== -1) {
        allReminders[index] = { ...allReminders[index], ...updates };
        localStorage.setItem('all_reminders', JSON.stringify(allReminders));
      }
      return allReminders[index];
    }

    const { data, error } = await supabase
      .from('reminders')
      .update(updates)
      .eq('id', reminderId)
      .eq('user_id', userId)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating reminder:', error);
    throw error;
  }
};

// Delete a reminder
const deleteReminder = async (userId, reminderId) => {
  try {
    if (DEMO_MODE) {
      const allReminders = JSON.parse(localStorage.getItem('all_reminders') || '[]');
      const filtered = allReminders.filter(r => r.id !== reminderId);
      localStorage.setItem('all_reminders', JSON.stringify(filtered));
      return;
    }

    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', reminderId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting reminder:', error);
    throw error;
  }
};

// Subscribe to reminders for a streak
const subscribeToReminders = (userId, streakId, callback) => {
  if (DEMO_MODE) {
    const reminders = JSON.parse(localStorage.getItem(`reminders_${streakId}`) || '[]');
    callback(reminders);
    return () => {};
  }

  const subscription = supabase
    .channel(`reminders:${streakId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'reminders',
        filter: `user_id=eq.${userId} and streak_id=eq.${streakId}`,
      },
      () => getReminders(userId, streakId).then(callback)
    )
    .subscribe();

  getReminders(userId, streakId).then(callback);
  return () => supabase.removeChannel(subscription);
};

export const reminderService = {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
  subscribeToReminders,
};
