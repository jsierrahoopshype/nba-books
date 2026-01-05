/**
 * Book Data Loading Utilities
 * 
 * Functions for loading and accessing the normalized book data.
 */

import type { Book } from './types';
import booksData from '@/data/books.json';

// Cache the books array
let booksCache: Book[] | null = null;
let booksByIdCache: Map<string, Book> | null = null;
let booksBySlugCache: Map<string, Book> | null = null;

/**
 * Get all books.
 */
export function getAllBooks(): Book[] {
  if (!booksCache) {
    booksCache = booksData as Book[];
  }
  return booksCache;
}

/**
 * Get a book by its ID.
 */
export function getBookById(id: string): Book | undefined {
  if (!booksByIdCache) {
    booksByIdCache = new Map();
    for (const book of getAllBooks()) {
      booksByIdCache.set(book.id, book);
    }
  }
  return booksByIdCache.get(id);
}

/**
 * Get a book by its slug.
 */
export function getBookBySlug(slug: string): Book | undefined {
  if (!booksBySlugCache) {
    booksBySlugCache = new Map();
    for (const book of getAllBooks()) {
      booksBySlugCache.set(book.slug, book);
    }
  }
  return booksBySlugCache.get(slug);
}

/**
 * Get all unique categories.
 */
export function getAllCategories(): string[] {
  const categories = new Set<string>();
  for (const book of getAllBooks()) {
    if (book.category) {
      categories.add(book.category);
    }
  }
  return Array.from(categories).sort();
}

/**
 * Get all unique topics.
 */
export function getAllTopics(): string[] {
  const topics = new Set<string>();
  for (const book of getAllBooks()) {
    for (const topic of book.topics) {
      topics.add(topic);
    }
  }
  return Array.from(topics).sort();
}

/**
 * Get all unique players mentioned.
 */
export function getAllPlayers(): string[] {
  const players = new Set<string>();
  for (const book of getAllBooks()) {
    for (const player of book.playersMentioned) {
      players.add(player);
    }
  }
  return Array.from(players).sort();
}

/**
 * Get all unique teams mentioned.
 */
export function getAllTeams(): string[] {
  const teams = new Set<string>();
  for (const book of getAllBooks()) {
    for (const team of book.teamsMentioned) {
      teams.add(team);
    }
  }
  return Array.from(teams).sort();
}

/**
 * Get all unique formats.
 */
export function getAllFormats(): string[] {
  const formats = new Set<string>();
  for (const book of getAllBooks()) {
    for (const format of book.formats) {
      formats.add(format);
    }
  }
  return Array.from(formats).sort();
}

/**
 * Get year range of publication dates.
 */
export function getYearRange(): [number, number] {
  let min = Infinity;
  let max = -Infinity;
  
  for (const book of getAllBooks()) {
    if (book.publicationYear) {
      min = Math.min(min, book.publicationYear);
      max = Math.max(max, book.publicationYear);
    }
  }
  
  return [
    min === Infinity ? 1980 : min,
    max === -Infinity ? new Date().getFullYear() : max,
  ];
}

/**
 * Get all book slugs (for static generation).
 */
export function getAllSlugs(): string[] {
  return getAllBooks().map(book => book.slug);
}
