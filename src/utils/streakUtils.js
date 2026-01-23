// Detect if streak should reset and return new count
export const detectStreakReset = (lastCheckIn, currentCount) => {
  if (!lastCheckIn) {
    return { shouldReset: false, newCurrentCount: currentCount };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastCheckInDate = new Date(lastCheckIn);
  lastCheckInDate.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor((today - lastCheckInDate) / (1000 * 60 * 60 * 24));

  // If more than 1 day has passed, streak is broken
  if (daysDiff > 1) {
    return { shouldReset: true, newCurrentCount: 0 };
  }

  return { shouldReset: false, newCurrentCount: currentCount };
};

// Check if user has already checked in today
export const hasCheckedInToday = (checkIns, currentDate = new Date()) => {
  if (!Array.isArray(checkIns) || checkIns.length === 0) {
    return false;
  }

  const today = currentDate.toISOString().split('T')[0];
  return checkIns.includes(today);
};

// Get calendar data for the current month
export const getCalendarData = (streak) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const calendar = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendar.push(null);
  }

  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);

    let intensity = 0;
    if (streak.lastCheckIn) {
      const lastCheckInDate = new Date(streak.lastCheckIn);
      lastCheckInDate.setHours(0, 0, 0, 0);

      if (date.getTime() === lastCheckInDate.getTime()) {
        intensity = 1;
      }
    }

    calendar.push({
      date,
      day,
      intensity,
    });
  }

  return calendar;
};

// Check if streak should be reset
export const shouldResetStreak = (streak) => {
  if (!streak.lastCheckIn) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastCheckInDate = new Date(streak.lastCheckIn);
  lastCheckInDate.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor((today - lastCheckInDate) / (1000 * 60 * 60 * 24));
  return daysDiff >= 2;
};

// Format date for display
export const formatDate = (date) => {
  if (!date) return '';

  const options = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };

  return new Date(date).toLocaleDateString('en-US', options);
};

// Get days until freeze reset (monthly)
export const getDaysUntilFreezeReset = (lastFreezeReset) => {
  if (!lastFreezeReset) return 0;

  const today = new Date();
  const nextReset = new Date(lastFreezeReset);
  nextReset.setMonth(nextReset.getMonth() + 1);

  const daysLeft = Math.ceil((nextReset - today) / (1000 * 60 * 60 * 24));
  return Math.max(0, daysLeft);
};

// Categories for streaks
export const STREAK_CATEGORIES = {
  APP: { value: 'app', label: 'App', icon: '' },
  HABIT: { value: 'habit', label: 'Habit', icon: '' },
  EXERCISE: { value: 'exercise', label: 'Exercise', icon: '' },
  LEARNING: { value: 'learning', label: 'Learning', icon: '' },
  SOCIAL: { value: 'social', label: 'Social', icon: '' },
};

// Frequency options
export const FREQUENCIES = {
  DAILY: { value: 'daily', label: 'Daily' },
  WEEKLY: { value: 'weekly', label: 'Weekly' },
};

// Get emoji icon
export const EMOJI_ICONS = [
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '', '', '', '',
];
