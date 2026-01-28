import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { TemplateCard } from './TemplateCard';
import { getAllTemplates, getTemplatesByCategory, getAllTags } from '../services/habitTemplates';

export const HabitTemplatesLibrary = ({ onSelectTemplate, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState(null);

  const allTemplates = getAllTemplates();
  const categories = ['all', ...getTemplatesByCategory('learning').length > 0 ? ['learning'] : [], 'fitness', 'productivity', 'health', 'mindfulness', 'hobbies', 'social', 'personal'];
  const allTags = getAllTags();

  const filteredTemplates = useMemo(() => {
    return allTemplates.filter(template => {
      // Search filter
      const matchesSearch =
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;

      // Tag filter
      const matchesTag = !selectedTag || template.tags.includes(selectedTag);

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [searchQuery, selectedCategory, selectedTag, allTemplates]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-950/95 border border-slate-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="border-b border-slate-800 p-6 sticky top-0 bg-slate-950/95 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Habit Templates</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search templates by name, description, or tags..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-slate-600 transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Category filter */}
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Filter className="w-4 h-4" />
              <span>Category:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium capitalize transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Tag filter - if tag selected */}
            {selectedTag && (
              <div className="ml-auto">
                <button
                  onClick={() => setSelectedTag(null)}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all flex items-center gap-2"
                >
                  Tag: {selectedTag}
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Results count */}
          <p className="text-xs text-slate-500 mt-3">
            Showing {filteredTemplates.length} of {allTemplates.length} templates
          </p>
        </div>

        {/* Templates grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {filteredTemplates.length > 0 ? (
              <motion.div
                key="templates"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {filteredTemplates.map((template, idx) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onSelect={(t) => {
                      onSelectTemplate(t);
                      onClose();
                    }}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-64 text-center"
              >
                <p className="text-slate-400 text-lg">No templates found</p>
                <p className="text-slate-500 text-sm mt-2">Try adjusting your search or filters</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 p-4 bg-slate-950/50 text-center text-sm text-slate-500">
          💡 Tip: Click "Use Template" to quickly create a new streak with pre-configured settings
        </div>
      </motion.div>
    </div>
  );
};
