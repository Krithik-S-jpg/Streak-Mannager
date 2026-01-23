import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Info } from 'lucide-react';

// Empty state illustration component
export const EmptyState = ({ title, description, action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="mb-4">
        <svg
          className="w-32 h-32 mx-auto text-slate-700 mb-4"
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
      <h3 className="text-xl font-bold text-slate-200 mb-2">{title}</h3>
      <p className="text-slate-400 mb-6 max-w-sm">{description}</p>
      {action && <div>{action}</div>}
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
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-32 bg-slate-800 rounded-lg"
        />
      ))}
    </div>
  );
};

// Alert component
export const Alert = ({ type = 'info', message, onClose }) => {
  const bgColor = {
    info: 'bg-blue-100 border-blue-300 text-blue-900',
    success: 'bg-green-100 border-green-300 text-green-900',
    warning: 'bg-yellow-100 border-yellow-300 text-yellow-900',
    error: 'bg-red-100 border-red-300 text-red-900',
  };

  const Icon = type === 'error' ? AlertCircle : Info;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-center gap-3 p-5 rounded-2xl border-2 ${bgColor[type]} font-semibold shadow-lg`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="text-lg font-bold hover:opacity-70 transition-opacity"
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
    'font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-blue-400/40 hover:scale-105',
    secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-900 shadow-md hover:shadow-slate-400/30 font-semibold',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-500/40',
    ghost: 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-semibold',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
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
    </motion.button>
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
        className="fixed inset-0 bg-black/40 z-40"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl max-w-sm w-full border-2 border-blue-100">
          <div className="p-8 border-b-2 border-blue-100">
            <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
          </div>
          <div className="p-8">{children}</div>
          {actions && (
            <div className="p-8 border-t-2 border-blue-100 flex gap-3 justify-end" key="modal-actions">
              {actions}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

// Input component
export const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-bold text-slate-900 mb-3">{label}</label>}
      <input
        className={`w-full px-4 py-3 bg-white border-2 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all ${
          error ? 'border-red-500' : 'border-slate-200'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-red-600 text-sm font-semibold mt-2">{error}</p>}
    </div>
  );
};

// Select component
export const Select = ({ label, options, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-bold text-slate-900 mb-3">{label}</label>}
      <select
        className={`w-full px-4 py-3 bg-white border-2 rounded-2xl text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all ${
          error ? 'border-red-500' : 'border-slate-200'
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-600 text-sm font-semibold mt-2">{error}</p>}
    </div>
  );
};

// Badge component
export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-blue-200 text-blue-900 border-2 border-blue-300 font-bold',
    success: 'bg-green-200 text-green-900 border-2 border-green-300',
    warning: 'bg-yellow-200 text-yellow-900 border-2 border-yellow-300',
    danger: 'bg-red-200 text-red-900 border-2 border-red-300',
  };

  return <span className={`px-4 py-2 rounded-full text-xs font-bold ${variants[variant]} ${className}`}>{children}</span>;
};
