import React, { useEffect } from 'react';
import { Router } from './Router';
import { PWABanner } from '../components/PWABanner';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { ToastContainer } from '../components/Toast';

const AppContent = () => {
  const { theme } = useTheme();

  const bgClass = theme === 'dark' 
    ? 'bg-slate-950 text-slate-100 dark' 
    : 'bg-white text-slate-900 light';

  return (
    <div className={`${bgClass} min-h-screen transition-colors duration-300`}>
      <PWABanner />
      <Router />
      <ToastContainer />
    </div>
  );
};

export const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
