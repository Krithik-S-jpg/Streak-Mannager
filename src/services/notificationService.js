const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('Notifications not supported');
    return false;
  }

  if (Notification.permission === 'granted') {
    console.log('✅ Notification permission already granted');
    return true;
  }

  if (Notification.permission === 'denied') {
    console.log('❌ Notification permission denied - user must enable in browser settings');
    return false;
  }

  if (Notification.permission !== 'denied') {
    try {
      console.log('🔔 Requesting notification permission...');
      const permission = await Notification.requestPermission();
      console.log('Permission result:', permission);
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
    console.log('📢 Attempting to show notification:', title);
    console.log('Permission status:', Notification.permission);

    // Try to show via service worker (better for mobile)
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        console.log('✅ Service Worker ready, showing notification via SW');
        registration.showNotification(title, {
          icon: '/favicon.svg',
          badge: '🔥',
          tag: options.tag || 'streak-notification',
          requireInteraction: false,
          vibrate: [200, 100, 200],
          ...options,
        });
        return;
      } catch (swError) {
        console.log('⚠️ Service Worker notification failed:', swError.message);
      }
    }
    
    // Fallback to Notification API
    if ('Notification' in window && Notification.permission === 'granted') {
      console.log('✅ Showing notification via Notification API');
      new Notification(title, {
        icon: '/favicon.svg',
        badge: '🔥',
        tag: options.tag || 'streak-notification',
        vibrate: [200, 100, 200],
        ...options,
      });
      return;
    }

    if (Notification.permission === 'denied') {
      console.log('❌ Notification permission denied');
      return;
    }

    console.log('⚠️ Could not show notification - permission not granted');
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
