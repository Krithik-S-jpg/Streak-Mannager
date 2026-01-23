import React from 'react';
import { motion } from 'framer-motion';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900/50 border-t border-slate-800 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-slate-400 text-sm"
        >
          <p>
            Built with <span className="text-red-500">❤️</span> for productivity
          </p>
          <p className="mt-2">
            © {currentYear} Streak Maintainer. Keep your streaks alive! 🔥
          </p>
        </motion.div>
      </div>
    </footer>
  );
};
