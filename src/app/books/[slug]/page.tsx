import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllBooks, getAllSlugs, getBookBySlug } from '@/lib/books';
import { findSimilarBooks } from '@/lib/search';
import { RatingStars } from '@/components/RatingStars';
import { TagList } from '@/components/TagBadge';
import { AffiliateButton } from '@/components/AffiliateButton';
import { SimilarBooks } from '@/components/SimilarBooks';
import { AffiliateDisclosure } from '@/components/AffiliateDisclosure';

interface BookPageProps {
  params: { slug: string };
}

// Generate static paths for all books
export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const book = getBookBySlug(params.slug);
  
  if (!book) {
    return {
      title: 'Book Not Found | NBA Books',
    };
  }

  return {
    title: `${book.title} by ${book.author} | NBA Books`,
    description: book.description || `Read ${book.title} by ${book.author}. ${book.category} book about NBA basketball.`,
    keywords: [
      book.title,
      book.author,
      book.category,
      ...book.topics,
      ...book.playersMentioned,
      ...book.teamsMentioned,
      'NBA book',
      'basketball book',
    ].join(', '),
    openGraph: {
      title: `${book.title} by ${book.author}`,
      description: book.description || `${book.category} book about NBA basketball.`,
      type: 'book',
    },
  };
}

export default function BookPage({ params }: BookPageProps) {
  const book = getBookBySlug(params.slug);

  if (!book) {
    notFound();
  }

  const allBooks = getAllBooks();
  const similarBooks = findSimilarBooks(book, allBooks, 6);

  const formatReviews = (count: number | null, display: string) => {
    if (count === null) return 'No reviews yet';
    return `${display} reviews`;
  };

  return (
    <article>
      {/* Breadcrumb */}
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-primary-600">
              All Books
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link 
              href={`/?categories=${encodeURIComponent(book.category)}`}
              className="hover:text-primary-600"
            >
              {book.category}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-gray-900 font-medium truncate max-w-xs">
            {book.title}
          </li>
        </ol>
      </nav>

      {/* Main content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
        <div className="lg:flex lg:gap-8">
          {/* Left column: Book info */}
          <div className="flex-1">
            {/* Category and year */}
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                {book.category}
              </span>
              {book.publicationYear && (
                <span className="text-gray-500 text-sm">
                  Published {book.publicationYear}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {book.title}
            </h1>

            {/* Author */}
            <p className="text-xl text-gray-600 mb-4">
              by <span className="font-medium">{book.author}</span>
            </p>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <RatingStars rating={book.rating} size="lg" />
              <span className="text-gray-500">
                {formatReviews(book.reviewCount, book.reviewCountDisplay)}
              </span>
            </div>

            {/* Formats */}
            {book.formats.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-medium text-gray-500 mb-2">Available Formats</h2>
                <div className="flex flex-wrap gap-2">
                  {book.formats.map((format) => (
                    <span
                      key={format}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {format}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">About This Book</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {book.description || 'No description available for this book.'}
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-4">
              {book.playersMentioned.length > 0 && (
                <div>
                  <h2 className="text-sm font-medium text-gray-500 mb-2">Players Featured</h2>
                  <TagList tags={book.playersMentioned} variant="player" />
                </div>
              )}

              {book.teamsMentioned.length > 0 && (
                <div>
                  <h2 className="text-sm font-medium text-gray-500 mb-2">Teams Featured</h2>
                  <TagList tags={book.teamsMentioned} variant="team" />
                </div>
              )}

              {book.topics.length > 0 && (
                <div>
                  <h2 className="text-sm font-medium text-gray-500 mb-2">Topics</h2>
                  <TagList tags={book.topics} variant="topic" />
                </div>
              )}
            </div>
          </div>

          {/* Right column: CTA */}
          <div className="lg:w-80 mt-8 lg:mt-0">
            <div className="sticky top-24 bg-gray-50 rounded-lg p-6">
              <div className="mb-4">
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  Get This Book
                </p>
                <p className="text-sm text-gray-500">
                  Available on Amazon
                </p>
              </div>

              <AffiliateButton
                amazonUrl={book.amazonUrl}
                bookId={book.id}
                bookSlug={book.slug}
                bookTitle={book.title}
                size="lg"
                fullWidth
              />

              <p className="text-xs text-gray-500 mt-4 text-center">
                * As an Amazon Associate, we earn from qualifying purchases.
              </p>

              {/* Quick info */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                {book.rating && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Rating</span>
                    <span className="font-medium">{book.rating.toFixed(1)} / 5</span>
                  </div>
                )}
                {book.reviewCount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Reviews</span>
                    <span className="font-medium">{book.reviewCountDisplay}</span>
                  </div>
                )}
                {book.publicationDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Published</span>
                    <span className="font-medium">{book.publicationDate}</span>
                  </div>
                )}
                {book.formats.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Formats</span>
                    <span className="font-medium">{book.formats.length} available</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar books */}
      <SimilarBooks books={similarBooks} />

      {/* Disclosure */}
      <div className="mt-12">
        <AffiliateDisclosure />
      </div>

      {/* Back link */}
      <div className="mt-8 text-center">
        <Link
          href="/"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          ← Browse All Books
        </Link>
      </div>
    </article>
  );
}
