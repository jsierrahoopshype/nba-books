'use client';

import { Book } from '@/lib/types';
import { BookCard } from './BookCard';

interface BookGridProps {
  books: Book[];
  onTagClick?: (type: string, value: string) => void;
}

export function BookGrid({ books, onTagClick }: BookGridProps) {
  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No books found matching your criteria.</p>
        <p className="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
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