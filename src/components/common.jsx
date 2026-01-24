import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Info } from 'lucide-react';

// Empty state illustration component
export const EmptyState = ({ title, description, action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="mb-6"
      >
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center shadow-lg">
          <svg
            className="w-12 h-12 text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6v6m0 0v6m0-6h6m0 0h6m0-6H6m0 0H0"
            />
          </svg>
        </div>
      </motion.div>
      <h3 className="text-2xl font-bold text-slate-100 mb-3">{title}</h3>
      <p className="text-slate-400 mb-8 max-w-sm leading-relaxed">{description}</p>
      {action && <div className="scale-105">{action}</div>}
    </motion.div>
  );
};

// Loading skeleton
export const SkeletonLoader = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
          className="h-40 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl shadow-md"
        />
      ))}
    </div>
  );
};

// Alert component
export const Alert = ({ type = 'info', message, onClose }) => {
  const bgColor = {
    info: 'bg-blue-900/25 border-blue-800/50 text-blue-200 backdrop-blur-sm shadow-lg shadow-blue-900/20',
    success: 'bg-green-900/25 border-green-800/50 text-green-200 backdrop-blur-sm shadow-lg shadow-green-900/20',
    warning: 'bg-yellow-900/25 border-yellow-800/50 text-yellow-200 backdrop-blur-sm shadow-lg shadow-yellow-900/20',
    error: 'bg-red-900/25 border-red-800/50 text-red-200 backdrop-blur-sm shadow-lg shadow-red-900/20',
  };

  const Icon = type === 'error' ? AlertCircle : Info;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`flex items-center gap-3 p-4 rounded-xl border ${bgColor[type]}`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="flex-1 font-medium">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 text-lg font-bold hover:opacity-70 transition-opacity"
        >
          ×
        </button>
      )}
    </motion.div>
  );
};

// Button component
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses =
    'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-95';

  const variants = {
    primary: 'bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white shadow-lg shadow-sky-900/30 disabled:from-slate-700 disabled:to-slate-800 disabled:shadow-none',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white disabled:bg-slate-800 shadow-md shadow-slate-900/20',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-900/30 disabled:from-slate-700 disabled:to-slate-800',
    ghost: 'text-slate-300 hover:text-white hover:bg-slate-800/50 disabled:text-slate-600 disabled:bg-transparent',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
        />
      )}
      {children}
    </button>
  );
};

// Modal component
export const Modal = ({ isOpen, onClose, title, children, actions }) => {
  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl max-w-sm w-full border border-slate-700/50 max-h-[90vh] flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-700/50 flex-shrink-0">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">{title}</h2>
          </div>
          <div className="p-6 overflow-y-auto flex-1">{children}</div>
          <div className="p-6 border-t border-slate-800 flex gap-3 justify-end flex-shrink-0">
              {actions}
            </div>
        </div>
      </motion.div>
    </>
  );
};

// Input component
export const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-slate-200 mb-2.5">{label}</label>}
      <input
        className={`w-full px-4 py-3 bg-slate-800/80 border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 focus:bg-slate-800 transition-all backdrop-blur-sm ${
          error ? 'border-red-500 focus:ring-red-500/50' : 'border-slate-700 hover:border-slate-600'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-red-400 text-sm mt-1.5 font-medium">{error}</p>}
    </div>
  );
};

// Select component
export const Select = ({ label, options, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-slate-200 mb-2.5">{label}</label>}
      <select
        className={`w-full px-4 py-3 bg-slate-800/80 border rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 focus:bg-slate-800 transition-all appearance-none cursor-pointer backdrop-blur-sm ${
          error ? 'border-red-500 focus:ring-red-500/50' : 'border-slate-700 hover:border-slate-600'
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-400 text-sm mt-1.5 font-medium">{error}</p>}
    </div>
  );
};

// Badge component
export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-sky-900/50 text-sky-200 border border-sky-800',
    success: 'bg-green-900/50 text-green-200 border border-green-800',
    warning: 'bg-yellow-900/50 text-yellow-200 border border-yellow-800',
    danger: 'bg-red-900/50 text-red-200 border border-red-800',
    outline: 'bg-slate-800/50 text-slate-300 border border-slate-700 hover:border-slate-600',
  };

  return <span className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${variants[variant] || variants.primary} ${className}`}>{children}</span>;
};
