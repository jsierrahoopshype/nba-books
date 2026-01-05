'use client';

import { useState, useRef, useEffect } from 'react';
import type { SortOption } from '@/lib/types';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  hasSearchQuery: boolean;
}

const sortOptions: Array<{ value: SortOption; label: string; requiresSearch?: boolean }> = [
  { value: 'relevance', label: 'Best Match', requiresSearch: true },
  { value: 'reviews-desc', label: 'Most Reviewed' },
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
  { value: 'title-asc', label: 'Title (A-Z)' },
];

export function SortDropdown({ value, onChange, hasSearchQuery }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const currentOption = sortOptions.find((opt) => opt.value === value);
  const availableOptions = sortOptions.filter(
    (opt) => !opt.requiresSearch || hasSearchQuery
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-2
          px-4 py-2
          bg-white border border-gray-300 rounded-lg
          text-sm font-medium text-gray-700
          hover:bg-gray-50
          focus:outline-none focus:ring-2 focus:ring-primary-500
        "
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-gray-500">Sort:</span>
        <span>{currentOption?.label || 'Most Reviewed'}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="
            absolute right-0 mt-2 w-48
            bg-white rounded-lg shadow-lg border border-gray-200
            py-1 z-50
          "
          role="listbox"
        >
          {availableOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`
                w-full text-left px-4 py-2 text-sm
                ${value === option.value
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
              role="option"
              aria-selected={value === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
