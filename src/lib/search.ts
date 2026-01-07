import Fuse, { IFuseOptions } from 'fuse.js';
import { Book, FilterState } from './types';

const fuseOptions: IFuseOptions<Book> = {
  keys: [
    { name: 'title', weight: 0.3 },
    { name: 'author', weight: 0.25 },
    { name: 'description', weight: 0.15 },
    { name: 'playersMentioned', weight: 0.15 },
    { name: 'teamsMentioned', weight: 0.1 },
    { name: 'topics', weight: 0.05 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  includeScore: true,
};

export function searchBooks(books: Book[], filters: FilterState): Book[] {
  let results = books;

  // Text search with Fuse.js
  if (filters.search && filters.search.trim()) {
    const fuse = new Fuse(books, fuseOptions);
    const searchResults = fuse.search(filters.search.trim());
    results = searchResults.map(r => r.item);
  }

  // Category filter
  if (filters.categories.length > 0) {
    results = results.filter(book => 
      filters.categories.includes(book.category)
    );
  }

  // Topics filter
  if (filters.topics.length > 0) {
    results = results.filter(book =>
      book.topics.some(topic => filters.topics.includes(topic))
    );
  }

  // Players filter
  if (filters.players.length > 0) {
    results = results.filter(book =>
      book.playersMentioned.some(player => filters.players.includes(player))
    );
  }

  // Teams filter
  if (filters.teams.length > 0) {
    results = results.filter(book =>
      book.teamsMentioned.some(team => filters.teams.includes(team))
    );
  }

  // Formats filter
  if (filters.formats.length > 0) {
    results = results.filter(book =>
      book.formats.some(format => filters.formats.includes(format))
    );
  }

  // Rating filter
  if (filters.minRating !== null) {
    results = results.filter(book =>
      book.rating !== null && book.rating >= filters.minRating!
    );
  }

  // Year range filter
  if (filters.yearRange[0] !== null) {
    results = results.filter(book =>
      book.publicationYear !== null && book.publicationYear >= filters.yearRange[0]!
    );
  }
  if (filters.yearRange[1] !== null) {
    results = results.filter(book =>
      book.publicationYear !== null && book.publicationYear <= filters.yearRange[1]!
    );
  }

  return results;
}

export function sortBooks(books: Book[], sortOption: string, searchQuery: string): Book[] {
  const sorted = [...books];

  switch (sortOption) {
    case 'relevance':
      // If there's a search query, keep Fuse.js order; otherwise sort by reviews
      if (!searchQuery) {
        sorted.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
      }
      break;
    case 'rating-desc':
      sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      break;
    case 'reviews-desc':
      sorted.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
      break;
    case 'newest':
      sorted.sort((a, b) => (b.publicationYear ?? 0) - (a.publicationYear ?? 0));
      break;
    case 'title-asc':
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }

  return sorted;
}

export function findSimilarBooks(book: Book, allBooks: Book[], limit: number = 6): Book[] {
  const candidates = allBooks.filter(b => b.id !== book.id);
  
  const scored = candidates.map(candidate => {
    let score = 0;
    
    // Same category
    if (candidate.category === book.category) score += 3;
    
    // Shared topics
    const sharedTopics = candidate.topics.filter(t => book.topics.includes(t));
    score += sharedTopics.length * 2;
    
    // Shared players
    const sharedPlayers = candidate.playersMentioned.filter(p => 
      book.playersMentioned.includes(p)
    );
    score += sharedPlayers.length * 2;
    
    // Shared teams
    const sharedTeams = candidate.teamsMentioned.filter(t => 
      book.teamsMentioned.includes(t)
    );
    score += sharedTeams.length;
    
    return { book: candidate, score };
  });
  
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.book);
}