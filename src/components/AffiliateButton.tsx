'use client';

import { generateAmazonSearchUrl } from '@/lib/affiliate';
import { trackAffiliateClick } from '@/lib/analytics';

interface AffiliateButtonProps {
  amazonUrl: string;
  bookId: string;
  bookSlug: string;
  bookTitle: string;
  bookAuthor?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AffiliateButton({
  amazonUrl,
  bookId,
  bookSlug,
  bookTitle,
  bookAuthor = '',
  size = 'md',
  className = ''
}: AffiliateButtonProps) {
  // Use search URL - more reliable than product links which can become outdated
  const affiliateUrl = generateAmazonSearchUrl(bookTitle, bookAuthor);
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const handleClick = () => {
    trackAffiliateClick(bookId, bookSlug, bookTitle);
  };

  return (
    <a
      href={affiliateUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded transition-colors ${sizeClasses[size]} ${className}`}
      data-analytics="affiliate_click"
      data-book-id={bookId}
      data-book-slug={bookSlug}
    >
      Buy on Amazon
    </a>
  );
}