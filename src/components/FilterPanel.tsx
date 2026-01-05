'use client';

import { useState } from 'react';
import type { FilterState, FacetCounts } from '@/lib/types';
import { trackFilterChange } from '@/lib/analytics';

interface FilterPanelProps {
  filters: FilterState;
  facets: FacetCounts;
  onFilterChange: (filters: FilterState) => void;
  yearRange: [number, number];
}

export function FilterPanel({
  filters,
  facets,
  onFilterChange,
  yearRange,
}: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    topics: true,
    rating: true,
    players: false,
    teams: false,
    year: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleMultiSelect = (
    field: 'categories' | 'topics' | 'formats' | 'players' | 'teams',
    value: string
  ) => {
    const current = filters[field];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    
    trackFilterChange(field, updated);
    onFilterChange({ ...filters, [field]: updated });
  };

  const handleRatingChange = (rating: number | null) => {
    trackFilterChange('minRating', rating ?? 'any');
    onFilterChange({ ...filters, minRating: rating });
  };

  const clearAllFilters = () => {
    onFilterChange({
      search: filters.search,
      categories: [],
      topics: [],
      formats: [],
      minRating: null,
      yearRange: [null, null],
      players: [],
      teams: [],
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.topics.length > 0 ||
    filters.formats.length > 0 ||
    filters.minRating !== null ||
    filters.players.length > 0 ||
    filters.teams.length > 0;

  // Sort facets by count for display
  const sortedCategories = Object.entries(facets.categories)
    .sort((a, b) => b[1] - a[1]);
  const sortedTopics = Object.entries(facets.topics)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);
  const sortedPlayers = Object.entries(facets.players)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);
  const sortedTeams = Object.entries(facets.teams)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  return (
    <aside className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category Section */}
      <FilterSection
        title="Category"
        expanded={expandedSections.category}
        onToggle={() => toggleSection('category')}
        count={filters.categories.length}
      >
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {sortedCategories.map(([category, count]) => (
            <label key={category} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => handleMultiSelect('categories', category)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 flex-1 truncate">{category}</span>
              <span className="text-xs text-gray-400">{count}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Topics Section */}
      <FilterSection
        title="Topics"
        expanded={expandedSections.topics}
        onToggle={() => toggleSection('topics')}
        count={filters.topics.length}
      >
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {sortedTopics.map(([topic, count]) => (
            <label key={topic} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.topics.includes(topic)}
                onChange={() => handleMultiSelect('topics', topic)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 flex-1 truncate">{topic}</span>
              <span className="text-xs text-gray-400">{count}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Rating Section */}
      <FilterSection
        title="Minimum Rating"
        expanded={expandedSections.rating}
        onToggle={() => toggleSection('rating')}
        count={filters.minRating ? 1 : 0}
      >
        <div className="space-y-2">
          {[null, 4.5, 4.0, 3.5, 3.0].map((rating) => (
            <label key={rating ?? 'any'} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="minRating"
                checked={filters.minRating === rating}
                onChange={() => handleRatingChange(rating)}
                className="border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">
                {rating === null ? 'Any rating' : `${rating}+ stars`}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Players Section */}
      <FilterSection
        title="Players Mentioned"
        expanded={expandedSections.players}
        onToggle={() => toggleSection('players')}
        count={filters.players.length}
      >
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {sortedPlayers.map(([player, count]) => (
            <label key={player} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.players.includes(player)}
                onChange={() => handleMultiSelect('players', player)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 flex-1 truncate">{player}</span>
              <span className="text-xs text-gray-400">{count}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Teams Section */}
      <FilterSection
        title="Teams Mentioned"
        expanded={expandedSections.teams}
        onToggle={() => toggleSection('teams')}
        count={filters.teams.length}
      >
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {sortedTeams.map(([team, count]) => (
            <label key={team} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.teams.includes(team)}
                onChange={() => handleMultiSelect('teams', team)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 flex-1 truncate">{team}</span>
              <span className="text-xs text-gray-400">{count}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </aside>
  );
}

// Collapsible section component
function FilterSection({
  title,
  expanded,
  onToggle,
  count,
  children,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-gray-100 pt-4 mt-4 first:border-0 first:pt-0 first:mt-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="font-medium text-gray-900">
          {title}
          {count > 0 && (
            <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && <div className="mt-3">{children}</div>}
    </div>
  );
}
