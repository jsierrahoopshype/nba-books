'use client';

import { useState, useMemo } from 'react';
import { Book, FilterState, SortOption } from '@/lib/types';
import { searchBooks, sortBooks } from '@/lib/search';
import { getAllBooks, getFilterOptions } from '@/lib/books';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { FilterPanel } from '@/components/FilterPanel';
import { FilterDrawer } from '@/components/FilterDrawer';
import { SortDropdown } from '@/components/SortDropdown';
import { BookGrid } from '@/components/BookGrid';
import { AffiliateDisclosure } from '@/components/AffiliateDisclosure';

const allBooks = getAllBooks();
const filterOptions = getFilterOptions(allBooks);

const initialFilters: FilterState = {
  search: '',
  categories: [],
  topics: [],
  players: [],
  teams: [],
  formats: [],
  minRating: null,
  yearRange: [null, null],
};

export default function HomePage() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sortOption, setSortOption] = useState<SortOption>('relevance');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const results = useMemo(() => {
    let filtered = searchBooks(allBooks, filters);
    return sortBooks(filtered, sortOption, filters.search);
  }, [filters, sortOption]);

  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleTagClick = (type: string, value: string) => {
    if (type === 'category') {
      setFilters(prev => ({
        ...prev,
        categories: prev.categories.includes(value)
          ? prev.categories.filter(c => c !== value)
          : [...prev.categories, value],
      }));
    } else if (type === 'player') {
      setFilters(prev => ({
        ...prev,
        players: prev.players.includes(value)
          ? prev.players.filter(p => p !== value)
          : [...prev.players, value],
      }));
    } else if (type === 'team') {
      setFilters(prev => ({
        ...prev,
        teams: prev.teams.includes(value)
          ? prev.teams.filter(t => t !== value)
          : [...prev.teams, value],
      }));
    } else if (type === 'topic') {
      setFilters(prev => ({
        ...prev,
        topics: prev.topics.includes(value)
          ? prev.topics.filter(t => t !== value)
          : [...prev.topics, value],
      }));
    }
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const activeFilterCount =
    filters.categories.length +
    filters.topics.length +
    filters.players.length +
    filters.teams.length +
    filters.formats.length +
    (filters.minRating ? 1 : 0) +
    (filters.yearRange[0] || filters.yearRange[1] ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search books, authors, players, teams..."
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="lg:hidden px-4 py-2 border border-gray-300 rounded-lg bg-white flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <SortDropdown value={sortOption} onChange={setSortOption} />
          </div>
        </div>

        <div className="flex gap-6">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterPanel
              filters={filters}
              options={filterOptions}
              onChange={handleFilterChange}
              onClear={clearFilters}
            />
          </aside>

          <div className="flex-1">
            <div className="mb-4 text-sm text-gray-600">
              Showing {results.length} of {allBooks.length} books
            </div>

            <BookGrid books={results} onTagClick={handleTagClick} />
          </div>
        </div>

        <div className="mt-8">
          <AffiliateDisclosure />
        </div>
      </main>

      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        options={filterOptions}
        onChange={handleFilterChange}
        onClear={clearFilters}
      />
    </div>
  );
}