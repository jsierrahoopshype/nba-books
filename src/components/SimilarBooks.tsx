'use client';

import { Book } from '@/lib/types';
import { RatingStars } from './RatingStars';
import { AffiliateButton } from './AffiliateButton';
import Link from 'next/link';

interface SimilarBooksProps {
  books: Book[];
}

export function SimilarBooks({ books }: SimilarBooksProps) {
  if (books.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Similar Books</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map(book => (
          <div key={book.id} className="bg-white rounded-lg shadow p-4">
            <Link href={`/books/${book.slug}/`} className="hover:underline">
              <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{book.title}</h3>
            </Link>
            <p className="text-xs text-gray-600 mt-1">by {book.author}</p>
            <div className="flex items-center gap-2 mt-2">
              {book.rating && <RatingStars rating={book.rating} size="sm" />}
            </div>
            <div className="mt-3">
              <AffiliateButton
                amazonUrl={book.amazonUrl}
                bookId={book.id}
                bookSlug={book.slug}
                bookTitle={book.title}
                size="sm"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}