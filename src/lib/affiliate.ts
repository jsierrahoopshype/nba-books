/**
 * Amazon Affiliate Link Utility
 * 
 * Handles all edge cases for converting Amazon product URLs to affiliate links:
 * - Links with existing query params (append with &)
 * - Links without query params (append with ?)
 * - Links with existing tag= (replace it)
 * - Preserves all other query parameters
 */

const DEFAULT_ASSOC_TAG = process.env.NEXT_PUBLIC_AMAZON_ASSOC_TAG || 'hoopshype-20';

/**
 * Converts an Amazon product URL to an affiliate link.
 * 
 * @param url - The original Amazon URL
 * @param tag - Optional affiliate tag (defaults to env var)
 * @returns The affiliate-tagged URL
 * 
 * @example
 * // Without existing params
 * toAffiliateLink('https://www.amazon.com/dp/B001234567')
 * // => 'https://www.amazon.com/dp/B001234567?tag=hoopshype-20'
 * 
 * @example
 * // With existing params
 * toAffiliateLink('https://www.amazon.com/dp/B001234567?ref=sr_1')
 * // => 'https://www.amazon.com/dp/B001234567?ref=sr_1&tag=hoopshype-20'
 * 
 * @example
 * // With existing tag (replace it)
 * toAffiliateLink('https://www.amazon.com/dp/B001234567?tag=oldtag-20')
 * // => 'https://www.amazon.com/dp/B001234567?tag=hoopshype-20'
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
