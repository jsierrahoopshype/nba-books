#!/usr/bin/env tsx
/**
 * CSV Ingestion Script
 * 
 * Converts the source CSV to normalized JSON for the application.
 * Run with: npm run ingest
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { createHash } from 'crypto';
import path from 'path';

// Import normalization utilities (inline for script)
function parsePublicationYear(dateStr: string | null | undefined): number | null {
  if (!dateStr || dateStr === 'N/A' || dateStr === 'nan' || dateStr === 'NaN') {
    return null;
  }
  const str = dateStr.trim();
  const yearMatch = str.match(/\b(19|20)\d{2}\b/);
  if (yearMatch) {
    const year = parseInt(yearMatch[0], 10);
    const currentYear = new Date().getFullYear();
    if (year >= 1900 && year <= currentYear + 1) {
      return year;
    }
  }
  return null;
}

function parseReviewCount(reviewStr: string | null | undefined): number | null {
  if (!reviewStr || reviewStr === 'N/A' || reviewStr === 'nan' || reviewStr === 'NaN') {
    return null;
  }
  const str = reviewStr.toString().trim().toLowerCase();
  if (str.includes('k')) {
    const num = parseFloat(str.replace('k', '').replace('+', '').trim());
    return isNaN(num) ? null : Math.round(num * 1000);
  }
  const cleaned = str.replace(/[+,]/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : Math.round(num);
}

function parseRating(ratingStr: string | number | null | undefined): number | null {
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

function splitList(listStr: string | null | undefined): string[] {
  if (!listStr || listStr === 'N/A' || listStr === 'nan' || listStr === 'NaN') {
    return [];
  }
  const items = listStr
    .split(/[;,]/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && s !== 'N/A' && s.toLowerCase() !== 'nan');
  return Array.from(new Set(items));
}

function parseFormats(formatStr: string | null | undefined): string[] {
  if (!formatStr || formatStr === 'N/A' || formatStr === 'nan') {
    return [];
  }
  return formatStr.split('/').map(s => s.trim()).filter(s => s.length > 0);
}

function extractAsin(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /\/dp\/([A-Z0-9]{10})/i,
    /\/gp\/product\/([A-Z0-9]{10})/i,
    /\/exec\/obidos\/ASIN\/([A-Z0-9]{10})/i,
    /\/product\/([A-Z0-9]{10})/i,
    /\/ASIN\/([A-Z0-9]{10})/i,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function generateBookId(title: string, author: string, asin: string | null): string {
  const input = `${title.toLowerCase().trim()}|${author.toLowerCase().trim()}|${asin || ''}`;
  return createHash('sha256').update(input).digest('hex').substring(0, 12);
}

function generateSlug(title: string, author: string, id: string): string {
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

function normalizeDescription(desc: string | null | undefined): string {
  if (!desc || desc === 'N/A' || desc === 'nan') return '';
  return desc.replace(/\s+/g, ' ').replace(/\.{3,}/g, '…').trim();
}

function cleanString(str: string | null | undefined): string {
  if (!str || str === 'N/A' || str === 'nan' || str === 'NaN') return '';
  return str.toString().trim();
}

// Cover URL generation
function extractISBN(amazonUrl: string): string | null {
  // Match 10 or 13 digit ISBNs from Amazon URL
  const dpMatch = amazonUrl.match(/\/dp\/(\d{10}|\d{13})/);
  if (dpMatch) return dpMatch[1];
  // Check if ASIN is actually an ISBN (all digits)
  const asinMatch = amazonUrl.match(/\/dp\/([A-Z0-9]{10})/i);
  if (asinMatch && /^\d{10}$/.test(asinMatch[1])) return asinMatch[1];
  return null;
}

// Cover sources - we support both Open Library and Google Books
function getOpenLibraryCoverUrl(isbn: string): string {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
}

function getGoogleBooksCoverUrl(isbn: string): string {
  return `https://books.google.com/books/content?vid=isbn:${isbn}&printsec=frontcover&img=1&zoom=1&source=gbs_api`;
}

function getCoverUrl(amazonUrl: string): string | null {
  const isbn = extractISBN(amazonUrl);
  if (isbn) {
    return getOpenLibraryCoverUrl(isbn); // Default to Open Library
  }
  return null;
}

// Verified covers list - supports both Open Library and Google Books
const VERIFIED_COVER_ISBNS_PATH = path.join(process.cwd(), 'data', 'verified-covers.json');

interface VerifiedCovers {
  openlib: Set<string>;
  google: Set<string>;
}

function loadVerifiedCovers(): VerifiedCovers {
  try {
    if (existsSync(VERIFIED_COVER_ISBNS_PATH)) {
      const data = JSON.parse(readFileSync(VERIFIED_COVER_ISBNS_PATH, 'utf-8'));

      // Handle both old format (array) and new format (object with openlib/google)
      if (Array.isArray(data)) {
        // Old format - treat all as Open Library
        console.log(`Loaded ${data.length} verified cover ISBNs (legacy format)`);
        return { openlib: new Set(data), google: new Set() };
      } else {
        // New format with separate sources
        const openlib = new Set(data.openlib || []);
        const google = new Set(data.google || []);
        console.log(`Loaded verified covers: ${openlib.size} Open Library, ${google.size} Google Books`);
        return { openlib, google };
      }
    }
  } catch (e) {
    console.warn('Could not load verified covers list:', e);
  }
  return { openlib: new Set(), google: new Set() };
}

// Check if book should be excluded (non-NBA content)
function shouldExcludeBook(category: string, title: string): boolean {
  const lowerCategory = category.toLowerCase();
  const lowerTitle = title.toLowerCase();
  
  const excludeKeywords = [
    'exclude',
    'non-basketball',
    'non-nba',
    'not nba',
    'football',
    'soccer',
    'tennis',
    'baseball',
    'hockey',
    'golf',
    'cricket',
    'rugby'
  ];
  
  for (const keyword of excludeKeywords) {
    if (lowerCategory.includes(keyword)) return true;
  }
  
  return false;
}

// Book type
interface Book {
  id: string;
  slug: string;
  title: string;
  author: string;
  rating: number | null;
  reviewCount: number | null;
  reviewCountDisplay: string;
  publicationDate: string | null;
  publicationYear: number | null;
  formats: string[];
  amazonUrl: string;
  category: string;
  description: string;
  playersMentioned: string[];
  teamsMentioned: string[];
  topics: string[];
  asin: string | null;
  coverUrl: string | null;
}

// Main ingestion function
async function ingestCsv(): Promise<void> {
  const csvPath = path.join(process.cwd(), 'data', 'books.csv');
  const outputPath = path.join(process.cwd(), 'src', 'data', 'books.json');

  if (!existsSync(csvPath)) {
    console.error(`Error: CSV file not found at ${csvPath}`);
    console.error('Please place your books.csv in the data/ directory.');
    process.exit(1);
  }

  console.log(`Reading CSV from: ${csvPath}`);
  const csvContent = readFileSync(csvPath, 'utf-8');

  // Parse CSV
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
    relax_column_count: true,
  }) as Record<string, string>[];

  console.log(`Parsed ${records.length} rows from CSV`);

  // Normalize each record
  const books: Book[] = [];
  const seenIds = new Set<string>();
  let excludedCount = 0;

  for (const row of records) {
    const title = cleanString(row['Title']);
    const author = cleanString(row['Author']);
    const amazonUrl = cleanString(row['Amazon Link']);
    const category = cleanString(row['Category']) || 'General';

    if (!title) {
      console.warn('Skipping row with empty title');
      continue;
    }

    // Exclude non-NBA books
    if (shouldExcludeBook(category, title)) {
      console.log(`Excluding non-NBA book: ${title} (${category})`);
      excludedCount++;
      continue;
    }

    const asin = extractAsin(amazonUrl);
    const id = generateBookId(title, author, asin);

    // Handle duplicates: prefer higher review count
    if (seenIds.has(id)) {
      console.warn(`Duplicate found: ${title} by ${author}`);
      const existingIdx = books.findIndex(b => b.id === id);
      if (existingIdx >= 0) {
        const existingReviews = books[existingIdx].reviewCount ?? 0;
        const newReviews = parseReviewCount(row['Number of Reviews']) ?? 0;
        if (newReviews > existingReviews) {
          // Replace with higher review count
          books.splice(existingIdx, 1);
        } else {
          continue;
        }
      }
    }

    const slug = generateSlug(title, author, id);
    const reviewCountStr = cleanString(row['Number of Reviews']);
    const pubDate = cleanString(row['Publication Date']);

    const book: Book = {
      id,
      slug,
      title,
      author,
      rating: parseRating(row['Rating']),
      reviewCount: parseReviewCount(reviewCountStr),
      reviewCountDisplay: reviewCountStr || 'N/A',
      publicationDate: pubDate || null,
      publicationYear: parsePublicationYear(pubDate),
      formats: parseFormats(row['Format']),
      amazonUrl,
      category,
      description: normalizeDescription(row['Description']),
      playersMentioned: splitList(row['Players Mentioned']),
      teamsMentioned: splitList(row['Teams Mentioned']),
      topics: splitList(row['Topics']),
      asin,
      coverUrl: getCoverUrl(amazonUrl),
    };

    books.push(book);
    seenIds.add(id);
  }

  // Sort by review count (highest first) as default
  books.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));

  console.log(`Normalized ${books.length} unique books`);
  console.log(`Excluded ${excludedCount} non-NBA books`);

  // Load verified covers list (ISBNs known to have covers)
  const verifiedCovers = loadVerifiedCovers();
  const totalVerified = verifiedCovers.openlib.size + verifiedCovers.google.size;

  // Update books to only include verified covers, using appropriate source
  let openlibCount = 0;
  let googleCount = 0;

  if (totalVerified > 0) {
    for (const book of books) {
      const isbn = extractISBN(book.amazonUrl);
      if (isbn) {
        if (verifiedCovers.openlib.has(isbn)) {
          book.coverUrl = getOpenLibraryCoverUrl(isbn);
          openlibCount++;
        } else if (verifiedCovers.google.has(isbn)) {
          book.coverUrl = getGoogleBooksCoverUrl(isbn);
          googleCount++;
        } else {
          book.coverUrl = null; // Remove unverified cover URL
        }
      } else {
        book.coverUrl = null;
      }
    }
    console.log(`Using verified covers: ${openlibCount} Open Library, ${googleCount} Google Books (${openlibCount + googleCount} total)`);
  } else {
    console.log('No verified covers list found - keeping all potential cover URLs');
    console.log('Run the verify-covers.html tool to generate a verified covers list');
  }

  const verifiedCoverCount = openlibCount + googleCount;

  // Write JSON output
  writeFileSync(outputPath, JSON.stringify(books, null, 2));
  console.log(`Wrote output to: ${outputPath}`);

  // Print summary stats
  const categories = new Set(books.map(b => b.category));
  const topics = new Set(books.flatMap(b => b.topics));
  const players = new Set(books.flatMap(b => b.playersMentioned));
  const teams = new Set(books.flatMap(b => b.teamsMentioned));
  const formats = new Set(books.flatMap(b => b.formats));
  const years = books.filter(b => b.publicationYear).map(b => b.publicationYear!);
  const booksWithCovers = books.filter(b => b.coverUrl).length;

  console.log('\n=== Summary ===');
  console.log(`Total books: ${books.length}`);
  console.log(`Books with verified covers: ${booksWithCovers}`);
  console.log(`Categories: ${categories.size}`);
  console.log(`Topics: ${topics.size}`);
  console.log(`Players mentioned: ${players.size}`);
  console.log(`Teams mentioned: ${teams.size}`);
  console.log(`Formats: ${Array.from(formats).join(', ')}`);
  if (years.length > 0) {
    console.log(`Year range: ${Math.min(...years)} - ${Math.max(...years)}`);
  }
  console.log('\nTop 5 by reviews:');
  books.slice(0, 5).forEach((b, i) => {
    console.log(`  ${i + 1}. ${b.title} (${b.reviewCountDisplay} reviews)`);
  });
}

// Run
ingestCsv().catch(console.error);