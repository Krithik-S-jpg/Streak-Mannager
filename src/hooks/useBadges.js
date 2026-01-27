import { useState, useEffect, useCallback } from 'react';
import { badgeService } from '../services/badgeService';

export const useBadges = (userId, streaks) => {
  const [badges, setBadges] = useState([]);
  const [newBadges, setNewBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check and award badges when streaks change
  useEffect(() => {
    if (!userId || !streaks || streaks.length === 0) {
      setLoading(false);
      return;
    }

    const checkBadges = async () => {
      try {
        setError(null);
        const awarded = await badgeService.checkAndAwardBadges(userId, streaks);
        if (awarded.length > 0) {
          setNewBadges(awarded);
          // Clear new badges after 5 seconds
          setTimeout(() => setNewBadges([]), 5000);
        }

        const earnedBadges = await badgeService.getEarnedBadges(userId);
        setBadges(earnedBadges);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    checkBadges();
  }, [userId, streaks]);

  const getEarnedBadgesCount = useCallback(() => {
    return badges.length;
  }, [badges]);

  const hasBadge = useCallback((badgeId) => {
    return badges.some(b => (b.badge_id || b.id) === badgeId);
  }, [badges]);

  return {
    badges,
    newBadges,
    loading,
    error,
    getEarnedBadgesCount,
    hasBadge,
  };
};
