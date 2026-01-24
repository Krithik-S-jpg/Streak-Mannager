const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission !== 'denied') {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }
  return false;
};

const showNotification = async (title, options = {}) => {
  try {
    // Try to show via service worker (better for mobile)
    if ('serviceWorker' in navigator && 'registration' in navigator.serviceWorker) {
      const registration = await navigator.serviceWorker.ready;
      if (registration.showNotification) {
        registration.showNotification(title, {
          icon: '/favicon.svg',
          badge: '/favicon.svg',
          tag: options.tag || 'streak-notification',
          requireInteraction: false,
          vibrate: [200, 100, 200],
          ...options,
        });
        return;
      }
    }
    
    // Fallback to Notification API
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/favicon.svg',
        ...options,
      });
    }
  } catch (error) {
    console.error('Error showing notification:', error);
  }
};

const sendLocalNotification = (title, options = {}) => {
  showNotification(title, options);
};

const scheduleNotification = async (title, options = {}, delayMs = 0) => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      await showNotification(title, options);
      resolve();
    }, delayMs);
  });
};

// Schedule daily streak reminders
const scheduleStreakReminder = async (streakName, reminderTime = '09:00') => {
  try {
    const [hours, minutes] = reminderTime.split(':').map(Number);
    const now = new Date();
    const reminderDate = new Date();
    reminderDate.setHours(hours, minutes, 0, 0);

    // If the time has already passed today, schedule for tomorrow
    if (reminderDate < now) {
      reminderDate.setDate(reminderDate.getDate() + 1);
    }

    const timeUntilReminder = reminderDate.getTime() - now.getTime();

    await scheduleNotification(
      `🔥 Time to maintain ${streakName}!`,
      {
        body: 'Keep your streak alive!',
        tag: `streak-reminder-${streakName}`,
        requireInteraction: true,
      },
      timeUntilReminder
    );
  } catch (error) {
    console.error('Error scheduling streak reminder:', error);
  }
};

export const notificationService = {
  requestNotificationPermission,
  showNotification,
  sendLocalNotification,
  scheduleNotification,
  scheduleStreakReminder,
};

export { requestNotificationPermission, showNotification, sendLocalNotification, scheduleNotification, scheduleStreakReminder };
