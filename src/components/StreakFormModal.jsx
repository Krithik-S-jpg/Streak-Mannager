import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Modal, Button, Input, Select, Badge } from './common';
import { STREAK_CATEGORIES, FREQUENCIES, EMOJI_ICONS } from '../utils/streakUtils';

export const StreakFormModal = ({ isOpen, onClose, onSubmit, streak = null, template = null, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    icon: '🔥',
    category: 'app',
    frequency: 'daily',
    reminderTime: '09:00',
    targetCount: 30,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (streak) {
      // Editing existing streak
      setFormData({
        name: streak.name,
        icon: streak.emoji,
        category: streak.category,
        frequency: streak.frequency,
        reminderTime: streak.reminderTime || '09:00',
        targetCount: streak.targetCount || 30,
      });
    } else if (template) {
      // Creating from template
      setFormData({
        name: template.name,
        icon: template.icon,
        category: template.category,
        frequency: template.frequency,
        reminderTime: template.reminderTime,
        targetCount: template.targetCount,
      });
    } else {
      // Creating new streak
      setFormData({
        name: '',
        icon: '🔥',
        category: 'app',
        frequency: 'daily',
        reminderTime: '09:00',
        targetCount: 30,
      });
    }
    setErrors({});
  }, [streak, template, isOpen]);

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

  const handleIconClick = (icon) => {
    setFormData((prev) => ({
      ...prev,
      icon,
    }));
  };

  const handleSubmit = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Streak name is required';
    }
    if (formData.name.trim().length > 50) {
      newErrors.name = 'Name must be 50 characters or less';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={streak ? 'Edit Streak' : template ? `Use Template: ${template.name}` : 'Create New Streak'}
      actions={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={loading}
          >
            {streak ? 'Update' : 'Create'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Template info badge */}
        {template && (
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center gap-2">
            <span className="text-2xl">{template.icon}</span>
            <div>
              <p className="text-sm font-bold text-blue-300">{template.name} Template</p>
              <p className="text-xs text-blue-300/70">{template.description}</p>
            </div>
          </div>
        )}
        {/* Streak name */}
        <Input
          label="Streak Name"
          name="name"
          placeholder="e.g., Daily LeetCode"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />

        {/* Category */}
        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={Object.values(STREAK_CATEGORIES).map((cat) => ({
            value: cat.value,
            label: cat.label,
          }))}
        />

        {/* Frequency */}
        <Select
          label="Frequency"
          name="frequency"
          value={formData.frequency}
          onChange={handleChange}
          options={Object.values(FREQUENCIES).map((freq) => ({
            value: freq.value,
            label: freq.label,
          }))}
        />

        {/* Icon selector */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">
            Icon
          </label>
          <div className="grid grid-cols-5 gap-2">
            {EMOJI_ICONS.map((icon) => (
              <motion.button
                key={icon}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleIconClick(icon)}
                className={`p-3 text-2xl rounded-lg transition-all ${
                  formData.icon === icon
                    ? 'bg-sky-600 ring-2 ring-sky-400'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                {icon}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Reminder time */}
        <Input
          label="Daily Reminder Time"
          name="reminderTime"
          type="time"
          value={formData.reminderTime}
          onChange={handleChange}
        />

        {/* Target count */}
        <Input
          label="Daily Target Count"
          name="targetCount"
          type="number"
          min="1"
          max="100"
          value={formData.targetCount}
          onChange={handleChange}
          placeholder="Set your daily goal"
        />
      </div>
    </Modal>
  );
};
