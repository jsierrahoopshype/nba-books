import { describe, it, expect } from 'vitest';
import { toAffiliateLink, extractAsin, isAmazonProductLink } from './affiliate';

describe('toAffiliateLink', () => {
  const tag = 'test-tag-20';

  it('adds tag to URL without query params', () => {
    const url = 'https://www.amazon.com/dp/B001234567';
    const result = toAffiliateLink(url, tag);
    expect(result).toBe('https://www.amazon.com/dp/B001234567?tag=test-tag-20');
  });

  it('adds tag to URL with existing query params', () => {
    const url = 'https://www.amazon.com/dp/B001234567?ref=sr_1';
    const result = toAffiliateLink(url, tag);
    expect(result).toContain('ref=sr_1');
    expect(result).toContain('tag=test-tag-20');
  });

  it('replaces existing tag', () => {
    const url = 'https://www.amazon.com/dp/B001234567?tag=oldtag-20';
    const result = toAffiliateLink(url, tag);
    expect(result).toBe('https://www.amazon.com/dp/B001234567?tag=test-tag-20');
    expect(result).not.toContain('oldtag-20');
  });

  it('replaces existing tag and preserves other params', () => {
    const url = 'https://www.amazon.com/dp/B001234567?ref=sr_1&tag=oldtag-20&qid=123';
    const result = toAffiliateLink(url, tag);
    expect(result).toContain('ref=sr_1');
    expect(result).toContain('qid=123');
    expect(result).toContain('tag=test-tag-20');
    expect(result).not.toContain('oldtag-20');
  });

  it('handles complex Amazon URLs with book titles', () => {
    const url = 'https://www.amazon.com/Book-Basketball-NBA-According-Sports/dp/0345520106';
    const result = toAffiliateLink(url, tag);
    expect(result).toContain('tag=test-tag-20');
    expect(result).toContain('/dp/0345520106');
  });

  it('returns non-Amazon URLs unchanged', () => {
    const url = 'https://example.com/product/123';
    const result = toAffiliateLink(url, tag);
    expect(result).toBe(url);
  });

  it('handles null/undefined gracefully', () => {
    expect(toAffiliateLink('', tag)).toBe('');
    expect(toAffiliateLink(null as unknown as string, tag)).toBe(null);
  });

  it('handles tag in middle of params', () => {
    const url = 'https://www.amazon.com/dp/B001234567?foo=1&tag=old-20&bar=2';
    const result = toAffiliateLink(url, tag);
    expect(result).toContain('tag=test-tag-20');
    expect(result).not.toContain('tag=old-20');
    expect(result).toContain('foo=1');
    expect(result).toContain('bar=2');
  });
});

describe('extractAsin', () => {
  it('extracts ASIN from /dp/ URL', () => {
    expect(extractAsin('https://www.amazon.com/dp/B001234567')).toBe('B001234567');
    expect(extractAsin('https://www.amazon.com/Book-Title/dp/0345520106')).toBe('0345520106');
  });

  it('extracts ASIN from /gp/product/ URL', () => {
    expect(extractAsin('https://www.amazon.com/gp/product/B001234567')).toBe('B001234567');
  });

  it('returns null for invalid URLs', () => {
    expect(extractAsin('')).toBe(null);
    expect(extractAsin('https://example.com')).toBe(null);
    expect(extractAsin('https://amazon.com/search?q=books')).toBe(null);
  });

  it('handles URLs with query params', () => {
    expect(extractAsin('https://www.amazon.com/dp/B001234567?ref=123')).toBe('B001234567');
  });
});

describe('isAmazonProductLink', () => {
  it('returns true for valid Amazon product links', () => {
    expect(isAmazonProductLink('https://www.amazon.com/dp/B001234567')).toBe(true);
    expect(isAmazonProductLink('https://amazon.com/gp/product/0345520106')).toBe(true);
  });

  it('returns false for non-product Amazon links', () => {
    expect(isAmazonProductLink('https://amazon.com/search?q=nba')).toBe(false);
    expect(isAmazonProductLink('https://amazon.com')).toBe(false);
  });

  it('returns false for non-Amazon links', () => {
    expect(isAmazonProductLink('https://example.com/dp/B001234567')).toBe(false);
    expect(isAmazonProductLink('')).toBe(false);
  });
});
