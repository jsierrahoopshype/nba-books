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

function sortByFrequency(items: string[]): string[] {
  const counts = new Map<string, number>();
  items.forEach(item => {
    counts.set(item, (counts.get(item) || 0) + 1);
  });
  const unique = Array.from(new Set(items));
  return unique.sort((a, b) => (counts.get(b) || 0) - (counts.get(a) || 0));
}

export function getFilterOptions(books: Book[]): FilterOptions {
  const allCategories = books.map(b => b.category);
  const allTopics = books.flatMap(b => b.topics);
  const allPlayers = books.flatMap(b => b.playersMentioned);
  const allTeams = books.flatMap(b => b.teamsMentioned);
  const allFormats = books.flatMap(b => b.formats);

  const categories = sortByFrequency(allCategories);
  const topics = sortByFrequency(allTopics);
  const players = sortByFrequency(allPlayers);
  const teams = sortByFrequency(allTeams);
  const formats = sortByFrequency(allFormats);

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