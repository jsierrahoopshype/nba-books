/**
 * Amazon Affiliate Link Utility
 *
 * Generates reliable Amazon search links for books.
 */

const DEFAULT_ASSOC_TAG = process.env.NEXT_PUBLIC_AMAZON_ASSOC_TAG || 'hoopshype-20';

/**
 * Generates an Amazon search URL for a book.
 * This is more reliable than direct product links which can become outdated.
 *
 * @param title - Book title
 * @param author - Book author
 * @param tag - Optional affiliate tag (defaults to env var)
 * @returns Amazon search URL with affiliate tag
 */
export function generateAmazonSearchUrl(title: string, author: string, tag: string = DEFAULT_ASSOC_TAG): string {
  const searchQuery = `${title} ${author} book`.trim();
  const encodedQuery = encodeURIComponent(searchQuery);
  return `https://www.amazon.com/s?k=${encodedQuery}&tag=${tag}`;
}

/**
 * Converts an Amazon product URL to an affiliate link.
 * Falls back to search URL if the product URL seems invalid.
 */
export function toAffiliateLink(url: string, tag: string = DEFAULT_ASSOC_TAG): string {
  if (!url || typeof url !== 'string') {
    return url;
  }

  // Handle non-Amazon URLs gracefully
  if (!url.includes('amazon.com')) {
    return url;
  }

  try {
    const urlObj = new URL(url);

    // Remove existing tag if present
    urlObj.searchParams.delete('tag');

    // Add our affiliate tag
    urlObj.searchParams.set('tag', tag);

    return urlObj.toString();
  } catch {
    // Fallback for malformed URLs: simple string manipulation
    const cleanUrl = url.replace(/[?&]tag=[^&]+/g, '');
    const separator = cleanUrl.includes('?') ? '&' : '?';
    return `${cleanUrl}${separator}tag=${tag}`;
  }
}

/**
 * Extract ASIN from Amazon URL
 * ASIN is the 10-character product identifier (e.g., B001234567 or 0345520106)
 */
export function extractAsin(url: string): string | null {
  if (!url) return null;

  // Match various Amazon URL patterns
  // /dp/ASIN, /gp/product/ASIN, /exec/obidos/ASIN, /product/ASIN
  const patterns = [
    /\/dp\/([A-Z0-9]{10})/i,
    /\/gp\/product\/([A-Z0-9]{10})/i,
    /\/exec\/obidos\/ASIN\/([A-Z0-9]{10})/i,
    /\/product\/([A-Z0-9]{10})/i,
    /\/ASIN\/([A-Z0-9]{10})/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

/**
 * Get the affiliate tag from environment
 */
export function getAffiliateTag(): string {
  return DEFAULT_ASSOC_TAG;
}

/**
 * Check if a URL is an Amazon product link
 */
export function isAmazonProductLink(url: string): boolean {
  if (!url) return false;
  return url.includes('amazon.com') && extractAsin(url) !== null;
}
