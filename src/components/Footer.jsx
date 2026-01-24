import React from 'react';
import { motion } from 'framer-motion';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-t from-slate-900/80 to-slate-900/40 border-t border-slate-800/50 mt-16 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-slate-400 text-sm space-y-2"
        >
          <p>
            Built with <span className="text-red-500 animate-pulse">❤️</span> for productivity
          </p>
          <p>
            © {currentYear} <span className="font-bold bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">Streak Maintainer</span>
          </p>
          <p className="text-slate-500">Keep your streaks alive and stay consistent! 🔥</p>
        </motion.div>
      </div>
    </footer>
  );
};
