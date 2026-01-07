'use client';

import { FilterState, FilterOptions } from '@/lib/types';

interface FilterPanelProps {
  filters: FilterState;
  options: FilterOptions;
  onChange: (filters: Partial<FilterState>) => void;
  onClear: () => void;
}

export function FilterPanel({ filters, options, onChange, onClear }: FilterPanelProps) {
  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.topics.length > 0 ||
    filters.players.length > 0 ||
    filters.teams.length > 0 ||
    filters.formats.length > 0 ||
    filters.minRating !== null ||
    filters.yearRange[0] !== null ||
    filters.yearRange[1] !== null;

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <FilterSection
        title="Category"
        items={options.categories.slice(0, 15)}
        selected={filters.categories}
        onChange={(categories) => onChange({ categories })}
      />

      {/* Topics */}
      <FilterSection
        title="Topics"
        items={options.topics}
        selected={filters.topics}
        onChange={(topics) => onChange({ topics })}
      />

      {/* Players */}
      <FilterSection
        title="Players"
        items={options.players.slice(0, 20)}
        selected={filters.players}
        onChange={(players) => onChange({ players })}
      />

      {/* Teams */}
      <FilterSection
        title="Teams"
        items={options.teams.slice(0, 15)}
        selected={filters.teams}
        onChange={(teams) => onChange({ teams })}
      />

      {/* Formats */}
      <FilterSection
        title="Format"
        items={options.formats}
        selected={filters.formats}
        onChange={(formats) => onChange({ formats })}
      />

      {/* Rating */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Minimum Rating</h3>
        <select
          value={filters.minRating ?? ''}
          onChange={(e) => onChange({ minRating: e.target.value ? Number(e.target.value) : null })}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
        >
          <option value="">Any rating</option>
          <option value="4.5">4.5+ stars</option>
          <option value="4">4+ stars</option>
          <option value="3.5">3.5+ stars</option>
          <option value="3">3+ stars</option>
        </select>
      </div>
    </div>
  );
}

interface FilterSectionProps {
  title: string;
  items: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

function FilterSection({ title, items, selected, onChange }: FilterSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const displayItems = expanded ? items : items.slice(0, 5);
  const hasMore = items.length > 5;

  const toggleItem = (item: string) => {
    if (selected.includes(item)) {
      onChange(selected.filter(i => i !== item));
    } else {
      onChange([...selected, item]);
    }
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
      <div className="space-y-1">
        {displayItems.map((item) => (
          <label key={item} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => toggleItem(item)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600 truncate">{item}</span>
          </label>
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-blue-600 hover:text-blue-800 mt-2"
        >
          {expanded ? 'Show less' : `Show ${items.length - 5} more`}
        </button>
      )}
    </div>
  );
}

import { useState } from 'react';