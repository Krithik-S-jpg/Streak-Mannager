import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './styles/globals.css';

// Initialize demo data if needed
const initializeDemoData = () => {
  const DEMO_MODE = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (DEMO_MODE) {
    const demoUserId = 'demo-user-' + (localStorage.getItem('demoUserId') || Math.random().toString(36).substr(2, 9));
    localStorage.setItem('demoUserId', demoUserId);
    
    // Only add demo data if none exists
    const existingData = localStorage.getItem(`streaks_${demoUserId}`);
    if (!existingData) {
      const demoStreaks = [
        {
          id: 'streak_1',
          name: 'Morning Exercise',
          emoji: '💪',
          category: 'fitness',
          frequency: 'daily',
          reminderTime: '07:00',
          currentCount: 12,
          bestCount: 45,
          targetCount: 1,
          checkIns: Array.from({ length: 12 }, (_, i) => new Date(Date.now() - (11 - i) * 86400000).toISOString().split('T')[0]),
          freezesLeft: 3,
          lastCheckIn: new Date().toISOString().split('T')[0],
          createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
          notes: 'Keep pushing!',
        },
        {
          id: 'streak_2',
          name: 'Read a Book',
          emoji: '📚',
          category: 'learning',
          frequency: 'daily',
          reminderTime: '20:00',
          currentCount: 8,
          bestCount: 25,
          targetCount: 1,
          checkIns: Array.from({ length: 8 }, (_, i) => new Date(Date.now() - (7 - i) * 86400000).toISOString().split('T')[0]),
          freezesLeft: 2,
          lastCheckIn: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
          notes: 'Currently reading "Atomic Habits"',
        },
        {
          id: 'streak_3',
          name: 'Meditation',
          emoji: '🧘',
          category: 'wellness',
          frequency: 'daily',
          reminderTime: '06:30',
          currentCount: 0,
          bestCount: 15,
          targetCount: 1,
          checkIns: [],
          freezesLeft: 3,
          lastCheckIn: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
          createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
          notes: 'Need to get back on track',
        },
      ];
      localStorage.setItem(`streaks_${demoUserId}`, JSON.stringify(demoStreaks));
    }
  }
};

initializeDemoData();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Service Worker Logic
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('Service Worker registered', reg);
        // Check for updates periodically
        setInterval(() => {
          reg.update();
        }, 60000); // Check every minute
      })
      .catch((err) => console.log('Service Worker registration failed:', err));
  });
}
