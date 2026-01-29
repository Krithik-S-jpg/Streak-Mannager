// Service Worker for Streak Maintainer PWA
const CACHE_NAME = 'streak-maintainer-v6';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch(() => {
        // It's okay if some files aren't available during install
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip Firebase requests
  if (event.request.url.includes('firebase') || event.request.url.includes('firestore')) {
    return;
  }

  // Skip dev requests
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/src') ||
      url.pathname.startsWith('/node_modules') ||
      url.pathname.startsWith('/@') ||
      url.hostname === 'localhost' ||
      url.hostname === '127.0.0.1') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request).then((response) => {
        // Don't cache if response is not ok
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        // Cache the new response
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // Return a custom offline page or cached response
        return caches.match(event.request);
      });
    })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync for notifications (optional)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-streaks') {
    event.waitUntil(syncStreaks());
  }
});

async function syncStreaks() {
  try {
    // Sync logic here if needed
    console.log('Syncing streaks...');
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// Push notification handler
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'Keep up with your streaks!',
      icon: '/favicon.ico',
      badge: '🔥',
      tag: data.tag || 'streak-notification',
      requireInteraction: false,
      vibrate: [100, 50, 100], // Mobile vibration pattern
      actions: [
        {
          action: 'open',
          title: 'Open App',
        },
        {
          action: 'close',
          title: 'Close',
        },
      ],
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Streak Maintainer', options)
    );
  } catch (error) {
    console.error('Push event error:', error);
    // Fallback notification
    event.waitUntil(
      self.registration.showNotification('Streak Maintainer', {
        body: 'Time to check in!',
        icon: '/favicon.ico',
        badge: '🔥',
        vibrate: [100, 50, 100],
      })
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Check if app window is already open
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === '/' || client.url.includes('track-streak')) {
          if ('focus' in client) {
            return client.focus();
          }
        }
      }
      // If no window, open a new one
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Notification close handler
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification.tag);
});
