# Architecture Documentation - Streak Maintainer

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    User Browser (PWA)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            React Components + Hooks                   │   │
│  │  - DashboardPage                                      │   │
│  │  - LoginPage / RegisterPage                           │   │
│  │  - StreakCard, CalendarHeatmap, etc.                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          Custom Hooks (State Management)              │   │
│  │  - useAuth: Authentication state & actions           │   │
│  │  - useStreaks: Streak data & operations              │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │             Service Layer (Business Logic)           │   │
│  │  - authService.js: Firebase Auth operations          │   │
│  │  - streakService.js: Streak CRUD & logic            │   │
│  │  - notificationService.js: Notifications            │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Firebase SDK (Connection Layer)              │   │
│  │  - firebase.js: Config & initialization              │   │
│  │  - Authentication API                                │   │
│  │  - Firestore API                                     │   │
│  │  - Cloud Messaging API                               │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Service Workers (Offline Support)            │   │
│  │  - Cache static assets                               │   │
│  │  - Handle push notifications                         │   │
│  │  - Background sync                                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          ↓
          ┌─────────────────────────────────┐
          │      Firebase Backend           │
          ├─────────────────────────────────┤
          │  • Authentication (Firebase)    │
          │  • Firestore (Database)         │
          │  • Cloud Messaging (Push)       │
          │  • Hosting (Deployment)         │
          └─────────────────────────────────┘
```

---

## Data Flow

### User Registration Flow

```
1. User enters email & password in RegisterPage
                    ↓
2. Input validation (email format, password length)
                    ↓
3. Call useAuth().register(email, password)
                    ↓
4. authService.register() → Firebase Auth
                    ↓
5. Create user in Firebase Auth
                    ↓
6. Call streakService.initializeUserProfile(userId, email)
                    ↓
7. Create user document in Firestore
                    ↓
8. Set user state in useAuth hook
                    ↓
9. Navigate to Dashboard
```

### Streak Creation Flow

```
1. User clicks "New Streak" button
                    ↓
2. StreakFormModal opens
                    ↓
3. User fills form (name, icon, category, etc.)
                    ↓
4. User clicks "Create"
                    ↓
5. Form validation
                    ↓
6. Call useStreaks().createStreak(formData)
                    ↓
7. streakService.createStreak() → Firebase Firestore
                    ↓
8. Add to users/{userId}/streaks collection:
   - name, icon, category, frequency
   - currentStreak: 0
   - longestStreak: 0
   - freezesLeft: 2
   - lastCheckIn: null
                    ↓
9. Real-time listener updates useStreaks hook
                    ↓
10. streaks state updates
                    ↓
11. DashboardPage re-renders with new streak
```

### Daily Check-In Flow

```
1. User clicks "Check In Today" on streak card
                    ↓
2. Call useStreaks().checkInToday(streakId)
                    ↓
3. streakService.checkInToday():
   - Get current date (normalize to 00:00:00)
   - Fetch current streak doc
   - Check if already checked in today
                    ↓
4. Update Firestore:
   - Set lastCheckIn to today
   - Increment currentStreak
   - Update longestStreak if needed
   - Update updatedAt timestamp
                    ↓
5. Real-time listener fires
                    ↓
6. useStreaks state updates automatically
                    ↓
7. Component re-renders with new streak count
                    ↓
8. Show success notification
                    ↓
9. Service worker can sync offline updates
```

### Offline Check-In Flow

```
1. User clicks "Check In" while offline
                    ↓
2. Firestore SDK queues the write
                    ↓
3. Service worker intercepts (optional)
                    ↓
4. When online again:
   - Firebase SDK automatically syncs
   - Queued writes apply to Firestore
   - Real-time listeners get updates
```

---

## State Management Architecture

### useAuth Hook
```javascript
State:
├── user: User object or null
├── loading: boolean (auth state unknown)
└── error: string or null

Methods:
├── register(email, password): Promise
├── login(email, password): Promise
├── logout(): Promise
└── subscribeToAuthStateChange(callback)
```

### useStreaks Hook
```javascript
State:
├── streaks: Array of streak objects
├── loading: boolean
└── error: string or null

Methods:
├── createStreak(data): Promise
├── updateStreak(id, updates): Promise
├── deleteStreak(id): Promise
├── checkInToday(id): Promise
├── useFreeze(id): Promise
└── recoverStreak(id): Promise
```

### Real-Time Synchronization
```
Component mounts
    ↓
useStreaks hook initializes
    ↓
streakService.subscribeToStreaks() called
    ↓
Firebase real-time listener registered
    ↓
Initial data fetched and state set
    ↓
Any Firestore changes trigger listener callback
    ↓
State updates automatically
    ↓
Component re-renders with new data
    ↓
Component unmounts
    ↓
Unsubscribe called (cleanup)
```

---

## Firestore Data Model

### Collection Structure

```
firestore
└── users/
    └── {userId}/ (document)
        ├── email: string
        ├── createdAt: timestamp
        ├── lastFreezeReset: timestamp
        │
        └── streaks/ (subcollection)
            └── {streakId}/ (document)
                ├── name: string
                ├── icon: string (emoji)
                ├── category: string
                ├── frequency: string (daily/weekly)
                ├── currentStreak: number
                ├── longestStreak: number
                ├── freezesLeft: number (0-2)
                ├── lastCheckIn: timestamp or null
                ├── reminderTime: string (HH:mm)
                ├── createdAt: timestamp
                └── updatedAt: timestamp
```

### Security Rules
```
users/{userId} - User can read/write own data
users/{userId}/streaks/{streakId} - Full access to own streaks
All other paths - Denied
```

---

## Component Hierarchy

### Page Components
```
App
└── Router
    ├── LoginPage (public)
    ├── RegisterPage (public)
    └── ProtectedRoute
        └── DashboardPage (private)
```

### DashboardPage Component Tree
```
DashboardPage
├── Header
│   ├── Logo
│   ├── User Email
│   ├── Settings Button
│   └── Logout Button
│
├── Main Content
│   ├── Title + CTA
│   ├── Stats Overview
│   │   ├── Total Streaks Card
│   │   ├── Longest Streak Card
│   │   └── Total Freezes Card
│   │
│   ├── Streaks Grid (2 columns)
│   │   └── StreakCard (×n)
│   │       ├── Icon + Name + Badge
│   │       ├── Stats (Current/Best/Freezes)
│   │       ├── Check-in Button
│   │       └── Actions Menu
│   │           ├── Use Freeze Button
│   │           ├── Recover Button
│   │           ├── Edit Button
│   │           └── Delete Button
│   │
│   └── CalendarHeatmap (for first streak)
│       ├── Calendar Grid
│       └── Intensity Legend
│
├── StreakFormModal
│   ├── Name Input
│   ├── Category Select
│   ├── Frequency Select
│   ├── Icon Grid Selector
│   ├── Reminder Time Picker
│   └── Action Buttons
│
└── Footer
    └── Copyright Info
```

### Reusable Components
```
common.jsx exports:
├── EmptyState: Shows when no data
├── SkeletonLoader: Loading placeholder
├── Alert: Notification messages
├── Button: Styled buttons
├── Modal: Dialog wrapper
├── Input: Text input field
├── Select: Dropdown select
└── Badge: Small label tags
```

---

## Service Layer Architecture

### authService.js
```
authService
├── register(email, password)
│   └── createUserWithEmailAndPassword()
│
├── login(email, password)
│   └── signInWithEmailAndPassword()
│
├── logout()
│   └── signOut()
│
└── subscribeToAuthStateChange(callback)
    └── onAuthStateChanged()
```

### streakService.js
```
streakService
├── createStreak(userId, data)
│   └── addDoc() → Firestore
│
├── subscribeToStreaks(userId, callback)
│   └── onSnapshot() → Real-time listener
│
├── getStreaks(userId)
│   └── getDocs() → One-time fetch
│
├── updateStreak(userId, streakId, updates)
│   └── updateDoc() → Firestore
│
├── deleteStreak(userId, streakId)
│   └── deleteDoc() → Firestore
│
├── checkInToday(userId, streakId)
│   ├── Get current date
│   ├── Fetch current streak data
│   └── updateDoc() → Increment currentStreak
│
├── useFreeze(userId, streakId)
│   └── updateDoc() → Decrement freezesLeft
│
├── recoverStreak(userId, streakId)
│   └── updateDoc() → Subtract penalty days
│
└── resetStreakIfMissed(userId, streakId)
    ├── Check days since lastCheckIn
    └── If >= 2 days → Set currentStreak to 0
```

### notificationService.js
```
notificationService
├── requestPermission()
│   └── Notification.requestPermission()
│
├── listenToMessages(callback)
│   └── onMessage() → Firebase Cloud Messaging
│
├── sendLocalNotification(title, options)
│   └── new Notification()
│
└── scheduleLocalNotification(title, options, delayMs)
    └── setTimeout() then sendLocalNotification()
```

---

## Utility Functions

### streakUtils.js
```
Calculations:
├── getCalendarData(streak): Array
│   └── Generate calendar grid with check-in status
│
├── hasCheckedInToday(streak): Boolean
│   └── Check if today's date matches lastCheckIn
│
├── shouldResetStreak(streak): Boolean
│   └── Check if 2+ days have passed since lastCheckIn
│
└── getDaysUntilFreezeReset(lastFreezeReset): Number
    └── Calculate days until next freeze reset

Constants:
├── STREAK_CATEGORIES: Object
├── FREQUENCIES: Object
└── EMOJI_ICONS: Array
```

### validation.js
```
Validators:
├── validateEmail(email): Boolean
├── validatePassword(password): Boolean
└── validateStreakName(name): Boolean
```

### helpers.js
```
Utilities:
├── cn(...classes): String
│   └── Conditional class concatenation
│
└── truncateText(text, maxLength): String
    └── Truncate text with ellipsis
```

---

## Authentication Flow

### Protected Route Pattern
```
<ProtectedRoute>
├── Check user auth state
├── If loading: Show skeleton
├── If not authenticated: Redirect to /login
└── If authenticated: Render children (DashboardPage)
```

### Session Management
```
App mounts
    ↓
useAuth hook initializes
    ↓
subscribeToAuthStateChange() called
    ↓
Firebase checks stored auth token
    ↓
If valid token:
    ├── Restore user session
    └── Set user state
    
If no token:
    └── Set user to null
    
User navigates:
    ├── If /login or /register: Allowed if no user
    └── If /: Protected by ProtectedRoute
```

---

## PWA Architecture

### Service Worker Lifecycle

```
1. Registration (during app load)
   index.html → register sw.js
            ↓
2. Installation
   Cache critical assets
            ↓
3. Activation
   Clean up old caches
            ↓
4. Fetch Events
   Intercept requests
   Serve from cache or network
            ↓
5. Updates
   Check for sw.js changes
   Update if needed
```

### Cache Strategy

```
Static Assets (CSS, JS, images):
├── Check cache first
├── If miss → Fetch from network
└── Cache the response for next time

API Calls (Firestore, Auth):
├── Try network first
├── If fail → Serve from cache (stale data)
└── Always attempt network

Dynamic Routes:
├── Always serve index.html
└── Let React Router handle routing
```

### Notification Flow

```
User grants notification permission
            ↓
notificationService.requestPermission()
            ↓
Receives FCM token
            ↓
Service Worker ready to receive messages
            ↓
Backend sends push notification (optional)
            ↓
Service Worker receives in background
            ↓
sw.addEventListener('push')
            ↓
self.registration.showNotification()
            ↓
User sees notification even if app closed
            ↓
User clicks → notificationclick handler
            ↓
Open/focus app
```

---

## Error Handling Strategy

### Authentication Errors
```
Firebase Error Code → User Message
├── auth/email-already-in-use → "Email already in use"
├── auth/weak-password → "Password too weak"
├── auth/invalid-credential → "Invalid email or password"
└── auth/user-not-found → "User not found"
```

### Firestore Errors
```
Firebase Error → Graceful Handling
├── Network error → Retry with exponential backoff
├── Permission denied → Show auth error
└── Document not found → Handle gracefully
```

### UI Error States
```
Errors displayed via:
├── Alert component (at top of page)
├── Field-level validation messages
├── Toast/notification system
└── Loading states with retry buttons
```

---

## Performance Optimization

### Rendering Optimization
```
Techniques:
├── React.memo() for pure components
├── useCallback() for stable function references
├── Lazy loading of routes
└── Memoized selectors in hooks
```

### Bundle Optimization
```
Code Splitting:
├── Main app chunk (~50KB)
├── Firebase chunk (~40KB)
├── Framer Motion chunk (~30KB)
└── Lazy-loaded routes on demand

Minification:
├── Production builds minified
├── Tree-shaking removes unused code
└── CSS purged of unused styles
```

### Firebase Optimization
```
Query Optimization:
├── Indexed queries for fast lookups
├── Real-time listeners only on needed data
└── Pagination ready for large datasets

Caching:
├── Service worker caches static assets
├── Browser cache with proper headers
└── Local component state for UI state
```

---

## Scalability Considerations

### For More Users
```
✓ Firestore auto-scales
✓ Firebase Auth handles millions
✓ Service worker caching reduces server load
✓ Cloud CDN optional for static files
✓ No changes needed to codebase
```

### For More Features
```
Add new collections:
├── /users/{userId}/settings/
├── /users/{userId}/achievements/
├── /shared-streaks/{streakId}/
└── /challenges/{challengeId}/

Extend existing components:
├── Add new pages in /pages
├── Add new components in /components
├── Add new services in /services
└── Add new hooks in /hooks
```

### Database Growth
```
Per user storage:
├── User doc: ~1KB
├── Per streak: ~2KB
├── At 100 streaks: ~201KB per user
└── Firestore handles efficiently

Query efficiency:
├── Indexed by userId
├── Subcollections prevent hotspots
└── Real-time listeners optimized
```

---

## Development Workflow

### Local Development
```
1. npm install - Install dependencies
2. Create .env - Add Firebase config
3. npm run dev - Start dev server
4. Open http://localhost:5173
5. Hot reload on file changes
```

### Testing Strategy
```
Manual Testing:
├── Register/login flow
├── Create/edit/delete streaks
├── Check-in functionality
├── Freeze and recovery
├── Offline functionality
└── Mobile responsiveness
```

### Production Deployment
```
1. npm run build - Create optimized build
2. firebase deploy - Deploy to hosting
3. Automatic HTTPS
4. CDN distribution
5. Analytics tracking
6. Error monitoring (optional)
```

---

## Security Architecture

### Authentication Security
```
✓ Firebase handles password hashing (bcrypt)
✓ Secure session tokens
✓ Email verification ready
✓ Password reset flow available
✓ Account recovery options
```

### Data Security
```
✓ Firestore rules enforce user isolation
✓ HTTPS only communication
✓ Environment variables for secrets
✓ No sensitive data in local storage
✓ Service worker doesn't cache auth tokens
```

### API Security
```
✓ Firebase Auth for identity
✓ Security rules for access control
✓ Rate limiting on backend
✓ DDoS protection included
✓ Automatic backups available
```

---

This architecture ensures scalability, maintainability, security, and performance while keeping the codebase clean and understandable.
