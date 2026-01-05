'use client';

import type { Book } from '@/lib/types';
import { BookCard } from './BookCard';

interface BookGridProps {
  books: Book[];
  onTagClick?: (tag: string, type: 'player' | 'team' | 'topic') => void;
  loading?: boolean;
}

export function BookGrid({ books, onTagClick, loading = false }: BookGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-16 h-16 mx-auto text-gray-300 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No books found
        </h3>
        <p className="text-gray-500">
          Try adjusting your search or filters to find more results.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onTagClick={onTagClick} />
      ))}
    </div>
  );
}

function BookCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="skeleton h-5 w-20" />
        <div className="skeleton h-4 w-12" />
      </div>
      <div className="skeleton h-6 w-full mb-2" />
      <div className="skeleton h-6 w-3/4 mb-2" />
      <div className="skeleton h-4 w-1/2 mb-3" />
      <div className="flex items-center gap-2 mb-3">
        <div className="skeleton h-4 w-24" />
        <div className="skeleton h-4 w-16" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-2/3" />
      </div>
      <div className="flex gap-1 mb-4">
        <div className="skeleton h-5 w-16 rounded-full" />
        <div className="skeleton h-5 w-20 rounded-full" />
        <div className="skeleton h-5 w-14 rounded-full" />
      </div>
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <div className="skeleton h-8 w-20 rounded-md" />
        <div className="skeleton h-8 w-20 rounded-md" />
      </div>
    </div>
  );
}
