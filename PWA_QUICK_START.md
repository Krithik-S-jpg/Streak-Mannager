# PWA & Mobile Setup - Quick Start Guide

## 🚀 Features Now Available

### 1. **Install as App** (All Platforms)
- **Android Chrome**: Click the install icon in address bar or wait for banner
- **iOS Safari**: Tap Share → Add to Home Screen
- **Desktop (Chrome/Edge)**: Click install icon or use browser menu
- App runs in standalone fullscreen mode (no browser UI)

### 2. **Push Notifications** 🔔
Notifications trigger on:
- ✅ When you check in to a streak
- ✅ Custom scheduled daily reminders
- ✅ Shows streak name and count
- ✅ Haptic feedback on mobile (vibration)
- ✅ Works even when app is in background

### 3. **Offline Support** 📴
The app works 100% offline:
- All your streaks are available
- Create/edit/delete streaks
- Check in to streaks
- View progress and stats
- Syncs automatically when internet returns

### 4. **Mobile Optimized** 📱
- Responsive design for all screen sizes
- Touch-friendly buttons and controls
- Swipe gestures ready
- Bottom-aligned modals on mobile
- Safe area support for notched phones
- Prevents rubber-band scrolling on iOS

### 5. **Online/Offline Indicator** 🌐
- Green indicator when online
- Red indicator when offline
- Shows at top of app
- Uses cached data when offline

---

## 📋 Testing Checklist

### Desktop Browser (Chrome/Edge)
1. Open `http://localhost:5173`
2. Look for install icon in address bar (usually top-right)
3. Click to install
4. App opens in standalone window
5. Try notifications (create/edit streak)

### Android Phone
1. Open Chrome
2. Go to `http://localhost:5173`
3. Wait for "Install app" banner (or tap menu → Install app)
4. Grant notification permission when asked
5. App appears on home screen
6. Check in to a streak → notification appears
7. Disable WiFi → app still works offline

### iPhone/iPad
1. Open Safari
2. Go to `http://localhost:5173`
3. Tap Share button (bottom)
4. Scroll and tap "Add to Home Screen"
5. Enter app name
6. Tap Add
7. App appears on home screen
8. Open it → fullscreen app mode
9. Check in to a streak → notification at top
10. Disable WiFi → app still works offline

---

## 🔧 How It Works

### Service Worker
- Runs in background even when app is closed
- Caches assets on first visit
- Serves from cache when offline
- Handles push notifications
- Syncs data automatically

### Notifications
```javascript
// Automatically triggered on check-in
notificationService.showNotification('✅ Reading checked in!', {
  body: 'Nice work! 5 day streak! 🔥',
  vibrate: [200, 100, 200],
})
```

### Demo Mode (No Supabase Required)
- If Supabase credentials missing, uses localStorage
- Full streak management works
- Data persists across sessions
- No internet needed

### Offline Mode
- All fetches return cached data
- New streaks saved to localStorage
- Queued for sync when online
- Shows "Offline" indicator

---

## ⚙️ Configuration

### Enable Notifications (Already Done!)
- [x] Permission request on first use
- [x] Service worker message handling
- [x] Vibration patterns
- [x] Notification tags (prevents duplicates)

### Optional: Firebase Push Notifications
To add cloud-based push notifications:

1. Create Firebase project
2. Add to `.env`:
   ```env
   VITE_FIREBASE_PROJECT_ID=your_id
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
   VITE_FIREBASE_API_KEY=your_key
   ```
3. Update `notificationService.js` to use Firebase
4. Backend can send push notifications

---

## 📊 What's Cached

Service Worker caches:
- ✅ HTML, CSS, JavaScript files
- ✅ Manifest and icons
- ✅ Static assets
- ✅ Fonts
- ✅ API responses (with refresh)

**Not cached**:
- ❌ Supabase API calls (privacy)
- ❌ User authentication tokens
- ❌ Real-time subscriptions

---

## 🎯 Key Components

### `usePWA` Hook
```javascript
const { showInstallPrompt, isOnline, installApp } = usePWA()
```
- Handles install prompt
- Tracks online/offline status
- Manages app lifecycle

### `PWABanner` Component
- Shows online/offline status
- Shows install prompt
- Dismissible
- Responsive design

### `notificationService`
```javascript
// Notification on check-in
notificationService.showNotification(title, options)

// Scheduled daily reminder
notificationService.scheduleStreakReminder(name, '09:00')
```

---

## 🐛 Troubleshooting

### Notifications Not Showing?
1. Check browser notification settings
2. Ensure "Notification permission granted" in browser
3. Check browser console for errors
4. Try refreshing the page

### Install Button Not Appearing?
1. Only shows on mobile or Chrome desktop
2. Must not be already installed
3. Try going to manifest: `http://localhost:5173/manifest.json`
4. Check browser console for errors

### App Not Syncing When Online?
1. Ensure Supabase credentials are in `.env`
2. Check browser console for API errors
3. Reload the page after connecting to internet
4. Check network tab in DevTools

### Offline Not Working?
1. Service worker must be registered first
2. Open in incognito/private to bypass cache
3. Check Application → Service Workers in DevTools
4. Unregister and refresh if stuck

---

## 📱 Best Practices

1. **Always ask for permissions**: App prompts for notifications
2. **Test offline**: Disable WiFi and verify functionality
3. **Check notifications**: Open app → check in → verify toast + notification
4. **Try install**: Use different browsers/devices
5. **Monitor performance**: DevTools → Network → throttle to 3G

---

## 🎉 You're All Set!

Your Streak Maintainer app is now:
- ✅ A fully-fledged Progressive Web App
- ✅ Works on Android, iOS, and Desktop
- ✅ Has push notifications
- ✅ Works offline
- ✅ Mobile optimized
- ✅ Installable

Enjoy tracking your streaks! 🔥
