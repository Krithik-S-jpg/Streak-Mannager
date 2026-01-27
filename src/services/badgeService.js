import { supabase } from '../supabase';

const DEMO_MODE = false;

// Define all available badges
export const BADGE_DEFINITIONS = {
  // Streak milestones
  FIRST_STREAK: {
    id: 'first_streak',
    name: '🎯 First Steps',
    description: 'Create your first streak',
    icon: '🎯',
    condition: (streak) => true, // Earned on creation
    rarity: 'common',
  },
  WEEK_WARRIOR: {
    id: 'week_warrior',
    name: '🔥 Week Warrior',
    description: 'Reach a 7-day streak',
    icon: '🔥',
    condition: (streak) => (streak.currentCount || 0) >= 7,
    rarity: 'common',
  },
  MONTH_MASTER: {
    id: 'month_master',
    name: '👑 Month Master',
    description: 'Reach a 30-day streak',
    icon: '👑',
    condition: (streak) => (streak.currentCount || 0) >= 30,
    rarity: 'rare',
  },
  CENTURY_CLUB: {
    id: 'century_club',
    name: '💯 Century Club',
    description: 'Reach a 100-day streak',
    icon: '💯',
    condition: (streak) => (streak.currentCount || 0) >= 100,
    rarity: 'epic',
  },
  YEAR_ROUND: {
    id: 'year_round',
    name: '🌟 Year Round',
    description: 'Reach a 365-day streak',
    icon: '🌟',
    condition: (streak) => (streak.currentCount || 0) >= 365,
    rarity: 'legendary',
  },

  // Best streak achievements
  PERSONAL_BEST: {
    id: 'personal_best',
    name: '⭐ Personal Best',
    description: 'Set a personal best streak',
    icon: '⭐',
    condition: (streak) => (streak.bestCount || 0) >= 10,
    rarity: 'common',
  },
  ULTIMATE_STREAK: {
    id: 'ultimate_streak',
    name: '🏆 Ultimate Streak',
    description: 'Achieve a 200+ day streak',
    icon: '🏆',
    condition: (streak) => (streak.bestCount || 0) >= 200,
    rarity: 'legendary',
  },

  // Consistency achievements
  PERFECT_MONTH: {
    id: 'perfect_month',
    name: '📅 Perfect Month',
    description: 'Check in every day this month',
    icon: '📅',
    condition: (streak, stats) => stats && stats.checkInsThisMonth >= 30,
    rarity: 'rare',
  },
  PERFECT_YEAR: {
    id: 'perfect_year',
    name: '🎆 Perfect Year',
    description: 'Check in every day this year',
    icon: '🎆',
    condition: (streak, stats) => stats && stats.checkInsThisYear >= 365,
    rarity: 'legendary',
  },

  // Multi-streak achievements
  MULTI_TASKER: {
    id: 'multi_tasker',
    name: '🎪 Multi-Tasker',
    description: 'Have 3 active streaks',
    icon: '🎪',
    condition: (streaks) => Array.isArray(streaks) && streaks.filter(s => (s.currentCount || 0) > 0).length >= 3,
    rarity: 'common',
  },
  LEGEND: {
    id: 'legend',
    name: '👤 Legend',
    description: 'Have 10 active streaks',
    icon: '👤',
    condition: (streaks) => Array.isArray(streaks) && streaks.filter(s => (s.currentCount || 0) > 0).length >= 10,
    rarity: 'epic',
  },

  // Recovery achievements
  COMEBACK_KING: {
    id: 'comeback_king',
    name: '💪 Comeback King',
    description: 'Use recovery system',
    icon: '💪',
    condition: (streak) => (streak.recoveries || 0) > 0,
    rarity: 'rare',
  },
  FREEZE_MASTER: {
    id: 'freeze_master',
    name: '❄️ Freeze Master',
    description: 'Use 5 freeze actions',
    icon: '❄️',
    condition: (streak) => (streak.freezesUsed || 0) >= 5,
    rarity: 'rare',
  },
};

// Get earned badges for a user
const getEarnedBadges = async (userId) => {
  try {
    if (DEMO_MODE) {
      const badges = JSON.parse(localStorage.getItem(`badges_${userId}`) || '[]');
      return badges;
    }

    const { data, error } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching badges:', error);
    throw error;
  }
};

// Award a badge to user
const awardBadge = async (userId, badgeId) => {
  try {
    if (DEMO_MODE) {
      const badges = JSON.parse(localStorage.getItem(`badges_${userId}`) || '[]');
      if (!badges.find(b => b.id === badgeId)) {
        badges.push({
          id: badgeId,
          user_id: userId,
          earned_at: new Date().toISOString(),
        });
        localStorage.setItem(`badges_${userId}`, JSON.stringify(badges));
      }
      return;
    }

    // Check if badge already earned
    const { data: existing } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .eq('badge_id', badgeId)
      .single();

    if (existing) return; // Already earned

    const { error } = await supabase
      .from('user_badges')
      .insert([
        {
          user_id: userId,
          badge_id: badgeId,
        },
      ]);

    if (error) throw error;
  } catch (error) {
    console.error('Error awarding badge:', error);
    throw error;
  }
};

// Check and award badges based on streak/user data
const checkAndAwardBadges = async (userId, streaks) => {
  try {
    const earnedBadges = await getEarnedBadges(userId);
    const earnedBadgeIds = new Set(earnedBadges.map(b => b.badge_id || b.id));
    const newBadges = [];

    for (const [key, badge] of Object.entries(BADGE_DEFINITIONS)) {
      if (earnedBadgeIds.has(badge.id)) continue; // Already earned

      // Check condition based on badge type
      let shouldAward = false;

      if (badge.id === 'multi_tasker' || badge.id === 'legend') {
        // Multi-streak badges
        shouldAward = badge.condition(streaks);
      } else if (badge.id === 'perfect_month' || badge.id === 'perfect_year') {
        // Stats-based badges - need to calculate stats
        const { statsService } = await import('./statsService');
        const userStats = streaks.length > 0 ? statsService.getUserStats(streaks) : null;
        shouldAward = badge.condition(null, userStats);
      } else if (streaks && streaks.length > 0) {
        // Single streak badges - check all streaks
        shouldAward = streaks.some(streak => badge.condition(streak));
      }

      if (shouldAward) {
        await awardBadge(userId, badge.id);
        newBadges.push(badge);
      }
    }

    return newBadges;
  } catch (error) {
    console.error('Error checking badges:', error);
    return [];
  }
};

// Get badge by ID
const getBadgeById = (badgeId) => {
  for (const badge of Object.values(BADGE_DEFINITIONS)) {
    if (badge.id === badgeId) return badge;
  }
  return null;
};

// Get all available badges with earned status
const getAllBadgesWithStatus = async (userId) => {
  try {
    const earnedBadges = await getEarnedBadges(userId);
    const earnedBadgeIds = new Set(earnedBadges.map(b => b.badge_id || b.id));

    const allBadges = Object.values(BADGE_DEFINITIONS).map(badge => ({
      ...badge,
      earned: earnedBadgeIds.has(badge.id),
      earnedAt: earnedBadges.find(b => (b.badge_id || b.id) === badge.id)?.earned_at,
    }));

    // Sort: earned first, then by rarity
    const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 };
    return allBadges.sort((a, b) => {
      if (a.earned !== b.earned) return b.earned - a.earned;
      return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
    });
  } catch (error) {
    console.error('Error getting all badges:', error);
    return [];
  }
};

export const badgeService = {
  BADGE_DEFINITIONS,
  getEarnedBadges,
  awardBadge,
  checkAndAwardBadges,
  getBadgeById,
  getAllBadgesWithStatus,
};
