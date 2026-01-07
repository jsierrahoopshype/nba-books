import booksData from '@/data/books.json';
import { Book, FilterOptions } from './types';

const books: Book[] = booksData as Book[];

export function getAllBooks(): Book[] {
  return books;
}

export function getBookBySlug(slug: string): Book | undefined {
  return books.find(book => book.slug === slug);
}

export function getBookById(id: string): Book | undefined {
  return books.find(book => book.id === id);
}

export function getFilterOptions(books: Book[]): FilterOptions {
  const categories = Array.from(new Set(books.map(b => b.category))).sort();
  const topics = Array.from(new Set(books.flatMap(b => b.topics))).sort();
  const players = Array.from(new Set(books.flatMap(b => b.playersMentioned))).sort();
  const teams = Array.from(new Set(books.flatMap(b => b.teamsMentioned))).sort();
  const formats = Array.from(new Set(books.flatMap(b => b.formats))).sort();
  
  const years = books
    .map(b => b.publicationYear)
    .filter((y): y is number => y !== null);
  
  const minYear = years.length > 0 ? Math.min(...years) : 1960;
  const maxYear = years.length > 0 ? Math.max(...years) : new Date().getFullYear();

  return {
    categories,
    topics,
    players,
    teams,
    formats,
    yearRange: [minYear, maxYear],
  };
}