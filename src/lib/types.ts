// Core book data type after normalization
export interface Book {
  id: string;           // Stable hash of title+author+asin
  slug: string;         // URL-safe slug
  title: string;
  author: string;
  rating: number | null;
  reviewCount: number | null;
  reviewCountDisplay: string; // Original display string like "3500+"
  publicationDate: string | null;
  publicationYear: number | null;
  formats: string[];
  amazonUrl: string;
  category: string;
  description: string;
  playersMentioned: string[];
  teamsMentioned: string[];
  topics: string[];
  asin: string | null;  // Extracted from Amazon URL
}

// Filter state
export interface FilterState {
  search: string;
  categories: string[];
  topics: string[];
  formats: string[];
  minRating: number | null;
  yearRange: [number | null, number | null];
  players: string[];
  teams: string[];
}

// Sort options
export type SortOption = 
  | 'relevance'
  | 'rating-desc'
  | 'reviews-desc'
  | 'newest'
  | 'title-asc';

// Facet counts for UI
export interface FacetCounts {
  categories: Record<string, number>;
  topics: Record<string, number>;
  formats: Record<string, number>;
  players: Record<string, number>;
  teams: Record<string, number>;
  years: Record<number, number>;
}

// Analytics event types
export interface AnalyticsEvent {
  type: 'affiliate_click' | 'search' | 'filter_change' | 'page_view';
  payload: Record<string, unknown>;
  timestamp: number;
}
