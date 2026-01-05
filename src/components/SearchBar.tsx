'use client';

import { useState, useCallback, useEffect } from 'react';
import { trackSearch } from '@/lib/analytics';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount?: number;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  resultCount,
  placeholder = 'Search books, authors, players, teams...',
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  // Debounce the search to avoid excessive updates
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
        if (localValue.length >= 2 && resultCount !== undefined) {
          trackSearch(localValue, resultCount);
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, value, onChange, resultCount]);

  // Sync external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClear = useCallback(() => {
    setLocalValue('');
    onChange('');
  }, [onChange]);

  return (
    <div className="relative">
      {/* Search icon */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Input */}
      <input
        type="search"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="
          block w-full
          pl-10 pr-10 py-3
          text-base
          border border-gray-300 rounded-lg
          bg-white
          placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          transition-shadow
        "
        aria-label="Search books"
      />

      {/* Clear button */}
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          aria-label="Clear search"
        >
          <svg
            className="h-5 w-5 text-gray-400 hover:text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      {/* Result count */}
      {resultCount !== undefined && localValue && (
        <div className="absolute right-10 inset-y-0 flex items-center pointer-events-none">
          <span className="text-sm text-gray-500">
            {resultCount} {resultCount === 1 ? 'result' : 'results'}
          </span>
        </div>
      )}
    </div>
  );
}
