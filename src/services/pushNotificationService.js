// Push Notification Service
// Handles Web Push Notifications and local notifications

const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

const sendLocalNotification = (title, options = {}) => {
  if (!('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/favicon.ico',
      badge: '🔥',
      ...options,
    });
  }
};

const sendPushNotification = async (title, options = {}) => {
  try {
    // Check if service worker is available
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('Push notifications not supported');
      return false;
    }

    const registration = await navigator.serviceWorker.ready;

    // Show notification via service worker
    registration.showNotification(title, {
      icon: '/favicon.ico',
      badge: '🔥',
      tag: 'streak-notification',
      requireInteraction: false,
      ...options,
    });

    return true;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
};

const scheduleNotification = (title, delay, options = {}) => {
  setTimeout(() => {
    sendLocalNotification(title, options);
  }, delay);
};

// Schedule a daily reminder
const scheduleDailyReminder = (title, time, options = {}) => {
  // Parse time as HH:MM
  const [hours, minutes] = time.split(':').map(Number);
  
  const scheduleNext = () => {
    const now = new Date();
    const next = new Date();
    next.setHours(hours, minutes, 0, 0);

    // If the time has already passed today, schedule for tomorrow
    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }

    const delay = next - now;
    
    // Schedule the notification
    const timeoutId = setTimeout(() => {
      sendLocalNotification(title, options);
      // Schedule the next occurrence
      scheduleNext();
    }, delay);

    return timeoutId;
  };

  return scheduleNext();
};

// Get notification stats
const getNotificationStats = async () => {
  try {
    if (!('serviceWorker' in navigator)) return null;

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    return {
      supported: true,
      subscribed: !!subscription,
      permission: Notification.permission,
    };
  } catch (error) {
    console.error('Error getting notification stats:', error);
    return null;
  }
};

export const pushNotificationService = {
  requestNotificationPermission,
  sendLocalNotification,
  sendPushNotification,
  scheduleNotification,
  scheduleDailyReminder,
  getNotificationStats,
};
