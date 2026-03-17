import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

const toastStore = {
  listeners: [],
  toasts: [],
  id: 0,

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  },

  notify(listeners) {
    listeners.forEach(listener => listener([...this.toasts]));
  },

  add(message, type = 'info', duration = 4000) {
    const id = this.id++;
    const toast = { id, message, type };
    this.toasts.push(toast);
    this.notify(this.listeners);

    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }

    return id;
  },

  remove(id) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.notify(this.listeners);
  },

  clear() {
    this.toasts = [];
    this.notify(this.listeners);
  }
};

export const useToast = () => {
  const [toasts, setToasts] = useState(toastStore.toasts);

  useEffect(() => {
    const unsubscribe = toastStore.subscribe(setToasts);
    return unsubscribe;
  }, []);

  return {
    success: (message, duration) => toastStore.add(message, 'success', duration),
    error: (message, duration) => toastStore.add(message, 'error', duration),
    info: (message, duration) => toastStore.add(message, 'info', duration),
    warning: (message, duration) => toastStore.add(message, 'warning', duration),
    remove: (id) => toastStore.remove(id),
    clear: () => toastStore.clear(),
  };
};

export const Toast = ({ id, message, type = 'info', onRemove }) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const colors = {
    success: 'bg-green-900/90 border-green-700/50 text-green-100 shadow-lg shadow-green-900/20',
    error: 'bg-red-900/90 border-red-700/50 text-red-100 shadow-lg shadow-red-900/20',
    warning: 'bg-yellow-900/90 border-yellow-700/50 text-yellow-100 shadow-lg shadow-yellow-900/20',
    info: 'bg-blue-900/90 border-blue-700/50 text-blue-100 shadow-lg shadow-blue-900/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: 10 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: -10, x: 10 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`flex items-center gap-3 p-4 rounded-lg border backdrop-blur-sm ${colors[type]} max-w-md`}
    >
      <span className="flex-shrink-0">{icons[type]}</span>
      <p className="flex-1 font-medium text-sm">{message}</p>
      <button
        onClick={() => onRemove(id)}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState(toastStore.toasts);

  useEffect(() => {
    const unsubscribe = toastStore.subscribe(setToasts);
    return unsubscribe;
  }, []);

  const handleRemove = (id) => toastStore.remove(id);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              id={toast.id}
              message={toast.message}
              type={toast.type}
              onRemove={handleRemove}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default toastStore;
