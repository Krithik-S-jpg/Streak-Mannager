const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

const showNotification = (title, options = {}) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/logo-192x192.png',
      ...options,
    });
  }
};

const sendLocalNotification = (title, options = {}) => {
  showNotification(title, options);
};

const scheduleNotification = (title, options = {}, delayMs = 0) => {
  setTimeout(() => {
    showNotification(title, options);
  }, delayMs);
};

export const notificationService = {
  requestNotificationPermission,
  showNotification,
  sendLocalNotification,
  scheduleNotification,
};

export { requestNotificationPermission, showNotification, sendLocalNotification, scheduleNotification };
