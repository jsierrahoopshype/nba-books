'use client';

import { FilterState, FilterOptions } from '@/lib/types';
import { FilterPanel } from './FilterPanel';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  options: FilterOptions;
  onChange: (filters: Partial<FilterState>) => void;
  onClear: () => void;
}

export function FilterDrawer({ isOpen, onClose, filters, options, onChange, onClear }: FilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-80 max-w-full bg-white shadow-xl overflow-y-auto">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-lg">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4">
          <FilterPanel
            filters={filters}
            options={options}
            onChange={onChange}
            onClear={onClear}
          />
        </div>
      </div>
    </div>
  );
}