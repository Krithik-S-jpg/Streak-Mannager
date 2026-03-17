# Streak Maintainer - Production Ready PWA

A modern, full-stack Progressive Web App for tracking and maintaining streaks across multiple platforms (Snapchat, LeetCode, Duolingo) and personal habits with gamification features.

## Features ✨

- **📱 PWA Support** - Works offline, installable on mobile and desktop
- **🔥 Streak Tracking** - Create, edit, and manage multiple streaks
- **✅ Daily Check-ins** - One-tap check-in system with automatic streak increment
- **🛡️ Streak Protection** - 2 free freezes per month to prevent streak loss
- **📊 Activity Heatmap** - GitHub-style calendar visualization
- **🔐 Secure Authentication** - Supabase email/password auth with JWT tokens
- **🎨 Beautiful UI** - Dark/light mode, smooth animations, responsive design
- **🔔 Notifications** - Local and push notification support
- **☁️ Cloud Sync** - Real-time data sync with PostgreSQL via Supabase
- **📥 Data Export** - Export streaks as CSV, JSON, or PDF
- **🎯 Gamification** - Badges, levels, achievements, and rankings

## Tech Stack 🛠️

**Frontend:**
- React 18 with Vite for fast builds
- Tailwind CSS v3.3 for styling
- Framer Motion v10 for animations
- Lucide React for icons

**Backend:**
- Supabase Authentication (email/password)
- PostgreSQL Database (via Supabase)
- Real-time subscriptions via Supabase channels
- Service Workers for offline support

**PWA:**
- Service Workers for offline-first strategy
- Web App Manifest for installability
- Cache management and sync strategies

## Project Structure 📁

```
streak-maintainer/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   └── icons/                 # Icon assets
├── src/
│   ├── app/
│   │   ├── App.jsx            # Main app component
│   │   ├── Router.jsx         # Route configuration
│   │   └── ProtectedRoute.jsx # Auth guard
│   ├── components/
│   │   ├── common.jsx         # Reusable UI components
│   │   ├── Header.jsx         # App header
│   │   ├── Footer.jsx         # App footer
│   │   ├── StreakCard.jsx     # Streak card component
│   │   ├── CalendarHeatmap.jsx# Calendar heatmap
│   │   └── StreakFormModal.jsx # Streak creation/edit form
│   ├── pages/
│   │   ├── LoginPage.jsx      # Login page
│   │   ├── RegisterPage.jsx   # Registration page
│   │   └── DashboardPage.jsx  # Main dashboard
│   ├── hooks/
│   │   ├── useAuth.js         # Authentication hook
│   │   └── useStreaks.js      # Streaks management hook
│   ├── services/
│   │   ├── authService.js     # Auth operations
│   │   ├── streakService.js   # Streak CRUD operations
│   │   └── notificationService.js # Notification handling
│   ├── utils/
│   │   ├── streakUtils.js     # Streak utilities
│   │   ├── validation.js      # Input validation
│   │   └── helpers.js         # Helper functions
│   ├── styles/
│   │   └── globals.css        # Global styles
│   ├── firebase.js            # Firebase config
│   └── main.jsx               # Entry point
├── index.html                 # HTML template
├── vite.config.js             # Vite config
├── tailwind.config.js         # Tailwind config
├── postcss.config.js          # PostCSS config
├── package.json               # Dependencies
├── .env.example               # Environment variables template
└── README.md                  # This file
```

## Firebase Setup 🔧

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Name it "Streak Maintainer"
4. Enable Google Analytics (optional)
5. Create the project

### 2. Set Up Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get started**
3. Enable **Email/Password** provider
4. Click **Save**

### 3. Set Up Firestore

1. Go to **Cloud Firestore**
2. Click **Create database**
3. Choose region (closest to you)
4. Start in **Production mode**
5. Accept the default rules (will be updated below)

### 4. Update Firestore Rules

Replace the default rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      
      // Streaks subcollection
      match /streaks/{streakId} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```

### 5. Get Your Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll to **Your apps**
3. Click on the web app (or create one)
4. Copy the Firebase config

### 6. Set Environment Variables

Create `.env` file with your Firebase config:

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

## Installation & Setup 🚀

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Steps

```bash
# 1. Clone or download the project
cd streak-maintainer

# 2. Install dependencies
npm install

# 3. Create .env file (copy from .env.example)
cp .env.example .env

# 4. Add your Firebase credentials to .env

# 5. Start development server
npm run dev

# 6. Open http://localhost:5173 in your browser
```

## Building for Production 📦

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

The optimized build will be in the `dist/` folder.

## Deploying to Firebase Hosting 🌐

### Option 1: Using Firebase CLI

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Initialize Firebase hosting
firebase init hosting

# 4. Build the project
npm run build

# 5. Deploy
firebase deploy
```

### Option 2: Using Netlify

1. Build the project: `npm run build`
2. Connect your repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables in Netlify dashboard

### Option 3: Using Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`
3. Follow the prompts

## PWA Installation Guide 📲

### Desktop (Chrome/Edge)
1. Open the app in your browser
2. Click the **"Install"** button in the address bar
3. Click **"Install"**
4. The app will appear in your applications

### Mobile (iOS/Android)
1. Open the app in your mobile browser
2. Tap **Share** (bottom menu)
3. Tap **Add to Home Screen**
4. Name the app and tap **Add**

## Usage Guide 📖

### Creating a Streak
1. Click **"New Streak"** button
2. Enter streak name (e.g., "Daily LeetCode")
3. Select category and icon
4. Set daily reminder time
5. Click **"Create"**

### Checking In
1. Find your streak card
2. Click **"🔥 Check In Today"**
3. Your current streak will increment
4. Get notified of your progress!

### Using Freeze Protection
1. Open a streak card
2. Click the **"▼"** to see more options
3. Click **"Use Freeze"**
4. Your streak is protected if you miss a day
5. Freezes reset monthly (2 per month)

### Recovering a Streak
1. If you miss checking in for 2+ days, your streak resets
2. Click **"Recover"** to restore the streak
3. You lose 2 days as a penalty
4. Use wisely!

### Viewing Activity
1. Scroll down on the dashboard
2. View the **Activity Heatmap**
3. Green = checked in, Gray = missed
4. Calendar shows your consistency

## Key Features Explained 💡

### Streak System
- **Current Streak**: Consecutive days without missing
- **Longest Streak**: Your personal best
- **Last Check-in**: Most recent check-in date

### Freeze Protection
- 2 free freezes per month
- Use when you can't check in but don't want to lose your streak
- Freezes reset on the first of each month

### Recovery System
- If you miss 2+ consecutive days, streak resets to 0
- Use the **"Recover"** option to restore it
- Penalty: lose 2 days from your current streak

### Notifications
- Daily reminder notifications at your set time
- Check-in celebration notifications
- New streak creation notifications
- Works offline with service worker

## Architecture & Code Quality 🏗️

### Component Architecture
- **Pages**: Full page components (LoginPage, DashboardPage, etc.)
- **Components**: Reusable UI components (Button, Modal, etc.)
- **Hooks**: Custom React hooks (useAuth, useStreaks)
- **Services**: Business logic layer (Firebase operations)
- **Utils**: Helper functions and constants

### State Management
- React hooks for component state
- Firebase real-time listeners for data sync
- Custom hooks (useAuth, useStreaks) for complex logic

### Code Quality
- ✅ No TODO or placeholder code
- ✅ Full error handling
- ✅ Input validation
- ✅ Clean, modular structure
- ✅ Well-commented code
- ✅ Responsive design
- ✅ Accessibility considered

## Performance Optimizations ⚡

- Code splitting with Vite
- Service worker caching strategy
- Lazy loading of routes
- Optimized animations with Framer Motion
- Minified production builds
- Efficient Firebase queries

## Browser Support 🌐

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## Security Considerations 🔒

- Firebase Authentication handles password hashing
- Firestore rules restrict data access to authenticated users
- No sensitive data in localStorage
- HTTPS only (required for PWA)
- Environment variables for secrets

## Troubleshooting 🔧

### Firebase Config Errors
- Verify all environment variables are set correctly
- Check that your Firebase project IDs match
- Ensure you've enabled Email/Password auth in Firebase

### Service Worker Issues
- Clear browser cache: DevTools > Application > Clear storage
- Unregister old service workers: DevTools > Application > Service Workers
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Offline Issues
- First visit should be online to download assets
- Subsequent visits work offline
- Check cache status in DevTools > Application > Cache Storage

### Notifications Not Working
- Check browser notification permissions
- Verify you've clicked "Allow" on permission prompt
- Ensure HTTPS is enabled

## Contributing 🤝

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License 📄

MIT License - feel free to use this project however you like!

## Support & Feedback 💬

Found a bug? Have a suggestion? Open an issue or reach out!

## Roadmap 🗺️

Future features to consider:
- [ ] Social sharing of streak milestones
- [ ] Streak statistics and analytics
- [ ] Custom streak categories
- [ ] Streak challenges with friends
- [ ] Advanced notification scheduling
- [ ] Dark/Light theme toggle
- [ ] Backup and restore data
- [ ] Export data as CSV

---

**Keep your streaks alive! 🔥**

Made with ❤️ for productivity lovers.
