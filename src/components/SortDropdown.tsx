'use client';

import { SortOption } from '@/lib/types';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Best Match' },
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'reviews-desc', label: 'Most Reviewed' },
  { value: 'newest', label: 'Newest First' },
  { value: 'title-asc', label: 'Title A-Z' },
];

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {sortOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}