// Predefined habit templates for quick streak creation

export const HABIT_TEMPLATES = {
  // Learning & Skill Development
  leetcode: {
    id: 'leetcode',
    name: 'LeetCode',
    icon: '💻',
    category: 'learning',
    description: 'Solve coding problems daily',
    frequency: 'daily',
    targetCount: 1,
    reminderTime: '09:00',
    tags: ['coding', 'dsa', 'interview-prep'],
    difficulty: 'hard',
    color: 'from-yellow-600 to-yellow-400',
  },
  duolingo: {
    id: 'duolingo',
    name: 'Duolingo',
    icon: '🦉',
    category: 'learning',
    description: 'Learn a new language',
    frequency: 'daily',
    targetCount: 1,
    reminderTime: '10:00',
    tags: ['language', 'education'],
    difficulty: 'medium',
    color: 'from-green-600 to-green-400',
  },
  reading: {
    id: 'reading',
    name: 'Daily Reading',
    icon: '📚',
    category: 'learning',
    description: 'Read for at least 30 minutes',
    frequency: 'daily',
    targetCount: 1,
    reminderTime: '20:00',
    tags: ['education', 'mindfulness'],
    difficulty: 'easy',
    color: 'from-purple-600 to-purple-400',
  },

  // Fitness & Health
  gym: {
    id: 'gym',
    name: 'Gym/Workout',
    icon: '💪',
    category: 'fitness',
    description: 'Exercise for 30+ minutes',
    frequency: 'daily',
    targetCount: 1,
    reminderTime: '06:00',
    tags: ['fitness', 'health', 'exercise'],
    difficulty: 'medium',
    color: 'from-red-600 to-red-400',
  },
  meditation: {
    id: 'meditation',
    name: 'Meditation',
    icon: '🧘',
    category: 'mindfulness',
    description: 'Meditate for 10+ minutes',
    frequency: 'daily',
    targetCount: 1,
    reminderTime: '07:00',
    tags: ['mindfulness', 'mental-health', 'wellness'],
    difficulty: 'easy',
    color: 'from-blue-600 to-blue-400',
  },
  running: {
    id: 'running',
    name: 'Running',
    icon: '🏃',
    category: 'fitness',
    description: 'Run for at least 20 minutes',
    frequency: 'daily',
    targetCount: 1,
    reminderTime: '06:30',
    tags: ['fitness', 'cardio', 'health'],
    difficulty: 'hard',
    color: 'from-orange-600 to-orange-400',
  },
  yoga: {
    id: 'yoga',
    name: 'Yoga',
    icon: '🧘‍♀️',
    category: 'fitness',
    description: 'Practice yoga for 20+ minutes',
    frequency: 'daily',
    targetCount: 1,
    reminderTime: '07:00',
    tags: ['fitness', 'flexibility', 'mindfulness'],
    difficulty: 'medium',
    color: 'from-pink-600 to-pink-400',
  },

  // Productivity & Work
  coding: {
    id: 'coding',
    name: 'Code Daily',
    icon: '👨‍💻',
    category: 'productivity',
    description: 'Write code for at least 1 hour',
    frequency: 'daily',
    targetCount: 1,
    reminderTime: '09:00',
    tags: ['coding', 'productivity', 'dev'],
    difficulty: 'hard',
    color: 'from-cyan-600 to-cyan-400',
  },
  writing: {
    id: 'writing',
    name: 'Writing',
    icon: '✍️',
    category: 'productivity',
    description: 'Write 500+ words',
    frequency: 'daily',
    targetCount: 1,
    reminderTime: '10:00',
    tags: ['writing', 'productivity', 'creativity'],
    difficulty: 'medium',
    color: 'from-indigo-600 to-indigo-400',
  },
  journaling: {
    id: 'journaling',
    name: 'Journaling',
    icon: '📔',
    category: 'productivity',
    description: 'Journal for 10+ minutes',
    frequency: 'daily',
    targetCount: 1,
    reminderTime: '20:00',
    tags: ['writing', 'mindfulness', 'reflection'],
    difficulty: 'easy',
    color: 'from-amber-600 to-amber-400',
  },

  // Social & Hobbies
  drawing: {
    id: 'drawing',
    name: 'Drawing',
    icon: '🎨',
    category: 'hobbies',
    description: 'Draw or sketch something',
    frequency: 'daily',
    targetCount: 1,
    reminderTime: '18:00',
    tags: ['art', 'creativity', 'hobby'],
    difficulty: 'medium',
    color: 'from-rose-600 to-rose-400',
  },
  music: {
    id: 'music',
    name: 'Practice Music',
    icon: '🎸',
    category: 'hobbies',
    description: 'Practice instrument for 30+ mins',
    frequency: 'daily',
    targetCount: 1,
    reminderTime: '19:00',
    tags: ['music', 'hobby', 'skill'],
    difficulty: 'medium',
    color: 'from-violet-600 to-violet-400',
  },

  // Health & Nutrition
  water: {
    id: 'water',
    name: 'Drink Water',
    icon: '💧',
    category: 'health',
    description: 'Drink 8+ glasses of water',
    frequency: 'daily',
    targetCount: 8,
    reminderTime: '08:00',
    tags: ['health', 'nutrition', 'hydration'],
    difficulty: 'easy',
    color: 'from-cyan-500 to-blue-500',
  },
  sleep: {
    id: 'sleep',
    name: 'Get 8 Hours Sleep',
    icon: '😴',
    category: 'health',
    description: 'Sleep for 8+ hours',
    frequency: 'daily',
    targetCount: 1,
    reminderTime: '22:00',
    tags: ['health', 'sleep', 'wellness'],
    difficulty: 'easy',
    color: 'from-indigo-700 to-indigo-400',
  },
  vegetables: {
    id: 'vegetables',
    name: 'Eat Vegetables',
    icon: '🥗',
    category: 'health',
    description: 'Eat vegetables every meal',
    frequency: 'daily',
    targetCount: 3,
    reminderTime: '12:00',
    tags: ['health', 'nutrition', 'diet'],
    difficulty: 'easy',
    color: 'from-green-600 to-green-400',
  },

  // Personal Development
  networking: {
    id: 'networking',
    name: 'Networking',
    icon: '🤝',
    category: 'personal',
    description: 'Connect with someone new',
    frequency: 'daily',
    targetCount: 1,
    reminderTime: '17:00',
    tags: ['networking', 'social', 'growth'],
    difficulty: 'medium',
    color: 'from-teal-600 to-teal-400',
  },
  gratitude: {
    id: 'gratitude',
    name: 'Gratitude',
    icon: '🙏',
    category: 'mindfulness',
    description: 'Write 3 things you\'re grateful for',
    frequency: 'daily',
    targetCount: 1,
    reminderTime: '20:00',
    tags: ['mindfulness', 'mental-health', 'positivity'],
    difficulty: 'easy',
    color: 'from-yellow-600 to-yellow-400',
  },
  snap: {
    id: 'snap',
    name: 'Snap Streak',
    icon: '👻',
    category: 'social',
    description: 'Send a snap to a friend',
    frequency: 'daily',
    targetCount: 1,
    reminderTime: '12:00',
    tags: ['social', 'friends', 'hobby'],
    difficulty: 'easy',
    color: 'from-yellow-500 to-yellow-300',
  },
};

// Get all templates
export const getAllTemplates = () => {
  return Object.values(HABIT_TEMPLATES);
};

// Get templates by category
export const getTemplatesByCategory = (category) => {
  return Object.values(HABIT_TEMPLATES).filter(t => t.category === category);
};

// Get template by ID
export const getTemplateById = (id) => {
  return HABIT_TEMPLATES[id];
};

// Get templates by tags
export const getTemplatesByTag = (tag) => {
  return Object.values(HABIT_TEMPLATES).filter(t => t.tags.includes(tag));
};

// Get categories
export const getCategories = () => {
  const categories = new Set(Object.values(HABIT_TEMPLATES).map(t => t.category));
  return Array.from(categories);
};

// Get all tags
export const getAllTags = () => {
  const tags = new Set();
  Object.values(HABIT_TEMPLATES).forEach(t => {
    t.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags);
};

// Search templates
export const searchTemplates = (query) => {
  const q = query.toLowerCase();
  return Object.values(HABIT_TEMPLATES).filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.tags.some(tag => tag.toLowerCase().includes(q))
  );
};
