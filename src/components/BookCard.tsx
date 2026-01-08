'use client';

import { Book } from '@/lib/types';
import { RatingStars } from './RatingStars';
import { AffiliateButton } from './AffiliateButton';
import Link from 'next/link';
import { useState } from 'react';

interface BookCardProps {
  book: Book;
  onTagClick?: (type: string, value: string) => void;
}

export function BookCard({ book, onTagClick }: BookCardProps) {
  const [imgError, setImgError] = useState(false);
  const detailUrl = `/nba-books/books/${book.slug}`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={detailUrl} className="block">
        <div className="aspect-[2/3] bg-gradient-to-br from-blue-900 to-blue-700 relative">
          {book.coverUrl && !imgError ? (
            <img
              src={book.coverUrl}
              alt={`Cover of ${book.title}`}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-2xl font-bold text-center px-2">
                {book.title.split(' ').slice(0, 3).join(' ')}
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={detailUrl} className="block hover:text-blue-600">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
            {book.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mb-2">{book.author}</p>

        {book.rating && (
          <div className="flex items-center gap-2 mb-2">
            <RatingStars rating={book.rating} size="sm" />
            {book.reviewCountDisplay && (
              <span className="text-xs text-gray-500">({book.reviewCountDisplay})</span>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-1 mb-3">
          {book.category && (
            <button
              onClick={() => onTagClick?.('category', book.category)}
              className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded hover:bg-orange-200"
            >
              {book.category}
            </button>
          )}
          {book.publicationYear && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              {book.publicationYear}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <AffiliateButton
            amazonUrl={book.amazonUrl}
            bookId={book.id}
            bookSlug={book.slug}
            bookTitle={book.title}
            size="sm"
            className="flex-1"
          />
          <Link
            href={detailUrl}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 text-center"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}