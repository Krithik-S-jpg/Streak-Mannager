import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Service Worker Logic
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    // Register in production
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('Service Worker registered'))
        .catch((err) => console.log('Service Worker registration failed:', err));
    });
  } else {
    // Unregister in development to avoid caching issues
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (let registration of registrations) {
        registration.unregister().then(() => {
          console.log('Service Worker unregistered (development mode)');
        });
      }
    });
  }
}
