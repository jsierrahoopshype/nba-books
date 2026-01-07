import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllBooks, getBookBySlug } from '@/lib/books';
import { findSimilarBooks } from '@/lib/search';
import { RatingStars } from '@/components/RatingStars';
import { TagList } from '@/components/TagBadge';
import { AffiliateButton } from '@/components/AffiliateButton';
import { SimilarBooks } from '@/components/SimilarBooks';
import { AffiliateDisclosure } from '@/components/AffiliateDisclosure';
import { BookCoverImage } from '@/components/BookCoverImage';
import Link from 'next/link';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const books = getAllBooks();
  return books.map((book) => ({
    slug: book.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const book = getBookBySlug(params.slug);
  if (!book) {
    return { title: 'Book Not Found' };
  }
  return {
    title: `${book.title} by ${book.author} | NBA Books Directory`,
    description: book.description || `Read ${book.title} by ${book.author}. ${book.category} basketball book.`,
  };
}

export default function BookDetailPage({ params }: PageProps) {
  const book = getBookBySlug(params.slug);

  if (!book) {
    notFound();
  }

  const similarBooks = findSimilarBooks(book, getAllBooks(), 6);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Books
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="aspect-[2/3] bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg shadow-lg flex items-center justify-center overflow-hidden">
                {book.coverUrl ? (
                  <BookCoverImage
                    src={book.coverUrl}
                    alt={`Cover of ${book.title}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-white text-4xl font-bold">
                    {book.title.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
                  </span>
                )}
              </div>
              
              <div className="mt-6">
                <AffiliateButton
                  amazonUrl={book.amazonUrl}
                  bookId={book.id}
                  bookSlug={book.slug}
                  bookTitle={book.title}
                  size="lg"
                  className="w-full"
                />
              </div>
              
              {book.formats.length > 0 && (
                <div className="mt-4 text-center text-sm text-gray-600">
                  Available: {book.formats.join(', ')}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <div className="flex items-start justify-between gap-4 mb-2">
                <span className="text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded">
                  {book.category}
                </span>
                {book.publicationYear && (
                  <span className="text-gray-500 text-sm">
                    Published {book.publicationYear}
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {book.title}
              </h1>

              <p className="text-lg text-gray-600 mb-4">by {book.author}</p>

              <div className="flex items-center gap-3 mb-6">
                {book.rating && <RatingStars rating={book.rating} size="lg" />}
                {book.reviewCountDisplay && (
                  <span className="text-gray-600">{book.reviewCountDisplay} reviews</span>
                )}
              </div>

              {book.description && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">About This Book</h2>
                  <p className="text-gray-700 leading-relaxed">{book.description}</p>
                </div>
              )}

              <div className="space-y-4">
                {book.playersMentioned.length > 0 && (
                  <div>
                    <h2 className="text-sm font-medium text-gray-500 mb-2">Players Featured</h2>
                    <TagList players={book.playersMentioned} />
                  </div>
                )}

                {book.teamsMentioned.length > 0 && (
                  <div>
                    <h2 className="text-sm font-medium text-gray-500 mb-2">Teams Featured</h2>
                    <TagList teams={book.teamsMentioned} />
                  </div>
                )}

                {book.topics.length > 0 && (
                  <div>
                    <h2 className="text-sm font-medium text-gray-500 mb-2">Topics</h2>
                    <TagList topics={book.topics} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <SimilarBooks books={similarBooks} />

        <div className="mt-8">
          <AffiliateDisclosure />
        </div>
      </main>
    </div>
  );
}