# Deployment Guide for Streak Maintainer

Complete guide to deploy your Streak Maintainer app to production.

## Table of Contents
1. [Firebase Hosting](#firebase-hosting)
2. [Netlify](#netlify)
3. [Vercel](#vercel)
4. [Custom Server](#custom-server)
5. [Domain Setup](#domain-setup)

---

## Firebase Hosting

**Recommended for Firebase projects - simplest setup!**

### Prerequisites
- Firebase CLI: `npm install -g firebase-tools`
- Firebase project already created
- App built: `npm run build`

### Steps

1. **Initialize Firebase**
   ```bash
   firebase login
   firebase init hosting
   ```

2. **Configuration prompts:**
   - Select your Firebase project
   - Public directory: `dist`
   - Configure as single-page app: `Yes`
   - Set up automatic builds: `No` (or `Yes` if using GitHub)

3. **Build your app**
   ```bash
   npm run build
   ```

4. **Deploy**
   ```bash
   firebase deploy
   ```

5. **View your app**
   ```
   Your app is live at: https://YOUR-PROJECT-ID.web.app
   ```

### Automatic Deployment with GitHub

1. In Firebase Console, go to **Hosting**
2. Click **Connect repository**
3. Select your GitHub repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Connect and deploy

Every push to main branch will auto-deploy!

---

## Netlify

**Great for GitHub integration and global CDN**

### Option 1: Using Git (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR-USERNAME/streak-maintainer.git
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click **"New site from Git"**
   - Select GitHub
   - Choose your repository
   - Select branch: `main`

3. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Set environment variables**
   - Click **"Site settings"** → **"Build & deploy"** → **"Environment"**
   - Add all variables from your `.env` file
   - Format: `VITE_FIREBASE_API_KEY=YOUR_VALUE`

5. **Deploy**
   - Netlify will automatically build and deploy
   - Your site is live!

### Option 2: Manual Deploy

1. Build locally:
   ```bash
   npm run build
   ```

2. Drop `dist` folder into Netlify dashboard
3. Done!

### Netlify Configuration File (optional)

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[context.production]
  environment = { NODE_VERSION = "18" }

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Vercel

**Optimal for Next.js but works great with Vite**

### Steps

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Configuration prompts:**
   - Scope: Select your account
   - Project name: `streak-maintainer`
   - Framework: `Vite`
   - Root: `.`
   - Output directory: `dist`
   - Override build command: `npm run build`

4. **Add environment variables**
   - Go to Vercel dashboard
   - Click your project
   - Go to **Settings** → **Environment Variables**
   - Add all `VITE_*` variables

5. **Deploy**
   - Vercel will build and deploy automatically
   - Your site is live!

### Enable Auto-Deploy from GitHub

1. In Vercel, click **Settings** → **Git**
2. Connect your GitHub repository
3. Enable "Automatic deployments"

---

## Custom Server

**For full control - deploy anywhere**

### Node.js Server (Recommended)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Create server.js**
   ```javascript
   import express from 'express';
   import { fileURLToPath } from 'url';
   import { dirname, join } from 'path';

   const __filename = fileURLToPath(import.meta.url);
   const __dirname = dirname(__filename);

   const app = express();
   const PORT = process.env.PORT || 3000;

   // Serve static files from dist
   app.use(express.static(join(__dirname, 'dist')));

   // SPA routing - serve index.html for all routes
   app.get('*', (req, res) => {
     res.sendFile(join(__dirname, 'dist', 'index.html'));
   });

   app.listen(PORT, () => {
     console.log(`Server running at http://localhost:${PORT}`);
   });
   ```

3. **Update package.json**
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "vite",
       "build": "vite build"
     }
   }
   ```

4. **Deploy to hosting provider**

### Using PM2 (Process Management)

```bash
# Install PM2
npm install -g pm2

# Start app
pm2 start server.js --name "streak-maintainer"

# View logs
pm2 logs

# Restart on reboot
pm2 startup
pm2 save
```

---

## Docker Deployment

**For containerized deployments**

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - VITE_FIREBASE_API_KEY=${VITE_FIREBASE_API_KEY}
      - VITE_FIREBASE_AUTH_DOMAIN=${VITE_FIREBASE_AUTH_DOMAIN}
      # ... other env vars
```

### Build and Run

```bash
# Build image
docker build -t streak-maintainer .

# Run container
docker run -p 3000:3000 streak-maintainer
```

---

## Domain Setup

### Firebase Hosting

1. In Firebase Console → **Hosting**
2. Click **"Connect domain"**
3. Enter your domain
4. Follow DNS setup instructions
5. SSL certificate auto-generated in ~24 hours

### Netlify

1. Go to **Site settings** → **Domain settings**
2. Click **"Add domain"**
3. Enter your domain
4. Update DNS records to Netlify nameservers
5. Verify domain ownership

### Vercel

1. In project **Settings** → **Domains**
2. Click **"Add domain"**
3. Enter your domain
4. Update DNS records per Vercel instructions
5. SSL auto-provisioned

### Using Custom Domain with Any Provider

**DNS Records to Add:**
```
Type: A
Name: @
Value: [Your provider's IP or CNAME]

Type: AAAA (IPv6)
Name: @
Value: [Your provider's IPv6]

Type: CNAME (for www)
Name: www
Value: [Your provider's domain]
```

---

## Environment Variables for Production

**Important:** Always use environment variables for secrets!

### Firebase Variables
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
```

### Setting Variables

**Firebase Hosting:**
```bash
firebase functions:config:set vars.api_key="YOUR_KEY"
```

**Netlify:** Dashboard → Site settings → Build & deploy → Environment

**Vercel:** Dashboard → Settings → Environment Variables

---

## Performance Optimization

### Before Deploying

1. **Check bundle size**
   ```bash
   npm install -g vite-plugin-visualizer
   npm run build
   ```

2. **Optimize images**
   - Use appropriate formats (WebP, PNG, SVG)
   - Compress images
   - Use lazy loading

3. **Enable gzip compression**
   - Firebase: Auto-enabled
   - Other providers: Enable in server config

4. **Set cache headers**
   ```json
   {
     "headers": [{
       "source": "**/*.{js,css,woff2}",
       "headers": [{
         "key": "Cache-Control",
         "value": "max-age=31536000, immutable"
       }]
     }]
   }
   ```

### Monitoring

- **Firebase**: Go to **Analytics** tab in Hosting
- **Netlify**: Dashboard shows performance metrics
- **Vercel**: Analytics dashboard available
- **Google PageSpeed**: https://pagespeed.web.dev

---

## Continuous Integration

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - name: Setup Node
      uses: actions/setup-node@v2
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm ci

    - name: Build
      run: npm run build
      env:
        VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
        VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
        # ... other secrets

    - name: Deploy to Firebase
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        channelId: live
        projectId: your-project-id
```

---

## Post-Deployment Checklist

- [ ] App loads without errors
- [ ] Authentication works (register, login, logout)
- [ ] Can create, edit, delete streaks
- [ ] Check-in functionality works
- [ ] Notifications display properly
- [ ] App works offline (after first load)
- [ ] PWA installable
- [ ] Mobile responsive
- [ ] Performance acceptable (Lighthouse score > 90)
- [ ] Security headers configured
- [ ] HTTPS enforced
- [ ] Monitoring enabled
- [ ] Backups configured

---

## Troubleshooting Deployment

### App shows blank page
- Check browser console for errors
- Verify environment variables are set
- Check that dist folder was built
- Look for CORS errors

### Firebase auth not working
- Verify Firebase config variables
- Check Authentication is enabled in Firebase Console
- Review Firestore security rules

### Service Worker not updating
- Clear browser cache completely
- Uninstall and reinstall PWA
- Check service worker registration in DevTools

### Performance issues
- Check bundle size with vite-plugin-visualizer
- Enable gzip compression
- Optimize images
- Consider upgrading Firebase plan

---

## Support

- Firebase docs: https://firebase.google.com/docs
- Netlify docs: https://docs.netlify.com
- Vercel docs: https://vercel.com/docs
- Vite docs: https://vitejs.dev/guide/

---

**Your app is live! 🚀 Keep maintaining those streaks! 🔥**
