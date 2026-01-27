import React from 'react';
import { Search, SortAsc, Filter } from 'lucide-react';

export const StreakControls = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  filterArchived,
  onFilterChange,
}) => {
  const sortOptions = [
    { value: 'current-desc', label: 'Current Streak (High to Low)' },
    { value: 'current-asc', label: 'Current Streak (Low to High)' },
    { value: 'best-desc', label: 'Best Streak (High to Low)' },
    { value: 'best-asc', label: 'Best Streak (Low to High)' },
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
        <input
          type="text"
          placeholder="Search streaks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Filters and Sort */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Sort */}
        <div className="relative">
          <SortAsc className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Archived */}
        <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5">
          <Filter className="w-5 h-5 text-slate-500" />
          <label className="flex items-center gap-2 cursor-pointer flex-1">
            <input
              type="checkbox"
              checked={!filterArchived}
              onChange={(e) => onFilterChange(!e.target.checked)}
              className="w-4 h-4 rounded bg-slate-700 border-slate-600 cursor-pointer"
            />
            <span className="text-sm text-slate-300">Show archived</span>
          </label>
        </div>
      </div>
    </div>
  );
};
