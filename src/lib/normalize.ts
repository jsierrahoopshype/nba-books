/**
 * Data Normalization Utilities
 * 
 * Handles parsing and cleaning of raw CSV data into normalized Book objects.
 */

import { createHash } from 'crypto';
import { extractAsin } from './affiliate';

/**
 * Parse publication date string to extract year.
 * Handles various formats:
 * - "October 27 2009"
 * - "2009"
 * - "Oct 2009"
 * - "10/27/2009"
 */
export function parsePublicationYear(dateStr: string | null | undefined): number | null {
  if (!dateStr || dateStr === 'N/A' || dateStr === 'nan' || dateStr === 'NaN') {
    return null;
  }

  const str = dateStr.trim();

  // Try to find a 4-digit year
  const yearMatch = str.match(/\b(19|20)\d{2}\b/);
  if (yearMatch) {
    const year = parseInt(yearMatch[0], 10);
    // Sanity check: year should be between 1900 and current year + 1
    const currentYear = new Date().getFullYear();
    if (year >= 1900 && year <= currentYear + 1) {
      return year;
    }
  }

  return null;
}

/**
 * Parse review count string to numeric value.
 * "3500+" => 3500
 * "1.2k" => 1200
 * "N/A" => null
 */
export function parseReviewCount(reviewStr: string | null | undefined): number | null {
  if (!reviewStr || reviewStr === 'N/A' || reviewStr === 'nan' || reviewStr === 'NaN') {
    return null;
  }

  const str = reviewStr.toString().trim().toLowerCase();

  // Handle "k" suffix (1.2k => 1200)
  if (str.includes('k')) {
    const num = parseFloat(str.replace('k', '').replace('+', '').trim());
    return isNaN(num) ? null : Math.round(num * 1000);
  }

  // Remove '+' and any non-numeric except decimal
  const cleaned = str.replace(/[+,]/g, '').trim();
  const num = parseFloat(cleaned);
  
  return isNaN(num) ? null : Math.round(num);
}

/**
 * Parse rating string to number.
 * "4.6" => 4.6
 * "N/A" => null
 */
export function parseRating(ratingStr: string | number | null | undefined): number | null {
  if (ratingStr === null || ratingStr === undefined) return null;
  if (typeof ratingStr === 'number') {
    return ratingStr >= 0 && ratingStr <= 5 ? ratingStr : null;
  }
  
  const str = ratingStr.toString().trim();
  if (str === 'N/A' || str === 'nan' || str === 'NaN' || str === '') {
    return null;
  }

  const num = parseFloat(str);
  return isNaN(num) || num < 0 || num > 5 ? null : num;
}

/**
 * Split semicolon-separated list into array.
 * Trims whitespace, removes empty strings, dedupes.
 */
export function splitList(listStr: string | null | undefined): string[] {
  if (!listStr || listStr === 'N/A' || listStr === 'nan' || listStr === 'NaN') {
    return [];
  }

  const items = listStr
    .split(/[;,]/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && s !== 'N/A' && s.toLowerCase() !== 'nan');

  // Dedupe while preserving order
  return Array.from(new Set(items));
}

/**
 * Split format string into array of formats.
 * "Paperback/Hardcover/Kindle" => ["Paperback", "Hardcover", "Kindle"]
 */
export function parseFormats(formatStr: string | null | undefined): string[] {
  if (!formatStr || formatStr === 'N/A' || formatStr === 'nan') {
    return [];
  }

  return formatStr
    .split('/')
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

/**
 * Generate stable unique ID from title, author, and ASIN.
 */
export function generateBookId(title: string, author: string, asin: string | null): string {
  const input = `${title.toLowerCase().trim()}|${author.toLowerCase().trim()}|${asin || ''}`;
  return createHash('sha256').update(input).digest('hex').substring(0, 12);
}

/**
 * Generate URL-safe slug from title and author.
 * Includes truncated ID suffix for collision safety.
 */
export function generateSlug(title: string, author: string, id: string): string {
  const clean = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50)
      .replace(/-$/, '');

  const titleSlug = clean(title);
  const authorSlug = clean(author).substring(0, 20);
  const idSuffix = id.substring(0, 6);

  return `${titleSlug}-${authorSlug}-${idSuffix}`;
}

/**
 * Normalize whitespace in description text.
 */
export function normalizeDescription(desc: string | null | undefined): string {
  if (!desc || desc === 'N/A' || desc === 'nan') {
    return '';
  }

  return desc
    .replace(/\s+/g, ' ')
    .replace(/\.{3,}/g, '…')
    .trim();
}

/**
 * Clean and normalize a single string field.
 */
export function cleanString(str: string | null | undefined): string {
  if (!str || str === 'N/A' || str === 'nan' || str === 'NaN') {
    return '';
  }
  return str.toString().trim();
}

/**
 * Raw CSV row type (before normalization)
 */
export interface RawBookRow {
  Title: string;
  Author: string;
  Rating: string | number;
  'Number of Reviews': string;
  'Publication Date': string;
  Format: string;
  'Amazon Link': string;
  Category: string;
  Description: string;
  'Players Mentioned': string;
  'Teams Mentioned': string;
  Topics: string;
}
