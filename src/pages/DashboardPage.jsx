import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useStreaks } from '../hooks/useStreaks';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { StreakCard } from '../components/StreakCard';
import { CalendarHeatmap } from '../components/CalendarHeatmap';
import { StreakFormModal } from '../components/StreakFormModal';
import { EmptyState, SkeletonLoader, Button, Alert } from '../components/common';
import { notificationService } from '../services/notificationService';
import { streakService } from '../services/streakService';

export const DashboardPage = () => {
  const { user } = useAuth();
  const {
    streaks,
    loading,
    error,
    createStreak,
    updateStreak,
    deleteStreak,
    checkInToday,
    useFreeze,
    recoverStreak,
  } = useStreaks(user?.uid);

  const [showModal, setShowModal] = useState(false);
  const [editingStreak, setEditingStreak] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedStreak, setSelectedStreak] = useState(null);
  const [message, setMessage] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // Initialize PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then((reg) => {
          console.log('Service Worker ready');
        })
        .catch((err) => console.log('Service Worker not ready:', err));
    }

    // Request notification permission
    notificationService.requestNotificationPermission().then((granted) => {
      if (granted) {
        console.log('Notifications enabled');
      }
    });
  }, []);

  // Check streaks for resets on mount and periodically
  useEffect(() => {
    const checkStreaks = async () => {
      if (!user?.uid || streaks.length === 0) return;

      // Streak reset checking is handled by detectStreakReset during check-in
      // No need for periodic check here
    };

    // Optional: Can add periodic checks later if needed
    // checkStreaks();
    // const interval = setInterval(checkStreaks, 3600000);
    // return () => clearInterval(interval);
  }, [user?.uid, streaks]);

  const handleCreateStreak = async (formData) => {
    try {
      setModalLoading(true);
      await createStreak(formData);
      setShowModal(false);
      setMessage({
        type: 'success',
        text: 'Streak created successfully! 🎉',
      });

      // Send notification
      notificationService.showNotification(
        'Streak Created!',
        {
          body: `Your "${formData.name}" streak is now being tracked!`,
          tag: 'streak-created',
        }
      );
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'Failed to create streak. Please try again.',
      });
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateStreak = async (formData) => {
    try {
      setModalLoading(true);
      await updateStreak(editingStreak.id, formData);
      setShowModal(false);
      setEditingStreak(null);
      setMessage({
        type: 'success',
        text: 'Streak updated successfully!',
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'Failed to update streak. Please try again.',
      });
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteStreak = async (streakId) => {
    if (!window.confirm('Are you sure you want to delete this streak?')) return;

    try {
      setActionLoading(streakId);
      await deleteStreak(streakId);
      setMessage({
        type: 'success',
        text: 'Streak deleted.',
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'Failed to delete streak.',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCheckIn = async (streakId) => {
    try {
      setActionLoading(streakId);
      await checkInToday(streakId);

      const streak = streaks.find((s) => s.id === streakId);
      notificationService.sendLocalNotification(
        'Keep it up! 🔥',
        {
          body: `You've checked in to "${streak?.name}". Current streak: ${
            streak?.currentStreak + 1
          }!`,
          tag: 'streak-checkin',
        }
      );

      setMessage({
        type: 'success',
        text: 'Great job! Your streak is alive! 🔥',
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'Failed to check in. Try again later.',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleUseFreeze = async (streakId) => {
    try {
      setActionLoading(streakId);
      await useFreeze(streakId);
      setMessage({
        type: 'success',
        text: 'Freeze used! Your streak is protected for today.',
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.message || 'Failed to use freeze.',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRecover = async (streakId) => {
    if (!window.confirm('Recover streak with -2 days penalty?')) return;

    try {
      setActionLoading(streakId);
      await recoverStreak(streakId);
      setMessage({
        type: 'success',
        text: 'Streak recovered with 2-day penalty!',
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'Failed to recover streak.',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditStreak = (streak) => {
    setEditingStreak(streak);
    setShowModal(true);
  };

  const handleSettingsClick = () => {
    // Settings functionality can be expanded here
    notificationService.sendLocalNotification(
      'Settings',
      {
        body: 'Settings panel coming soon!',
        tag: 'settings',
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50 flex flex-col">
      <Header onSettingsClick={handleSettingsClick} />

      <main className="flex-1 w-full overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Messages */}
          <AnimatePresence>
            {message && (
              <Alert
                type={message.type}
                message={message.text}
                onClose={() => setMessage(null)}
              />
            )}
          </AnimatePresence>

          {/* Title and CTA */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-16 gap-6"
          >
            <div>
              <h2 className="text-6xl font-bold text-slate-900 mb-3">Your Streaks</h2>
              <p className="text-slate-600 text-lg font-medium">Build unbreakable habits and track your progress</p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => {
                  setEditingStreak(null);
                  setShowModal(true);
                }}
                size="lg"
                variant="primary"
              >
                <Plus className="w-5 h-5" />
                New Streak
              </Button>
            </motion.div>
          </motion.div>

        {/* Loading state */}
        {loading && <SkeletonLoader count={3} />}

        {/* Empty state */}
        {!loading && streaks.length === 0 && (
          <EmptyState
            title="No Streaks Yet"
            description="Start tracking your first streak to keep yourself motivated!"
            action={
              <Button
                onClick={() => {
                  setEditingStreak(null);
                  setShowModal(true);
                }}
                variant="primary"
              >
                <Plus className="w-5 h-5" />
                Create Streak
              </Button>
            }
          />
        )}

        {/* Streaks grid */}
        {!loading && streaks.length > 0 && (
          <div className="space-y-10">
            {/* Stats overview */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            >
              <motion.div
                whileHover={{ y: -8 }}
                className="bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-200 rounded-3xl p-8 text-center hover:border-blue-400 shadow-lg hover:shadow-blue-200 transition-all"
              >
                <p className="text-blue-600 text-sm font-bold mb-3 uppercase tracking-widest">Total Streaks</p>
                <motion.p 
                  key={streaks.length}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-5xl font-bold text-blue-700"
                >
                  {streaks.length}
                </motion.p>
              </motion.div>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-amber-100 to-amber-50 border-2 border-amber-200 rounded-3xl p-8 text-center hover:border-amber-400 shadow-lg hover:shadow-amber-200 transition-all"
              >
                <p className="text-amber-600 text-sm font-bold mb-3 uppercase tracking-widest">Longest Streak</p>
                <motion.p 
                  key={Math.max(...streaks.map((s) => s.longestStreak), 0)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-5xl font-bold text-amber-700"
                >
                  {Math.max(...streaks.map((s) => s.longestStreak), 0)}
                </motion.p>
              </motion.div>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-purple-100 to-purple-50 border-2 border-purple-200 rounded-3xl p-8 text-center hover:border-purple-400 shadow-lg hover:shadow-purple-200 transition-all"
              >
                <p className="text-purple-600 text-sm font-bold mb-3 uppercase tracking-widest">Freezes Available</p>
                <motion.p 
                  key={streaks.reduce((sum, s) => sum + s.freezesLeft, 0)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-5xl font-bold text-purple-700"
                >
                  {streaks.reduce((sum, s) => sum + s.freezesLeft, 0)}
                </motion.p>
              </motion.div>
            </motion.div>

            {/* Streaks cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {streaks.map((streak, idx) => (
                <motion.div
                  key={streak.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <StreakCard
                    streak={streak}
                    onCheckIn={handleCheckIn}
                    onUseFreeze={handleUseFreeze}
                    onRecover={handleRecover}
                    onEdit={handleEditStreak}
                    onDelete={handleDeleteStreak}
                    loading={actionLoading === streak.id}
                  />
                </motion.div>
              ))}
            </div>

            {/* Calendar heatmap for first streak */}
            {streaks.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-10"
              >
                <CalendarHeatmap streak={streaks[0]} />
              </motion.div>
            )}
          </div>
        )}
        </div>
      </main>

      <Footer />

      {/* Modal */}
      <StreakFormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingStreak(null);
        }}
        onSubmit={editingStreak ? handleUpdateStreak : handleCreateStreak}
        streak={editingStreak}
        loading={modalLoading}
      />
    </div>
  );
};
