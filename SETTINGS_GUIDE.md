# ⚙️ Settings Panel - Complete Guide

## Overview
The Streak Maintainer app now features a comprehensive **Settings Panel** with four main tabs for managing app preferences, notifications, privacy, and account settings.

## Features Implemented

### 1. **General Settings** ⚙️
- **Dark Mode Toggle**: Enable/disable dark theme
- **Daily Reminder Time**: Set your preferred streak reminder time
- **Theme Color**: Choose between orange, blue, purple, or green accent colors

### 2. **Notification Settings** 🔔
- **Push Notifications**: Enable/disable all notifications
- **Streak Notifications**: Get alerts when a streak is about to break
- **Sound Effects**: Play sound on check-in
- **Haptic Feedback**: Vibration feedback on mobile devices

### 3. **Privacy Settings** 🔒
- **Analytics Cookies**: Allow/disallow analytics tracking
- **Privacy Policy**: Quick access to privacy documentation
- **Export Data**: Download all your streak data
- **Delete Account**: Permanently delete your account (danger zone)

### 4. **About Section** ℹ️
- **App Info**: Version, type, and features list
- **Report Bug**: Submit bug reports
- **Send Feedback**: Share suggestions and improvements
- **Visit Website**: Go to official website
- **Copyright Info**: Attribution and year

## Components Created

### `SettingsModal.jsx`
- **Location**: `src/components/SettingsModal.jsx`
- **Props**:
  - `isOpen` (boolean): Control modal visibility
  - `onClose` (function): Close handler
- **Features**:
  - Tabbed interface
  - User profile display
  - Settings persistence (localStorage)
  - Logout functionality
  - Responsive design

## Usage

### In DashboardPage
```jsx
import { SettingsModal } from '../components/SettingsModal';

// State management
const [showSettings, setShowSettings] = useState(false);

// Render
<SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

// Trigger from Header
<Header onSettingsClick={() => setShowSettings(true)} />
```

### In Header
The settings button now opens the modal instead of showing "Coming soon"

## Settings Storage

All settings are automatically saved to **localStorage** under the key `streakSettings`:

```javascript
{
  notifications: true,
  darkMode: true,
  dailyReminder: '09:00',
  theme: 'dark',
  strikeNotifications: true,
  soundEnabled: true,
  vibrationEnabled: true,
  analyticsCookie: false,
}
```

Settings persist across app sessions.

## Tab System

### Tab Structure
```
┌─────────────────────────────────────┐
│ ⚙️ General  🔔 Notifications  🔒 Privacy  ℹ️ About
├─────────────────────────────────────┤
│  [Tab Content Here]                 │
│                                      │
│  [Logout Button]                    │
└─────────────────────────────────────┘
```

### Active Tab Styling
- Active tab shows in sky blue (sky-500)
- Underline border indicates active state
- Smooth transitions between tabs

## User Profile Section

Shows at top of settings:
- User avatar (first letter of display name)
- Display name
- Email address
- Clickable, profile-like appearance

## Logout Functionality

### Standard Logout
1. Click "Logout" button at bottom
2. Confirmation dialog appears
3. Click "Logout" to confirm
4. User redirected to login page

### Features
- Confirmation dialog prevents accidental logout
- Clear UI distinction
- Graceful error handling

## Responsive Design

- **Desktop**: Full-width modal with all tabs visible
- **Mobile**: 
  - Tabs scroll horizontally if needed
  - Touch-friendly toggle switches
  - Proper spacing for finger taps
  - Buttons scale appropriately

## Accessibility Features

- ✅ Semantic HTML with labels
- ✅ Proper focus management
- ✅ Hover states on interactive elements
- ✅ Clear visual hierarchy
- ✅ Color-blind friendly badge variants
- ✅ ARIA compatible Modal component

## Theme Integration

All settings respect the app's design system:
- Dark theme by default
- Tailwind CSS classes
- Consistent color palette
- Smooth transitions
- Glassmorphism effects

## Future Enhancements

1. **Notification Scheduling**
   - Set multiple reminder times
   - Different times per streak
   - Quiet hours configuration

2. **Data Management**
   - Import/export streaks
   - Backup to cloud
   - Sync across devices

3. **Advanced Settings**
   - Timezone selection
   - Week start day
   - Streak counting rules
   - Custom categories

4. **Appearance**
   - Font size adjustment
   - Custom theme builder
   - Light mode option
   - Contrast settings

5. **Integrations**
   - Calendar sync
   - Social sharing
   - Third-party app integration
   - Webhook support

## Testing Checklist

- ✅ Settings modal opens from header
- ✅ All tabs switch correctly
- ✅ Toggle switches work
- ✅ Time picker functions
- ✅ Theme colors change
- ✅ Settings persist (reload page)
- ✅ Logout works correctly
- ✅ Logout confirmation appears
- ✅ User info displays correctly
- ✅ Mobile responsive layout
- ✅ Keyboard navigation works
- ✅ No console errors

## Code Example

### Access Saved Settings
```javascript
const getSettings = () => {
  const saved = localStorage.getItem('streakSettings');
  return saved ? JSON.parse(saved) : null;
};

const settings = getSettings();
console.log(settings.dailyReminder); // '09:00'
```

### Update Settings Programmatically
```javascript
const updateSettings = (key, value) => {
  const current = getSettings() || {};
  const updated = { ...current, [key]: value };
  localStorage.setItem('streakSettings', JSON.stringify(updated));
};

updateSettings('notifications', false);
```

---

## 🎉 Settings are Live!

Click the **Settings** (⚙️) button in the header to explore all the options now available!

**Keep your streaks alive!** 🔥
