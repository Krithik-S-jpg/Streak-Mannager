import React from 'react';
import { motion } from 'framer-motion';
import { getCalendarData } from '../utils/streakUtils';

export const CalendarHeatmap = ({ streak }) => {
  const calendarData = getCalendarData(streak);
  const weeks = [];

  for (let i = 0; i < calendarData.length; i += 7) {
    weeks.push(calendarData.slice(i, i + 7));
  }

  const getIntensityColor = (day) => {
    if (!day) return 'bg-slate-900';
    if (day.intensity === 1) return 'bg-sky-500';
    return 'bg-slate-800';
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-lg font-bold text-slate-100 mb-4">Activity Heatmap</h3>
      <div className="inline-flex flex-col gap-2">
        {/* Day labels */}
        <div className="flex gap-1">
          <div className="w-8" />
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="w-8 h-8 flex items-center justify-center text-xs text-slate-400">
              {day[0]}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex gap-1">
            {weekIndex === 0 && <div className="w-8" />}
            {week.map((day, dayIndex) => (
              <motion.div
                key={dayIndex}
                whileHover={{ scale: 1.1 }}
                title={day ? day.date.toDateString() : ''}
                className={`w-8 h-8 rounded cursor-pointer transition-all ${getIntensityColor(
                  day
                )}`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 0.25, 0.5, 0.75, 1].map((intensity, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded ${
                intensity === 0
                  ? 'bg-slate-800'
                  : intensity === 1
                  ? 'bg-sky-500'
                  : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
};
