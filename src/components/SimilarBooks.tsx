'use client';

import Link from 'next/link';
import type { Book } from '@/lib/types';
import { RatingStars } from './RatingStars';
import { TagBadge } from './TagBadge';
import { AffiliateButtonCompact } from './AffiliateButton';

interface SimilarBooksProps {
  books: Book[];
  title?: string;
}

export function SimilarBooks({ books, title = 'Similar Books You May Like' }: SimilarBooksProps) {
  if (books.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <SimilarBookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}

function SimilarBookCard({ book }: { book: Book }) {
  return (
    <article className="bg-gray-50 rounded-lg p-4 flex flex-col hover:bg-gray-100 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <TagBadge label={book.category} variant="category" size="sm" />
        {book.publicationYear && (
          <span className="text-xs text-gray-500">{book.publicationYear}</span>
        )}
      </div>

      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
        <Link
          href={`/books/${book.slug}`}
          className="hover:text-primary-600 transition-colors"
        >
          {book.title}
        </Link>
      </h3>

      <p className="text-sm text-gray-600 mb-2">by {book.author}</p>

      <div className="flex items-center gap-2 mb-3">
        <RatingStars rating={book.rating} size="sm" />
      </div>

      <div className="flex items-center gap-2 mt-auto">
        <AffiliateButtonCompact
          amazonUrl={book.amazonUrl}
          bookId={book.id}
          bookSlug={book.slug}
          bookTitle={book.title}
        />
        <Link
          href={`/books/${book.slug}`}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View →
        </Link>
      </div>
    </article>
  );
}
