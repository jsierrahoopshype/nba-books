import Fuse from 'fuse.js';
import { Book, FilterState } from './types';

const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.35 },
    { name: 'author', weight: 0.25 },
    { name: 'playersMentioned', weight: 0.15 },
    { name: 'teamsMentioned', weight: 0.10 },
    { name: 'topics', weight: 0.10 },
    { name: 'description', weight: 0.05 },
  ],
  threshold: 0.4,
  includeScore: true,
};

function parseReviewCount(display: string | null): number {
  if (!display) return 0;
  const match = display.match(/[\d,]+/);
  if (!match) return 0;
  return parseInt(match[0].replace(/,/g, ''), 10);
}

function calculateRelevanceScore(book: Book): number {
  let score = 0;
  const currentYear = new Date().getFullYear();
  
  if (book.publicationYear) {
    const age = currentYear - book.publicationYear;
    if (age <= 1) score += 30;
    else if (age <= 3) score += 25;
    else if (age <= 5) score += 20;
    else if (age <= 10) score += 10;
    else if (age <= 20) score += 5;
  }
  
  const reviewCount = parseReviewCount(book.reviewCountDisplay);
  if (reviewCount >= 10000) score += 40;
  else if (reviewCount >= 5000) score += 35;
  else if (reviewCount >= 1000) score += 30;
  else if (reviewCount >= 500) score += 25;
  else if (reviewCount >= 100) score += 20;
  else if (reviewCount >= 50) score += 15;
  else if (reviewCount > 0) score += 10;
  
  if (book.rating) {
    if (book.rating >= 4.8) score += 30;
    else if (book.rating >= 4.5) score += 25;
    else if (book.rating >= 4.2) score += 20;
    else if (book.rating >= 4.0) score += 15;
    else if (book.rating >= 3.5) score += 10;
    else score += 5;
  }
  
  return score;
}

export function searchBooks(books: Book[], filters: FilterState): Book[] {
  let results = [...books];

  if (filters.search && filters.search.trim()) {
    const fuse = new Fuse(results, fuseOptions);
    const searchResults = fuse.search(filters.search.trim());
    results = searchResults.map(r => r.item);
  }

  if (filters.categories && filters.categories.length > 0) {
    results = results.filter(b => filters.categories.includes(b.category));
  }

  if (filters.topics && filters.topics.length > 0) {
    results = results.filter(b => b.topics.some(t => filters.topics.includes(t)));
  }

  if (filters.players && filters.players.length > 0) {
    results = results.filter(b => b.playersMentioned.some(p => filters.players.includes(p)));
  }

  if (filters.teams && filters.teams.length > 0) {
    results = results.filter(b => b.teamsMentioned.some(t => filters.teams.includes(t)));
  }

  if (filters.formats && filters.formats.length > 0) {
    results = results.filter(b => b.formats.some(f => filters.formats.includes(f)));
  }

  if (filters.minRating) {
    results = results.filter(b => b.rating && b.rating >= filters.minRating!);
  }

  if (filters.yearRange) {
    const [minYear, maxYear] = filters.yearRange;
    if (minYear) {
      results = results.filter(b => !b.publicationYear || b.publicationYear >= minYear);
    }
    if (maxYear) {
      results = results.filter(b => !b.publicationYear || b.publicationYear <= maxYear);
    }
  }

  return results;
}

export function sortBooks(books: Book[], sort: string, searchQuery?: string): Book[] {
  const results = [...books];
  
  switch (sort) {
    case 'title':
      results.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'author':
      results.sort((a, b) => a.author.localeCompare(b.author));
      break;
    case 'year-desc':
      results.sort((a, b) => (b.publicationYear || 0) - (a.publicationYear || 0));
      break;
    case 'year-asc':
      results.sort((a, b) => (a.publicationYear || 0) - (b.publicationYear || 0));
      break;
    case 'rating':
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case 'reviews':
      results.sort((a, b) => parseReviewCount(b.reviewCountDisplay) - parseReviewCount(a.reviewCountDisplay));
      break;
    case 'relevance':
    default:
      if (!searchQuery || !searchQuery.trim()) {
        results.sort((a, b) => calculateRelevanceScore(b) - calculateRelevanceScore(a));
      }
      break;
  }

  return results;
}

export function findSimilarBooks(book: Book, allBooks: Book[], limit: number = 6): Book[] {
  const otherBooks = allBooks.filter(b => b.id !== book.id);
  
  const scored = otherBooks.map(other => {
    let score = 0;
    
    if (other.category === book.category) score += 3;
    
    book.playersMentioned.forEach(player => {
      if (other.playersMentioned.includes(player)) score += 2;
    });
    
    book.teamsMentioned.forEach(team => {
      if (other.teamsMentioned.includes(team)) score += 2;
    });
    
    book.topics.forEach(topic => {
      if (other.topics.includes(topic)) score += 1;
    });
    
    if (other.rating && other.rating >= 4.5) score += 1;
    if (parseReviewCount(other.reviewCountDisplay) >= 100) score += 1;
    
    return { book: other, score };
  });
  
  scored.sort((a, b) => b.score - a.score);
  
  return scored.slice(0, limit).map(s => s.book);
}