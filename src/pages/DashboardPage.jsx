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
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Header onSettingsClick={handleSettingsClick} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-100">Your Streaks</h2>
            <p className="text-slate-400 mt-1">
              {streaks.length} active {streaks.length === 1 ? 'streak' : 'streaks'}
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingStreak(null);
              setShowModal(true);
            }}
            variant="primary"
          >
            <Plus className="w-5 h-5" />
            New Streak
          </Button>
        </div>

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
          <div className="space-y-6">
            {/* Stats overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-sky-900/20 border border-sky-800 rounded-lg p-4 text-center"
              >
                <p className="text-sky-400 text-sm font-semibold mb-1">Total Streaks</p>
                <p className="text-3xl font-bold text-sky-300">{streaks.length}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-amber-900/20 border border-amber-800 rounded-lg p-4 text-center"
              >
                <p className="text-amber-400 text-sm font-semibold mb-1">Longest Streak</p>
                <p className="text-3xl font-bold text-amber-300">
                  {Math.max(...streaks.map((s) => s.longestStreak), 0)}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-purple-900/20 border border-purple-800 rounded-lg p-4 text-center"
              >
                <p className="text-purple-400 text-sm font-semibold mb-1">Total Freezes</p>
                <p className="text-3xl font-bold text-purple-300">
                  {streaks.reduce((sum, s) => sum + s.freezesLeft, 0)}/
                  {streaks.length * 2}
                </p>
              </motion.div>
            </div>

            {/* Streaks cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {streaks.map((streak) => (
                <StreakCard
                  key={streak.id}
                  streak={streak}
                  onCheckIn={handleCheckIn}
                  onUseFreeze={handleUseFreeze}
                  onRecover={handleRecover}
                  onEdit={handleEditStreak}
                  onDelete={handleDeleteStreak}
                  loading={actionLoading === streak.id}
                />
              ))}
            </div>

            {/* Calendar heatmap for first streak */}
            {streaks.length > 0 && (
              <div className="mt-8">
                <CalendarHeatmap streak={streaks[0]} />
              </div>
            )}
          </div>
        )}
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
