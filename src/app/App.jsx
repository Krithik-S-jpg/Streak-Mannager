import React, { useEffect } from 'react';
import { Router } from './Router';

export const App = () => {
  useEffect(() => {
    // Set dark mode
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="bg-slate-950 text-slate-100">
      <Router />
    </div>
  );
};

export default App;
