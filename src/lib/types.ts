export interface Book {
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
  coverUrl: string | null;
}

export interface FilterState {
  search: string;
  categories: string[];
  topics: string[];
  players: string[];
  teams: string[];
  formats: string[];
  minRating: number | null;
  yearRange: [number | null, number | null];
}

export type SortOption = 
  | 'relevance'
  | 'rating-desc'
  | 'reviews-desc'
  | 'newest'
  | 'title-asc';

export interface FilterOptions {
  categories: string[];
  topics: string[];
  players: string[];
  teams: string[];
  formats: string[];
  yearRange: [number, number];
}