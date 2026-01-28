import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Tag } from 'lucide-react';
import { Button } from './common';

export const TemplateCard = ({ template, onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden rounded-xl p-6 border border-slate-700/30 bg-gradient-to-br ${template.color}/20 backdrop-blur-sm group cursor-pointer hover:shadow-lg transition-all`}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${template.color}/10`} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-4xl mb-2">{template.icon}</p>
            <h3 className="text-lg font-bold text-white">{template.name}</h3>
          </div>
          <span className="px-2 py-1 bg-slate-800/50 rounded text-xs font-medium text-slate-300 uppercase tracking-wide">
            {template.category}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-300 mb-3">{template.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {template.tags.slice(0, 2).map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-slate-950/50 border border-slate-700/50 rounded text-xs text-slate-400"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
          {template.tags.length > 2 && (
            <span className="inline-flex items-center px-2 py-1 text-xs text-slate-500">
              +{template.tags.length - 2} more
            </span>
          )}
        </div>

        {/* Details */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="bg-slate-950/50 rounded-lg p-2">
            <p className="text-xs text-slate-500">Frequency</p>
            <p className="text-sm font-bold text-white capitalize">{template.frequency}</p>
          </div>
          <div className="bg-slate-950/50 rounded-lg p-2">
            <p className="text-xs text-slate-500">Target</p>
            <p className="text-sm font-bold text-white">{template.targetCount}x</p>
          </div>
          <div className="bg-slate-950/50 rounded-lg p-2">
            <p className="text-xs text-slate-500">Reminder</p>
            <p className="text-sm font-bold text-white">{template.reminderTime}</p>
          </div>
        </div>

        {/* Difficulty badge */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
              template.difficulty === 'easy'
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : template.difficulty === 'medium'
                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}
          >
            {template.difficulty}
          </span>
        </div>

        {/* Action button */}
        <Button
          onClick={() => onSelect(template)}
          variant="primary"
          size="sm"
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-1" />
          Use Template
        </Button>
      </div>
    </motion.div>
  );
};
