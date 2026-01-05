'use client';

import Link from 'next/link';
import type { Book } from '@/lib/types';
import { RatingStars } from './RatingStars';
import { TagBadge, TagList } from './TagBadge';
import { AffiliateButtonCompact } from './AffiliateButton';

interface BookCardProps {
  book: Book;
  onTagClick?: (tag: string, type: 'player' | 'team' | 'topic') => void;
}

export function BookCard({ book, onTagClick }: BookCardProps) {
  const formatReviews = (count: number | null, display: string) => {
    if (count === null) return 'No reviews';
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k reviews`;
    return `${display} reviews`;
  };

  // Combine tags for display (limit total)
  const allTags = [
    ...book.playersMentioned.slice(0, 2).map(p => ({ tag: p, type: 'player' as const })),
    ...book.teamsMentioned.slice(0, 2).map(t => ({ tag: t, type: 'team' as const })),
    ...book.topics.slice(0, 2).map(t => ({ tag: t, type: 'topic' as const })),
  ].slice(0, 4);

  return (
    <article className="book-card bg-white rounded-lg border border-gray-200 p-4 flex flex-col h-full">
      {/* Header: Category badge */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <TagBadge label={book.category} variant="category" />
        {book.publicationYear && (
          <span className="text-xs text-gray-500">{book.publicationYear}</span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">
        <Link 
          href={`/books/${book.slug}`}
          className="hover:text-primary-600 transition-colors"
        >
          {book.title}
        </Link>
      </h3>

      {/* Author */}
      <p className="text-sm text-gray-600 mb-2">
        by {book.author}
      </p>

      {/* Rating and reviews */}
      <div className="flex items-center gap-3 mb-3">
        <RatingStars rating={book.rating} size="sm" />
        <span className="text-xs text-gray-500">
          {formatReviews(book.reviewCount, book.reviewCountDisplay)}
        </span>
      </div>

      {/* Description preview */}
      <p className="text-sm text-gray-600 line-clamp-3 mb-3 flex-grow">
        {book.description || 'No description available.'}
      </p>

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {allTags.map(({ tag, type }) => (
            <TagBadge
              key={`${type}-${tag}`}
              label={tag}
              variant={type}
              size="sm"
              onClick={onTagClick ? () => onTagClick(tag, type) : undefined}
            />
          ))}
        </div>
      )}

      {/* Formats */}
      {book.formats.length > 0 && (
        <p className="text-xs text-gray-500 mb-4">
          Available: {book.formats.join(', ')}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100">
        <AffiliateButtonCompact
          amazonUrl={book.amazonUrl}
          bookId={book.id}
          bookSlug={book.slug}
          bookTitle={book.title}
        />
        <Link
          href={`/books/${book.slug}`}
          className="
            px-3 py-1.5
            text-sm font-medium text-gray-700
            border border-gray-300 rounded-md
            hover:bg-gray-50
            transition-colors
          "
        >
          Details
        </Link>
      </div>
    </article>
  );
}
