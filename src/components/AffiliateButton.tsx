'use client';

import { toAffiliateLink } from '@/lib/affiliate';
import { trackAffiliateClick, getAffiliateDataAttrs } from '@/lib/analytics';

interface AffiliateButtonProps {
  amazonUrl: string;
  bookId: string;
  bookSlug: string;
  bookTitle: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export function AffiliateButton({
  amazonUrl,
  bookId,
  bookSlug,
  bookTitle,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
}: AffiliateButtonProps) {
  const affiliateUrl = toAffiliateLink(amazonUrl);
  const dataAttrs = getAffiliateDataAttrs(bookId, bookSlug);

  const handleClick = () => {
    trackAffiliateClick(bookId, bookSlug, bookTitle);
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary: `
      bg-primary-600 text-white 
      hover:bg-primary-700 
      focus:ring-primary-500
      shadow-sm hover:shadow
    `,
    secondary: `
      bg-white text-primary-600 
      border-2 border-primary-600
      hover:bg-primary-50
      focus:ring-primary-500
    `,
  };

  return (
    <a
      href={affiliateUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={handleClick}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold rounded-lg
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...dataAttrs}
    >
      <svg 
        className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} 
        viewBox="0 0 24 24" 
        fill="currentColor"
      >
        <path d="M13.958 10.09c1.006-.099 2.019-.19 3.032-.27.694-.054 1.389-.1 2.084-.137.397-.02.794-.036 1.191-.05.143-.005.286-.01.429-.013.07-.002.14-.003.21-.004a.507.507 0 01.344.127c.098.088.148.22.131.35l-.024.174c-.069.502-.138 1.004-.227 1.503a29.96 29.96 0 01-.394 1.898c-.178.726-.387 1.444-.63 2.15a17.8 17.8 0 01-.43 1.18c-.063.152-.131.302-.203.45a.49.49 0 01-.233.234.508.508 0 01-.367.017 9.37 9.37 0 01-.574-.202 15.258 15.258 0 01-1.61-.716 20.312 20.312 0 01-1.89-1.058c-.348-.219-.689-.448-1.02-.69-.096-.07-.19-.142-.282-.216a.495.495 0 01-.177-.314.502.502 0 01.097-.354c.055-.07.127-.126.21-.163.246-.112.493-.222.743-.328.68-.287 1.373-.552 2.076-.795.54-.187 1.084-.361 1.633-.52-.48-.069-.96-.129-1.44-.179a38.91 38.91 0 00-2.195-.173c-.455-.024-.91-.04-1.365-.048-.226-.004-.453-.006-.679-.006a.5.5 0 01-.388-.18.504.504 0 01-.112-.404 10.26 10.26 0 01.154-.676c.104-.385.228-.765.371-1.138z"/>
      </svg>
      Buy on Amazon
    </a>
  );
}

// Compact version for cards
export function AffiliateButtonCompact({
  amazonUrl,
  bookId,
  bookSlug,
  bookTitle,
}: Omit<AffiliateButtonProps, 'variant' | 'size' | 'fullWidth'>) {
  const affiliateUrl = toAffiliateLink(amazonUrl);
  const dataAttrs = getAffiliateDataAttrs(bookId, bookSlug);

  const handleClick = () => {
    trackAffiliateClick(bookId, bookSlug, bookTitle);
  };

  return (
    <a
      href={affiliateUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={handleClick}
      className="
        inline-flex items-center gap-1.5
        px-3 py-1.5
        bg-primary-600 text-white text-sm font-medium
        rounded-md
        hover:bg-primary-700
        transition-colors
      "
      {...dataAttrs}
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
      </svg>
      Buy
    </a>
  );
}
