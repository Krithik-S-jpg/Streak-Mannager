# 🚀 STREAK MAINTAINER - FEATURE QUICK START GUIDE

## What's New & How To Use It

---

## 1. 🍞 Toast Notifications System

### What it does:
Provides beautiful, auto-dismissing notifications for user feedback instead of browser alerts.

### Where to use it:
Instead of `alert()` or old `<Alert />` components.

### How to use:

```javascript
import { useToast } from '../components/Toast';

function MyComponent() {
  const toast = useToast();

  const handleCheckIn = async () => {
    try {
      await checkInStreak();
      toast.success('✅ Check-in successful!', 3000); // 3 second duration
    } catch (error) {
      toast.error('❌ Check-in failed: ' + error.message);
    }
  };

  return (
    <button onClick={handleCheckIn}>Check In</button>
  );
}
```

### Toast Methods:
- `toast.success(message, duration)` - Green success notification
- `toast.error(message, duration)` - Red error notification
- `toast.info(message, duration)` - Blue info notification
- `toast.warning(message, duration)` - Yellow warning notification
- `toast.remove(id)` - Remove specific toast
- `toast.clear()` - Clear all toasts

### Default Duration:
- If duration not specified: 4000ms (4 seconds)
- Set duration to `0` for permanent toast (must close manually)

---

## 2. 🌓 Dark/Light Theme System

### What it does:
Allows users to switch between dark and light themes.

### Features:
- Toggle button in header
- Persists user preference
- Respects system preferences
- Smooth transitions

### How to use:

```javascript
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { theme, toggle, setTheme } = useTheme();

  return (
    <>
      <p>Current theme: {theme}</p>
      {/* Toggle between dark and light */}
      <button onClick={toggle}>Switch Theme</button>
      
      {/* Set specific theme */}
      <button onClick={() => setTheme('light')}>Light Mode</button>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>

      {/* Conditional rendering based on theme */}
      {theme === 'dark' ? (
        <img src="dark-logo.png" alt="Logo" />
      ) : (
        <img src="light-logo.png" alt="Logo" />
      )}
    </>
  );
}
```

### Available themes:
- `'dark'` - Dark theme (default)
- `'light'` - Light theme

### How it's set up:
1. Wrap app with `<ThemeProvider>` in `App.jsx` ✅
2. Use hook anywhere: `useTheme()`
3. User preference saved to localStorage
4. Applied to `<html>` element class

---

## 3. 📊 Data Export Features

### What it does:
Allows users to export all their streak data in multiple formats.

### Formats Available:
- **CSV** - Spreadsheet format (Excel, Google Sheets)
- **JSON** - Complete backup with all metadata
- **PDF** - Print-friendly report

### How to use:

```javascript
import { exportService } from '../services/exportService';

function ExportButton() {
  const handleExportCSV = () => {
    try {
      exportService.exportToCSV(
        streaks, 
        'my-streaks.csv'
      );
      toast.success('Exported as CSV!');
    } catch (error) {
      toast.error('Export failed: ' + error.message);
    }
  };

  const handleExportJSON = () => {
    exportService.exportToJSON(
      streaks,
      `streaks-${new Date().toISOString()}.json`
    );
  };

  const handleExportPDF = () => {
    // Opens print dialog
    exportService.exportToPDF(streaks);
  };

  return (
    <>
      <button onClick={handleExportCSV}>📊 Export CSV</button>
      <button onClick={handleExportJSON}>📄 Export JSON</button>
      <button onClick={handleExportPDF}>🖨️ Export PDF</button>
    </>
  );
}
```

### CSV Export includes:
- Streak name
- Category and frequency
- Current and best streak counts
- Total check-ins
- Freezes left
- Creation and last check-in dates

### JSON Export includes:
- All above data
- Check-in dates array
- Metadata (export date, version)
- Complete backup for reimport

### PDF Export includes:
- Professional report layout
- Statistics table
- Formatted dates
- Printable (Ctrl+P)

### Statistics:

```javascript
const stats = exportService.generateStatistics(streaks);

// Returns:
{
  totalStreaks: 10,
  activeStreaks: 8,
  totalCheckIns: 145,
  averageCheckIns: 14.5,
  bestStreak: 47,
  totalFreezes: 5,
  exportDate: '2026-03-17T12:00:00Z'
}
```

---

## 4. 🛡️ Error Handling System

### What it does:
Provides comprehensive error handling with:
- Automatic error classification
- User-friendly messages
- Retry logic
- Network detection

### How to use:

```javascript
import { 
  parseError, 
  AppError, 
  ErrorCodes,
  withRetry,
  validateInput 
} from '../utils/errorHandler';

// Automatically parse any error
try {
  // Some operation
} catch (error) {
  const appError = parseError(error, 'checkInStreak');
  toast.error(appError.message); // User-friendly message
  console.error('Code:', appError.code); // Error classification
}

// Retry with backoff
const result = await withRetry(
  () => streakService.checkInStreak(userId, streakId),
  {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 10000
  }
);

// Validate input
try {
  validateInput(formData, {
    name: { required: true, minLength: 1, maxLength: 100 },
    email: { 
      required: true, 
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      patternMessage: 'Invalid email format'
    },
  });
} catch (error) {
  if (error.code === ErrorCodes.VALIDATION_ERROR) {
    console.log(error.details.fields); // { name: '...', email: '...' }
  }
}
```

### Available Error Codes:
- `NETWORK_ERROR` - Connection failed
- `TIMEOUT` - Request took too long
- `UNAUTHORIZED` - Not logged in
- `VALIDATION_ERROR` - Invalid input
- `SUPABASE_ERROR` - Backend error
- `STREAK_NOT_FOUND` - Streak doesn't exist
- And more...

### AppError Properties:
```javascript
error.message        // User-friendly message
error.code          // Error classification
error.statusCode    // HTTP status
error.details       // Extra info (e.g., validation fields)
```

---

## 5. 🔧 Updated Streak Service

### What's improved:
✅ All operations have proper error handling  
✅ Validation on create/update  
✅ Better demo mode support  
✅ Improved real-time sync  
✅ Consistent data formatting  

### Key Methods:
```javascript
import { streakService } from '../services/streakService';

// Create with validation
const streak = await streakService.createStreak(userId, {
  name: 'LeetCode',
  icon: '🔥',
  category: 'coding',
  frequency: 'daily'
});

// All methods now throw AppError on failure
try {
  await streakService.checkInStreak(userId, streakId);
} catch (error) {
  if (error.code === ErrorCodes.OPERATION_FAILED) {
    // Already checked in today
  }
}
```

---

## 6. 🎨 Enhanced UI Components

### Button Component (already exists, now better):

```javascript
import { Button } from '../components/common';

// All variants and sizes work
<Button variant="primary" size="lg" loading={isLoading}>
  Submit
</Button>

<Button variant="danger" disabled={!hasPermission}>
  Delete
</Button>
```

### Toast Container:
```javascript
// Already added to App.jsx, just use it:
import { ToastContainer } from '../components/Toast';

// Automatically displayed at bottom-right
```

---

## 📋 Quick Integration Checklist

When adding new features, remember:

- [ ] Use `useToast()` for user feedback instead of alerts
- [ ] Wrap async operations in error handling
- [ ] Use `parseError()` to convert errors
- [ ] Provide `useTheme()` for theme-aware components
- [ ] Export data buttons in relevant sections
- [ ] Validate user input before submission
- [ ] Test in demo mode (no Supabase needed)
- [ ] Check theme toggle works in new components

---

## 🧪 Testing the Improvements

### Test Toast System:
1. Go to Settings → Notifications
2. Click "Test Notification" in header
3. Should see toast at bottom-right

### Test Theme Toggle:
1. Click sun/moon icon in header
2. Page should switch themes smoothly
3. Refresh page → theme should persist

### Test Export:
1. Go to Settings → Privacy
2. Click "CSV", "JSON", or "PDF" export
3. Should download files or open print dialog

### Test Error Handling:
1. Disconnect internet
2. Try to create a streak
3. Should see user-friendly error message
4. Should retry automatically
5. Should work offline in demo mode

---

## 🚀 Best Practices

### ✅ DO:
- Use `toast.*()` for all user feedback
- Use `parseError()` for error conversion
- Let users toggle theme
- Provide data export options
- Validate all input
- Test offline functionality

### ❌ DON'T:
- Use `alert()` anymore
- Ignore errors and silently fail
- Hardcode dark mode only
- Store session data without backup
- Skip validation
- Assume internet always available

---

## 🐛 Troubleshooting

### Toasts not showing?
- Check `<ToastContainer />` in App.jsx
- Make sure `useToast()` is called in component

### Theme not switching?
- Check `<ThemeProvider>` wraps the app
- Check localStorage isn't blocked
- Check useTheme() hook is imported correctly

### Export not working?
- Check streaks have data
- Check browser allows downloads
- Check no CORS issues
- Check localStorage has space

### Errors not caught?
- Use `parseError()` to convert
- Import `ErrorCodes` enum
- Check try/catch block exists
- Check error is being thrown, not just logged

---

## 📞 Getting Help

Each feature has Storybook examples (coming soon) and inline JSDoc comments.

For questions, check:
1. The component file comments
2. Example usage in other components
3. IMPROVEMENTS_DETAILED.md for architecture
4. Error messages in console

---

## ✨ Summary

You now have professional-grade:
- ✅ Notifications system
- ✅ Theme management  
- ✅ Data export/backup
- ✅ Error handling
- ✅ Input validation
- ✅ Real-time updates
- ✅ Offline support

**Happy coding! 🚀**
