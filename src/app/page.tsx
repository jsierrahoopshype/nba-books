'use client';

import { useState, useMemo, useCallback } from 'react';
import { getAllBooks, getYearRange } from '@/lib/books';
import { searchBooks, filterBooks, sortBooks, calculateFacets, getDefaultFilters, initializeSearchIndex } from '@/lib/search';
import type { FilterState, SortOption } from '@/lib/types';
import { SearchBar } from '@/components/SearchBar';
import { SortDropdown } from '@/components/SortDropdown';
import { FilterPanel } from '@/components/FilterPanel';
import { FilterDrawer, FilterButton } from '@/components/FilterDrawer';
import { BookGrid } from '@/components/BookGrid';
import { InlineDisclosure } from '@/components/AffiliateDisclosure';

export default function HomePage() {
  const allBooks = useMemo(() => getAllBooks(), []);
  const yearRange = useMemo(() => getYearRange(), []);

  // Initialize search index
  useMemo(() => {
    initializeSearchIndex(allBooks);
  }, [allBooks]);

  // State
  const [filters, setFilters] = useState<FilterState>(getDefaultFilters());
  const [sortOption, setSortOption] = useState<SortOption>('reviews-desc');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Calculate results
  const results = useMemo(() => {
    // Search
    const searchResults = searchBooks(allBooks, filters.search);
    
    // Get items for filtering
    const searchedBooks = searchResults.map(r => r.item);
    
    // Filter
    const filteredBooks = filterBooks(searchedBooks, filters);
    
    // Re-attach scores for sorting
    const withScores = filteredBooks.map(book => ({
      item: book,
      score: searchResults.find(r => r.item.id === book.id)?.score ?? 0,
    }));
    
    // Sort
    const sortedBooks = sortBooks(
      withScores,
      filters.search ? sortOption : (sortOption === 'relevance' ? 'reviews-desc' : sortOption)
    );
    
    return sortedBooks;
  }, [allBooks, filters, sortOption]);

  // Calculate facets from all books (not filtered results) for full counts
  const allFacets = useMemo(() => calculateFacets(allBooks), [allBooks]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const handleSearchChange = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search }));
    // Switch to relevance sort when searching
    if (search && sortOption !== 'relevance') {
      setSortOption('relevance');
    }
  }, [sortOption]);

  const handleTagClick = useCallback((tag: string, type: 'player' | 'team' | 'topic') => {
    setFilters(prev => {
      const field = type === 'player' ? 'players' : type === 'team' ? 'teams' : 'topics';
      const current = prev[field];
      if (current.includes(tag)) {
        return prev; // Already selected
      }
      return { ...prev, [field]: [...current, tag] };
    });
  }, []);

  // Count active filters (excluding search)
  const activeFilterCount = 
    filters.categories.length +
    filters.topics.length +
    filters.formats.length +
    filters.players.length +
    filters.teams.length +
    (filters.minRating ? 1 : 0);

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          NBA Books Directory
        </h1>
        <p className="text-gray-600">
          Discover {allBooks.length}+ books about basketball legends, team histories, coaching strategies, and more.
        </p>
        <InlineDisclosure />
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <SearchBar
          value={filters.search}
          onChange={handleSearchChange}
          resultCount={results.length}
        />
      </div>

      {/* Controls bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <FilterButton
            onClick={() => setMobileFiltersOpen(true)}
            activeCount={activeFilterCount}
          />
          <span className="text-sm text-gray-600 hidden sm:inline">
            {results.length} {results.length === 1 ? 'book' : 'books'}
            {activeFilterCount > 0 && ' (filtered)'}
          </span>
        </div>
        <SortDropdown
          value={sortOption}
          onChange={setSortOption}
          hasSearchQuery={!!filters.search}
        />
      </div>

      {/* Main content */}
      <div className="flex gap-8">
        {/* Sidebar filters (desktop) */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <FilterPanel
            filters={filters}
            facets={allFacets}
            onFilterChange={handleFilterChange}
            yearRange={yearRange}
          />
        </div>

        {/* Book grid */}
        <div className="flex-1 min-w-0">
          <BookGrid
            books={results}
            onTagClick={handleTagClick}
          />

          {/* Load more / pagination could go here */}
          {results.length > 0 && (
            <p className="text-center text-sm text-gray-500 mt-8">
              Showing all {results.length} books
            </p>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <FilterDrawer
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filters}
        facets={allFacets}
        onFilterChange={handleFilterChange}
        yearRange={yearRange}
        resultCount={results.length}
      />
    </div>
  );
}
