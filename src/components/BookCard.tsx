'use client';

import { Book } from '@/lib/types';
import { RatingStars } from './RatingStars';
import { TagBadge } from './TagBadge';
import { AffiliateButton } from './AffiliateButton';
import Link from 'next/link';
import { useState } from 'react';

interface BookCardProps {
  book: Book;
  onTagClick?: (type: string, value: string) => void;
}

export function BookCard({ book, onTagClick }: BookCardProps) {
  const [imgError, setImgError] = useState(false);
  
  const displayTags = [
    ...book.playersMentioned.slice(0, 2).map(p => ({ type: 'player', value: p })),
    ...book.teamsMentioned.slice(0, 1).map(t => ({ type: 'team', value: t })),
    ...book.topics.slice(0, 2).map(t => ({ type: 'topic', value: t })),
  ].slice(0, 4);

  const placeholderInitials = book.title
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col h-full">
      <div className="flex gap-4">
        {/* Book Cover */}
        <div className="flex-shrink-0">
          {book.coverUrl && !imgError ? (
            <img
              src={book.coverUrl}
              alt={`Cover of ${book.title}`}
              className="w-20 h-28 object-cover rounded shadow-sm"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-20 h-28 bg-gradient-to-br from-blue-900 to-blue-700 rounded shadow-sm flex items-center justify-center">
              <span className="text-white font-bold text-lg">{placeholderInitials}</span>
            </div>
          )}
        </div>
        
        {/* Book Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
              {book.category}
            </span>
            {book.year && (
              <span className="text-xs text-gray-500">{book.year}</span>
            )}
          </div>
          
          <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1 line-clamp-2">
            {book.title}
          </h3>
          
          <p className="text-xs text-gray-600 mb-1">by {book.author}</p>
          
          <div className="flex items-center gap-2 mb-2">
            {book.rating && <RatingStars rating={book.rating} size="sm" />}
            {book.reviewCountDisplay && (
              <span className="text-xs text-gray-500">{book.reviewCountDisplay} reviews</span>
            )}
          </div>
        </div>
      </div>
      
      {book.description && (
        <p className="text-xs text-gray-600 mt-2 line-clamp-2">{book.description}</p>
      )}
      
      {displayTags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {displayTags.map(tag => (
            <TagBadge
              key={`${tag.type}-${tag.value}`}
              type={tag.type as any}
              value={tag.value}
              onClick={onTagClick ? () => onTagClick(tag.type, tag.value) : undefined}
            />
          ))}
        </div>
      )}
      
      <div className="flex items-center gap-2 mt-auto pt-3">
        {book.formats.length > 0 && (
          <span className="text-xs text-gray-500">
            Available: {book.formats.slice(0, 2).join(', ')}
          </span>
        )}
      </div>
      
      <div className="flex gap-2 mt-2">
        <AffiliateButton amazonUrl={book.amazonUrl} bookId={book.id} size="sm" />
        <Link
          href={`/books/${book.slug}/`}
          className="flex-1 text-center px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Details
        </Link>
      </div>
    </div>
  );
}