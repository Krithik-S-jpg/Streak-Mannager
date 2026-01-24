import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Alert, Button, Input, Modal } from '../components/common';
import { validateEmail, validatePassword } from '../utils/validation';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, error } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setMessage(error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(forgotEmail)) {
      setForgotMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    try {
      setForgotLoading(true);
      // In demo mode, just show success message
      setForgotMessage({ 
        type: 'success', 
        text: 'Check your email for password reset instructions! 📧' 
      });
      
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotEmail('');
        setForgotMessage(null);
      }, 3000);
    } catch (err) {
      setForgotMessage({ type: 'error', text: 'Failed to send reset email. Try again later.' });
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl inline-block"
          >
            🔥
          </motion.span>
          <h1 className="text-3xl font-bold text-slate-100 mt-4">Streak Maintainer</h1>
          <p className="text-slate-400 mt-2">Keep your streaks alive</p>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-8 border border-slate-700/50 space-y-4 backdrop-blur-xl shadow-2xl"
        >
          {message && (
            <Alert
              type="error"
              message={message}
              onClose={() => setMessage(null)}
            />
          )}

          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            disabled={loading}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            disabled={loading}
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            Sign In
          </Button>

          <p className="text-center text-slate-400 text-sm">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-sky-400 hover:text-sky-300 font-semibold transition-colors"
            >
              Sign up
            </button>
          </p>
        </motion.form>

        {/* Footer message */}
        <div className="text-center mt-6 text-slate-500 text-sm">
          <p>Demo mode: Use any email and password to get started</p>
        </div>

        {/* Forgot Password Modal */}
        <Modal
          isOpen={showForgotPassword}
          onClose={() => {
            setShowForgotPassword(false);
            setForgotEmail('');
            setForgotMessage(null);
          }}
          title="Reset Your Password"
          actions={
            <>
              <Button 
                variant="secondary" 
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotEmail('');
                  setForgotMessage(null);
                }} 
                disabled={forgotLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleForgotPassword}
                loading={forgotLoading}
                disabled={forgotLoading}
              >
                <Mail className="w-4 h-4" />
                Send Reset Link
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            {forgotMessage && (
              <Alert
                type={forgotMessage.type}
                message={forgotMessage.text}
                onClose={() => setForgotMessage(null)}
              />
            )}
            <p className="text-slate-300 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <Input
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              disabled={forgotLoading}
            />
          </div>
        </Modal>
      </motion.div>
    </div>
  );
};
