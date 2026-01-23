# Streak Maintainer - Firebase Setup Guide

## Complete Firebase Configuration

This guide will walk you through setting up Firebase for Streak Maintainer step by step.

## Step 1: Create Firebase Project

1. Visit [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"** or **"Create a project"**
3. Enter **Project name**: "Streak Maintainer"
4. Accept the terms and click **"Continue"**
5. Choose your Google Analytics preference (optional)
6. Select or create a Google Cloud location
7. Click **"Create project"** and wait for setup to complete

## Step 2: Register Your Web App

1. In the Firebase Console, click the **"</>"** (web) icon
2. Enter **App nickname**: "Streak Maintainer Web"
3. Check "Also set up Firebase Hosting for this app" (optional but recommended)
4. Click **"Register app"**
5. Copy the Firebase config - you'll need this later

## Step 3: Enable Authentication

1. In the left menu, click **"Build"** → **"Authentication"**
2. Click **"Get started"**
3. Under **Sign-in method**, click **"Email/Password"**
4. Toggle **Enable** to turn it on
5. Leave password reset optional as default
6. Click **"Save"**

## Step 4: Create Firestore Database

1. In the left menu, click **"Build"** → **"Firestore Database"**
2. Click **"Create database"**
3. Choose your preferred region (select closest to your location)
4. Select **"Start in production mode"**
5. Click **"Create"** and wait for initialization

## Step 5: Configure Firestore Security Rules

1. In Firestore, click the **"Rules"** tab
2. Replace all content with the rules below:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Authenticated users can access their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      
      // Streaks subcollection
      match /streaks/{streakId} {
        allow read, write: if request.auth.uid == userId;
      }
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click **"Publish"**

## Step 6: Get Firebase Configuration

1. Go to **Project Settings** (gear icon in top left)
2. Click the **"General"** tab
3. Scroll down to **"Your apps"**
4. Find your web app and click the **"config"** icon or scroll to the code snippet
5. Copy the config object:

```javascript
{
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
}
```

## Step 7: Add Configuration to Project

1. In your project root, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env  # Linux/Mac
   copy .env.example .env  # Windows
   ```

2. Open `.env` and replace with your Firebase config:
   ```
   VITE_FIREBASE_API_KEY=YOUR_API_KEY
   VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
   VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
   VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
   VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
   VITE_FIREBASE_APP_ID=YOUR_APP_ID
   VITE_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
   ```

3. Save the file

## Step 8: Verify Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:5173 in your browser

3. Try to register a new account

4. If successful, check Firestore:
   - Go to Firestore Database in Firebase Console
   - You should see a new `users` collection with your user ID
   - Each user should have a `streaks` subcollection

## Optional: Enable Firebase Cloud Messaging (FCM)

For push notifications support (optional):

1. In Project Settings, click **"Cloud Messaging"** tab
2. Copy your **"Server API Key"**
3. Look for "Web Push certificates" and copy the **"VAPID Key"**
4. Add to `.env`:
   ```
   VITE_FIREBASE_VAPID_KEY=YOUR_VAPID_KEY
   ```

## Troubleshooting

### "Firebase is not initialized"
- Check that all environment variables are correctly set
- Restart the development server after updating .env

### "Permission denied" on Firestore
- Verify security rules are published
- Check that your user ID in the rules matches auth.uid

### "Auth/invalid-api-key"
- Verify API key in .env matches Firebase Console
- Regenerate the key in Firebase Console if needed

### "Project quota exceeded"
- Firebase free tier has rate limits
- Upgrade to Blaze plan if needed

## Firebase Free Tier Limits

- Authentication: 50,000 free users
- Firestore: 50,000 reads/day, 20,000 writes/day
- Storage: 5 GB
- Perfect for personal use and small projects!

## Next Steps

1. **Deploy to production** - Follow the README deployment guide
2. **Custom domain** - Setup custom domain in Firebase Hosting
3. **Enable analytics** - Firebase Console > Analytics to track usage
4. **Monitor costs** - Check Firebase Console > Usage to track spending

## Security Best Practices

✅ Never share your `.env` file
✅ Always use HTTPS in production
✅ Regularly review Firestore security rules
✅ Monitor Firebase Console for suspicious activity
✅ Use strong passwords for Firebase Console access
✅ Enable 2FA on your Google account

---

**Your Firebase setup is complete! 🎉**

Start the app with: `npm run dev`
