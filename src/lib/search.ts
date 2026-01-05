/**
 * Search functionality using Fuse.js
 * 
 * Provides fuzzy, typo-tolerant search across multiple fields.
 */

import Fuse, { IFuseOptions } from 'fuse.js';
import type { Book, FilterState, SortOption, FacetCounts } from './types';

// Fuse.js options optimized for book search
const fuseOptions: IFuseOptions<Book> = {
  // Fields to search with their weights
  keys: [
    { name: 'title', weight: 2 },
    { name: 'author', weight: 1.5 },
    { name: 'description', weight: 0.8 },
    { name: 'playersMentioned', weight: 1 },
    { name: 'teamsMentioned', weight: 1 },
    { name: 'topics', weight: 0.7 },
    { name: 'category', weight: 0.6 },
  ],
  // Fuzzy matching settings
  threshold: 0.4, // 0 = exact match, 1 = match anything
  distance: 100,
  minMatchCharLength: 2,
  includeScore: true,
  useExtendedSearch: false,
  ignoreLocation: true,
  findAllMatches: true,
};

let fuseInstance: Fuse<Book> | null = null;

/**
 * Initialize the search index with books data.
 */
export function initializeSearchIndex(books: Book[]): void {
  fuseInstance = new Fuse(books, fuseOptions);
}

/**
 * Perform fuzzy search on books.
 * Returns all books (with scores) if query is empty.
 */
export function searchBooks(
  books: Book[],
  query: string
): Array<{ item: Book; score: number }> {
  if (!query.trim()) {
    // Return all books with neutral score
    return books.map(book => ({ item: book, score: 0 }));
  }

  if (!fuseInstance) {
    initializeSearchIndex(books);
  }

  const results = fuseInstance!.search(query);
  return results.map(r => ({
    item: r.item,
    score: r.score ?? 0,
  }));
}

/**
 * Apply filters to a list of books.
 */
export function filterBooks(books: Book[], filters: FilterState): Book[] {
  return books.filter(book => {
    // Category filter (multi-select)
    if (filters.categories.length > 0) {
      if (!filters.categories.includes(book.category)) {
        return false;
      }
    }

    // Topics filter (multi-select, OR logic)
    if (filters.topics.length > 0) {
      const hasMatchingTopic = book.topics.some(t => 
        filters.topics.includes(t)
      );
      if (!hasMatchingTopic) {
        return false;
      }
    }

    // Formats filter (multi-select, OR logic)
    if (filters.formats.length > 0) {
      const hasMatchingFormat = book.formats.some(f => 
        filters.formats.includes(f)
      );
      if (!hasMatchingFormat) {
        return false;
      }
    }

    // Min rating filter
    if (filters.minRating !== null && book.rating !== null) {
      if (book.rating < filters.minRating) {
        return false;
      }
    }

    // Year range filter
    if (filters.yearRange[0] !== null && book.publicationYear !== null) {
      if (book.publicationYear < filters.yearRange[0]) {
        return false;
      }
    }
    if (filters.yearRange[1] !== null && book.publicationYear !== null) {
      if (book.publicationYear > filters.yearRange[1]) {
        return false;
      }
    }

    // Players filter (multi-select, OR logic)
    if (filters.players.length > 0) {
      const hasMatchingPlayer = book.playersMentioned.some(p => 
        filters.players.includes(p)
      );
      if (!hasMatchingPlayer) {
        return false;
      }
    }

    // Teams filter (multi-select, OR logic)
    if (filters.teams.length > 0) {
      const hasMatchingTeam = book.teamsMentioned.some(t => 
        filters.teams.includes(t)
      );
      if (!hasMatchingTeam) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort books by various criteria.
 */
export function sortBooks(
  books: Array<{ item: Book; score: number }>,
  sortBy: SortOption
): Book[] {
  const sorted = [...books];

  switch (sortBy) {
    case 'relevance':
      // Already sorted by search score (lower is better)
      sorted.sort((a, b) => a.score - b.score);
      break;

    case 'rating-desc':
      sorted.sort((a, b) => {
        const rA = a.item.rating ?? 0;
        const rB = b.item.rating ?? 0;
        return rB - rA;
      });
      break;

    case 'reviews-desc':
      sorted.sort((a, b) => {
        const rA = a.item.reviewCount ?? 0;
        const rB = b.item.reviewCount ?? 0;
        return rB - rA;
      });
      break;

    case 'newest':
      sorted.sort((a, b) => {
        const yA = a.item.publicationYear ?? 0;
        const yB = b.item.publicationYear ?? 0;
        return yB - yA;
      });
      break;

    case 'title-asc':
      sorted.sort((a, b) => 
        a.item.title.localeCompare(b.item.title)
      );
      break;
  }

  return sorted.map(r => r.item);
}

/**
 * Calculate facet counts for the filter UI.
 */
export function calculateFacets(books: Book[]): FacetCounts {
  const facets: FacetCounts = {
    categories: {},
    topics: {},
    formats: {},
    players: {},
    teams: {},
    years: {},
  };

  for (const book of books) {
    // Categories
    if (book.category) {
      facets.categories[book.category] = (facets.categories[book.category] || 0) + 1;
    }

    // Topics
    for (const topic of book.topics) {
      facets.topics[topic] = (facets.topics[topic] || 0) + 1;
    }

    // Formats
    for (const format of book.formats) {
      facets.formats[format] = (facets.formats[format] || 0) + 1;
    }

    // Players (top 50 for UI)
    for (const player of book.playersMentioned) {
      facets.players[player] = (facets.players[player] || 0) + 1;
    }

    // Teams
    for (const team of book.teamsMentioned) {
      facets.teams[team] = (facets.teams[team] || 0) + 1;
    }

    // Years
    if (book.publicationYear) {
      facets.years[book.publicationYear] = (facets.years[book.publicationYear] || 0) + 1;
    }
  }

  return facets;
}

/**
 * Get default filter state.
 */
export function getDefaultFilters(): FilterState {
  return {
    search: '',
    categories: [],
    topics: [],
    formats: [],
    minRating: null,
    yearRange: [null, null],
    players: [],
    teams: [],
  };
}

/**
 * Find similar books based on shared attributes.
 */
export function findSimilarBooks(
  book: Book,
  allBooks: Book[],
  limit: number = 6
): Book[] {
  const otherBooks = allBooks.filter(b => b.id !== book.id);
  
  // Score each book by similarity
  const scored = otherBooks.map(other => {
    let score = 0;
    
    // Same category = high score
    if (other.category === book.category) {
      score += 10;
    }
    
    // Shared topics
    const sharedTopics = book.topics.filter(t => other.topics.includes(t));
    score += sharedTopics.length * 3;
    
    // Shared players
    const sharedPlayers = book.playersMentioned.filter(p => 
      other.playersMentioned.includes(p)
    );
    score += sharedPlayers.length * 5;
    
    // Shared teams
    const sharedTeams = book.teamsMentioned.filter(t => 
      other.teamsMentioned.includes(t)
    );
    score += sharedTeams.length * 4;
    
    // Same author bonus
    if (other.author.toLowerCase() === book.author.toLowerCase()) {
      score += 8;
    }
    
    return { book: other, score };
  });
  
  // Sort by score descending, then by rating
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (b.book.rating ?? 0) - (a.book.rating ?? 0);
  });
  
  return scored.slice(0, limit).map(s => s.book);
}
