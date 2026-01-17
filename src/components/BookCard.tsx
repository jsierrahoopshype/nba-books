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

// Check if Amazon URL is a valid product page (not a search page)
function isValidProductUrl(url: string): boolean {
  return url.includes('/dp/') || url.includes('/gp/product/');
}

export function BookCard({ book, onTagClick }: BookCardProps) {
  const [imgError, setImgError] = useState(false);
  const detailUrl = `/books/${book.slug}`;
  const hasValidAmazonLink = isValidProductUrl(book.amazonUrl);

  // Use Open Library cover with ISBN if available
  const coverUrl = book.coverUrl?.includes('openlibrary') ? book.coverUrl : null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      <Link href={detailUrl} className="block">
        <div className="aspect-[2/3] bg-gradient-to-br from-blue-900 to-blue-700 relative">
          {coverUrl && !imgError ? (
            <img
              src={coverUrl}
              alt={`Cover of ${book.title}`}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <span className="text-white text-lg font-bold text-center leading-tight">
                {book.title}
              </span>
              <span className="text-blue-200 text-sm mt-2 text-center">
                {book.author}
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 flex-1 flex flex-col">
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

        {/* Description snippet */}
        {book.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-2">
            {book.description}
          </p>
        )}

        <div className="flex flex-wrap gap-1 mb-2">
          {book.category && (
            <button
              onClick={(e) => { e.preventDefault(); onTagClick?.('category', book.category); }}
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

        {/* Players mentioned */}
        {book.playersMentioned.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {book.playersMentioned.slice(0, 2).map((player) => (
              <button
                key={player}
                onClick={(e) => { e.preventDefault(); onTagClick?.('player', player); }}
                className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded hover:bg-blue-200"
              >
                {player}
              </button>
            ))}
            {book.playersMentioned.length > 2 && (
              <span className="text-xs text-gray-400">+{book.playersMentioned.length - 2} more</span>
            )}
          </div>
        )}

        <div className="flex gap-2 mt-auto pt-2">
          {hasValidAmazonLink ? (
            <AffiliateButton
              amazonUrl={book.amazonUrl}
              bookId={book.id}
              bookSlug={book.slug}
              bookTitle={book.title}
              size="sm"
              className="flex-1"
            />
          ) : (
            <a
              href={`https://www.amazon.com/s?k=${encodeURIComponent(book.title + ' ' + book.author)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-1.5 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 text-center"
            >
              Search on Amazon
            </a>
          )}
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