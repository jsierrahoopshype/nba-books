/**
 * Analytics abstraction layer
 * Wire up your preferred analytics provider here
 */

import type { AnalyticsEvent } from './types';

// Queue events if analytics not yet initialized
let eventQueue: AnalyticsEvent[] = [];
let isInitialized = false;
let customHandler: ((event: AnalyticsEvent) => void) | null = null;

/**
 * Initialize analytics with optional custom handler
 */
export function initAnalytics(handler?: (event: AnalyticsEvent) => void) {
  if (handler) {
    customHandler = handler;
  }
  isInitialized = true;
  
  // Process queued events
  eventQueue.forEach(event => trackEvent(event));
  eventQueue = [];
}

/**
 * Track an analytics event
 */
export function trackEvent(event: AnalyticsEvent) {
  if (!isInitialized) {
    eventQueue.push(event);
    return;
  }

  // Always log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', event.action, event);
  }

  if (customHandler) {
    customHandler(event);
  }

  // Google Analytics 4 (if available)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      book_id: event.bookId,
      book_slug: event.bookSlug,
      book_title: event.bookTitle,
    });
  }
}

/**
 * Track affiliate link click
 */
export function trackAffiliateClick(bookId: string, bookSlug: string, bookTitle: string) {
  trackEvent({
    action: 'affiliate_click',
    category: 'engagement',
    label: bookTitle,
    bookId,
    bookSlug,
    bookTitle,
  });
}

/**
 * Track search
 */
export function trackSearch(query: string, resultCount: number) {
  trackEvent({
    action: 'search',
    category: 'engagement',
    label: query,
    value: resultCount,
  });
}

/**
 * Track filter usage
 */
export function trackFilter(filterType: string, filterValue: string) {
  trackEvent({
    action: 'filter',
    category: 'engagement',
    label: `${filterType}:${filterValue}`,
  });
}

/**
 * Track book detail view
 */
export function trackBookView(bookId: string, bookSlug: string, bookTitle: string) {
  trackEvent({
    action: 'view_book',
    category: 'engagement',
    label: bookTitle,
    bookId,
    bookSlug,
    bookTitle,
  });
}