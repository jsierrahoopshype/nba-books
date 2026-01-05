/**
 * Analytics Abstraction Layer
 * 
 * Provides a vendor-agnostic interface for tracking events.
 * Wire this up to your preferred analytics provider (GA4, Plausible, etc.)
 */

import type { AnalyticsEvent } from './types';

// Queue events if analytics not yet initialized
let eventQueue: AnalyticsEvent[] = [];
let isInitialized = false;

// Custom handler that can be set by the consuming application
type AnalyticsHandler = (event: AnalyticsEvent) => void;
let customHandler: AnalyticsHandler | null = null;

/**
 * Initialize analytics with a custom handler.
 * Call this once on app startup.
 * 
 * @example
 * // With Google Analytics 4
 * initAnalytics((event) => {
 *   gtag('event', event.type, event.payload);
 * });
 * 
 * @example
 * // With Plausible
 * initAnalytics((event) => {
 *   plausible(event.type, { props: event.payload });
 * });
 */
export function initAnalytics(handler: AnalyticsHandler): void {
  customHandler = handler;
  isInitialized = true;
  
  // Flush queued events
  for (const event of eventQueue) {
    handler(event);
  }
  eventQueue = [];
}

/**
 * Track an analytics event.
 */
function track(event: AnalyticsEvent): void {
  // Always log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', event.type, event.payload);
  }
  
  if (customHandler) {
    customHandler(event);
  } else if (!isInitialized) {
    // Queue for later if not initialized
    eventQueue.push(event);
  }
}

/**
 * Track an affiliate link click.
 */
export function trackAffiliateClick(bookId: string, bookSlug: string, bookTitle: string): void {
  track({
    type: 'affiliate_click',
    payload: {
      book_id: bookId,
      book_slug: bookSlug,
      book_title: bookTitle,
      destination: 'amazon',
    },
    timestamp: Date.now(),
  });
}

/**
 * Track a search event.
 */
export function trackSearch(query: string, resultCount: number): void {
  track({
    type: 'search',
    payload: {
      query,
      result_count: resultCount,
    },
    timestamp: Date.now(),
  });
}

/**
 * Track a filter change.
 */
export function trackFilterChange(filterType: string, value: string | number | string[]): void {
  track({
    type: 'filter_change',
    payload: {
      filter_type: filterType,
      value,
    },
    timestamp: Date.now(),
  });
}

/**
 * Track a page view.
 */
export function trackPageView(path: string, title?: string): void {
  track({
    type: 'page_view',
    payload: {
      path,
      title,
    },
    timestamp: Date.now(),
  });
}

/**
 * Get data attributes for affiliate click tracking.
 * Use these on affiliate buttons/links.
 */
export function getAffiliateDataAttrs(bookId: string, bookSlug: string): Record<string, string> {
  return {
    'data-analytics': 'affiliate_click',
    'data-book-id': bookId,
    'data-book-slug': bookSlug,
  };
}
