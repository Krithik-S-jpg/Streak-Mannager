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
    info: 'bg-blue-900/20 border-blue-800 text-blue-200',
    success: 'bg-green-900/20 border-green-800 text-green-200',
    warning: 'bg-yellow-900/20 border-yellow-800 text-yellow-200',
    error: 'bg-red-900/20 border-red-800 text-red-200',
  };

  const Icon = type === 'error' ? AlertCircle : Info;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-center gap-3 p-4 rounded-lg border ${bgColor[type]}`}
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
    'font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-sky-600 hover:bg-sky-700 text-white disabled:bg-slate-700',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white disabled:bg-slate-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white disabled:bg-slate-700',
    ghost: 'text-slate-300 hover:bg-slate-800 disabled:text-slate-600',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
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
        className="fixed inset-0 bg-black/50 z-40"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-slate-900 rounded-lg shadow-xl max-w-sm w-full">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold text-slate-100">{title}</h2>
          </div>
          <div className="p-6">{children}</div>
          {actions && (
            <div className="p-6 border-t border-slate-800 flex gap-3 justify-end">
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
      {label && <label className="block text-sm font-semibold text-slate-200 mb-2">{label}</label>}
      <input
        className={`w-full px-4 py-2 bg-slate-800 border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors ${
          error ? 'border-red-600' : 'border-slate-700'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};

// Select component
export const Select = ({ label, options, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-slate-200 mb-2">{label}</label>}
      <select
        className={`w-full px-4 py-2 bg-slate-800 border rounded-lg text-slate-100 focus:outline-none focus:border-sky-500 transition-colors ${
          error ? 'border-red-600' : 'border-slate-700'
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
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
  };

  return <span className={`px-3 py-1 rounded-full text-sm font-semibold ${variants[variant]} ${className}`}>{children}</span>;
};
