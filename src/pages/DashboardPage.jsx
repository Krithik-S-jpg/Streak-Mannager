import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BarChart3, Calendar, Flame, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useStreaks } from '../hooks/useStreaks';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { StreakCard } from '../components/StreakCard';
import { CalendarHeatmap } from '../components/CalendarHeatmap';
import { StreakFormModal } from '../components/StreakFormModal';
import { HabitTemplatesLibrary } from '../components/HabitTemplatesLibrary';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { StreakControls } from '../components/StreakControls';
import { EmptyState, SkeletonLoader, Button, Alert } from '../components/common';
import { streakService } from '../services/streakService';
import { notificationService } from '../services/notificationService';
import { hasCheckedInToday } from '../utils/streakUtils';

export const DashboardPage = () => {
  const { user } = useAuth();
  const {
    streaks,
    loading,
    createStreak,
    updateStreak,
    deleteStreak,
    checkInToday,
    useFreeze,
    recoverStreak,
  } = useStreaks(user?.uid);

  const [showModal, setShowModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [editingStreak, setEditingStreak] = useState(null);
  const [templateData, setTemplateData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  
  // Search, filter, and sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('current-desc');
  const [hideArchived, setHideArchived] = useState(true);

  // Stats calculation
  const totalStreaks = streaks.length;
  const activeStreaksCount = streaks.filter(s => s.currentCount > 0).length;
  const totalCheckIns = streaks.reduce((acc, s) => acc + (s.currentCount || 0), 0); // Simplified XP
  const checkedInTodayCount = streaks.filter(s => hasCheckedInToday(s.checkIns)).length;
  const dailyProgress = totalStreaks > 0 ? (checkedInTodayCount / totalStreaks) * 100 : 0;

  // Filter and sort streaks
  const filteredAndSortedStreaks = useMemo(() => {
    let result = [...streaks];

    // Filter by archive status
    if (hideArchived) {
      result = result.filter(s => !s.archived);
    }

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        s =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'current-desc':
          return (b.currentCount || 0) - (a.currentCount || 0);
        case 'current-asc':
          return (a.currentCount || 0) - (b.currentCount || 0);
        case 'best-desc':
          return (b.bestCount || 0) - (a.bestCount || 0);
        case 'best-asc':
          return (a.bestCount || 0) - (b.bestCount || 0);
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        default:
          return 0;
      }
    });

    return result;
  }, [streaks, searchQuery, sortBy, hideArchived]);

  // Initialize PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then(() => console.log('Service Worker ready'))
        .catch((err) => console.log('Service Worker not ready:', err));
    }

    notificationService.requestNotificationPermission().then((granted) => {
      if (granted) console.log('Notifications enabled');
    });
  }, []);

  const handleCreateStreak = async (formData) => {
    try {
      setModalLoading(true);
      await createStreak(formData);
      setShowModal(false);
      setTemplateData(null);
      setMessage({ type: 'success', text: 'Streak created successfully! 🎉' });
      notificationService.showNotification('Streak Created!', { body: `Tracking "${formData.name}"!` });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to create streak.' });
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
      setMessage({ type: 'success', text: 'Streak updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update streak.' });
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteStreak = async (streakId) => {
    if (!window.confirm('Delete this streak? This cannot be undone.')) return;
    try {
      setActionLoading(streakId);
      await deleteStreak(streakId);
      setMessage({ type: 'success', text: 'Streak deleted.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete streak.' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleArchiveStreak = async (streakId) => {
    try {
      setActionLoading(streakId);
      await streakService.archiveStreak(user?.uid, streakId);
      setMessage({ type: 'success', text: 'Streak archived.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to archive streak.' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnarchiveStreak = async (streakId) => {
    try {
      setActionLoading(streakId);
      await streakService.unarchiveStreak(user?.uid, streakId);
      setMessage({ type: 'success', text: 'Streak restored.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to restore streak.' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCheckIn = async (streakId) => {
    try {
      setActionLoading(streakId);
      await checkInToday(streakId);
      const streak = streaks.find((s) => s.id === streakId);

      // Fun messages
      const msgs = ['Nice work!', 'Keep it up!', 'On fire! 🔥', 'Unstoppable!', 'Legendary!'];
      const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];

      setMessage({ type: 'success', text: `${randomMsg} Checked in for ${streak?.name}` });

      // Trigger notifications and haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50]); // Double tap vibration
      }
      
      // Show push notification
      notificationService.showNotification(`✅ ${streak?.name} checked in!`, {
        body: `${randomMsg} ${streak?.currentCount} day streak!`,
        tag: 'streak-checkin',
        vibrate: [200, 100, 200],
      });

    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to check in.' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleUseFreeze = async (streakId) => {
    try {
      setActionLoading(streakId);
      await useFreeze(streakId);
      setMessage({ type: 'success', text: 'Streak frozen! ❄️ Protected for today.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRecover = async (streakId) => {
    if (!window.confirm('Recover streak for -2 days penalty?')) return;
    try {
      setActionLoading(streakId);
      await recoverStreak(streakId);
      setMessage({ type: 'success', text: 'Streak recovered! Penalty applied.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to recover streak.' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditStreak = (streak) => {
    setEditingStreak(streak);
    setShowModal(true);
  };

  const handleSelectTemplate = (template) => {
    setTemplateData(template);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col font-sans selection:bg-orange-500/30">
      <Header
        onSettingsClick={() => setShowSettings(true)}
        totalCheckIns={totalCheckIns}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {/* Messages Toast */}
        <AnimatePresence>
          {message && (
            <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
               <Alert type={message.type} message={message.text} onClose={() => setMessage(null)} />
            </div>
          )}
        </AnimatePresence>

        {/* Hero / Daily Progress Section */}
        {!loading && streaks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 rounded-2xl p-8 border border-slate-700/30 shadow-2xl backdrop-blur-md relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 blur-3xl rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />

             <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div>
                   <h2 className="text-2xl font-bold text-white mb-2">
                     {dailyProgress === 100 ? 'All Done for Today! 🎉' : `You're crushing it, ${user?.displayName || 'Legend'}!`}
                   </h2>
                   <p className="text-slate-400">
                     You've checked in <span className="text-white font-bold">{checkedInTodayCount}</span> of <span className="text-white font-bold">{totalStreaks}</span> streaks today.
                   </p>
                </div>

                {/* Daily Progress Circle */}
                <div className="flex items-center gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                   <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-slate-800" />
                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-orange-500 transition-all duration-1000" strokeDasharray="175.9" strokeDashoffset={175.9 - (175.9 * dailyProgress) / 100} />
                      </svg>
                      <span className="absolute text-sm font-bold text-white">{Math.round(dailyProgress)}%</span>
                   </div>
                   <div className="text-sm">
                      <p className="text-slate-400">Daily Goal</p>
                      <p className="text-white font-bold">{totalStreaks - checkedInTodayCount} left</p>
                   </div>
                </div>
             </div>
          </motion.div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Your Dashboard</h2>
            <p className="text-slate-400 mt-1">Manage your habits and track your progress</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowTemplates(true)}
              variant="secondary"
              className="border border-slate-700"
            >
              <Sparkles className="w-5 h-5" />
              Browse Templates
            </Button>
            <Button
              onClick={() => {
                setEditingStreak(null);
                setTemplateData(null);
                setShowModal(true);
              }}
              variant="primary"
              className="shadow-lg shadow-orange-900/20"
            >
              <Plus className="w-5 h-5" />
              New Streak
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <SkeletonLoader count={1} className="h-64" />
             <SkeletonLoader count={1} className="h-64" />
          </div>
        )}

        {/* Empty State */}
        {!loading && streaks.length === 0 && (
          <EmptyState
            title="Start Your Journey"
            description="Create your first streak to unlock the dashboard power!"
            action={
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => setShowTemplates(true)}
                  variant="secondary"
                >
                  <Sparkles className="w-5 h-5" />
                  Browse Templates
                </Button>
                <Button
                  onClick={() => {
                    setEditingStreak(null);
                    setTemplateData(null);
                    setShowModal(true);
                  }}
                  variant="primary"
                >
                  <Plus className="w-5 h-5" />
                  Create Custom
                </Button>
              </div>
            }
          />
        )}

        {/* Streaks Grid */}
        {!loading && streaks.length > 0 && (
          <div className="space-y-8">
            {/* Analytics Dashboard */}
            <AnalyticsDashboard streaks={streaks} />

            {/* Search, Filter, Sort Controls */}
            <StreakControls
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              filterArchived={hideArchived}
              onFilterChange={setHideArchived}
            />

            {/* Streaks Grid */}
            {filteredAndSortedStreaks.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedStreaks.map((streak) => (
                  <StreakCard
                    key={streak.id}
                    streak={streak}
                    onCheckIn={handleCheckIn}
                    onUseFreeze={handleUseFreeze}
                    onRecover={handleRecover}
                    onEdit={handleEditStreak}
                    onDelete={handleDeleteStreak}
                    onArchive={handleArchiveStreak}
                    onUnarchive={handleUnarchiveStreak}
                    loading={actionLoading === streak.id}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400">No streaks match your search criteria</p>
              </div>
            )}

            {/* Analytics Section (Simplified) */}
            <div className="bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 rounded-2xl p-8 border border-slate-700/30 backdrop-blur-md">
               <div className="flex items-center gap-3 mb-6">
                 <BarChart3 className="w-6 h-6 text-slate-400" />
                 <h3 className="text-xl font-bold text-white">Activity Overview</h3>
               </div>

               {streaks.length > 0 && (
                  <div className="overflow-x-auto pb-2">
                     <CalendarHeatmap streak={streaks[0]} />
                     <p className="text-center text-xs text-slate-500 mt-2">Showing activity for "{streaks[0].name}"</p>
                  </div>
               )}
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Streak Form Modal */}
      <StreakFormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingStreak(null);
          setTemplateData(null);
        }}
        onSubmit={editingStreak ? handleUpdateStreak : handleCreateStreak}
        streak={editingStreak}
        template={templateData}
        loading={modalLoading}
      />

      {/* Habit Templates Library Modal */}
      <AnimatePresence>
        {showTemplates && (
          <HabitTemplatesLibrary
            onSelectTemplate={handleSelectTemplate}
            onClose={() => setShowTemplates(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
