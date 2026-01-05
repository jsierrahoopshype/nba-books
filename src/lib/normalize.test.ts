import { describe, it, expect } from 'vitest';
import {
  parsePublicationYear,
  parseReviewCount,
  parseRating,
  splitList,
  parseFormats,
  generateSlug,
  normalizeDescription,
  cleanString,
} from './normalize';

describe('parsePublicationYear', () => {
  it('parses full date format', () => {
    expect(parsePublicationYear('October 27 2009')).toBe(2009);
    expect(parsePublicationYear('January 18 2022')).toBe(2022);
  });

  it('parses year only', () => {
    expect(parsePublicationYear('2009')).toBe(2009);
    expect(parsePublicationYear('1996')).toBe(1996);
  });

  it('parses abbreviated month format', () => {
    expect(parsePublicationYear('Oct 2009')).toBe(2009);
    expect(parsePublicationYear('Mar 15, 2020')).toBe(2020);
  });

  it('parses numeric date format', () => {
    expect(parsePublicationYear('10/27/2009')).toBe(2009);
    expect(parsePublicationYear('2020-03-15')).toBe(2020);
  });

  it('returns null for invalid/missing dates', () => {
    expect(parsePublicationYear(null)).toBe(null);
    expect(parsePublicationYear('')).toBe(null);
    expect(parsePublicationYear('N/A')).toBe(null);
    expect(parsePublicationYear('nan')).toBe(null);
    expect(parsePublicationYear('Unknown')).toBe(null);
  });

  it('rejects unreasonable years', () => {
    expect(parsePublicationYear('1800')).toBe(null);
    expect(parsePublicationYear('2099')).toBe(null);
  });
});

describe('parseReviewCount', () => {
  it('parses numeric strings with + suffix', () => {
    expect(parseReviewCount('3500+')).toBe(3500);
    expect(parseReviewCount('100+')).toBe(100);
  });

  it('parses plain numbers', () => {
    expect(parseReviewCount('500')).toBe(500);
    expect(parseReviewCount('12000')).toBe(12000);
  });

  it('parses k suffix', () => {
    expect(parseReviewCount('1.2k')).toBe(1200);
    expect(parseReviewCount('5k+')).toBe(5000);
  });

  it('handles commas', () => {
    expect(parseReviewCount('1,500')).toBe(1500);
    expect(parseReviewCount('12,000+')).toBe(12000);
  });

  it('returns null for invalid values', () => {
    expect(parseReviewCount(null)).toBe(null);
    expect(parseReviewCount('')).toBe(null);
    expect(parseReviewCount('N/A')).toBe(null);
    expect(parseReviewCount('nan')).toBe(null);
  });
});

describe('parseRating', () => {
  it('parses valid ratings', () => {
    expect(parseRating('4.6')).toBe(4.6);
    expect(parseRating('5.0')).toBe(5.0);
    expect(parseRating(4.8)).toBe(4.8);
  });

  it('returns null for invalid ratings', () => {
    expect(parseRating(null)).toBe(null);
    expect(parseRating('N/A')).toBe(null);
    expect(parseRating('6.0')).toBe(null); // Out of range
    expect(parseRating('-1')).toBe(null);
  });
});

describe('splitList', () => {
  it('splits semicolon-separated lists', () => {
    expect(splitList('Biography; History; Culture')).toEqual([
      'Biography',
      'History',
      'Culture',
    ]);
  });

  it('handles comma-separated lists', () => {
    expect(splitList('Michael Jordan, LeBron James')).toEqual([
      'Michael Jordan',
      'LeBron James',
    ]);
  });

  it('trims whitespace', () => {
    expect(splitList('  Lakers  ;  Bulls  ')).toEqual(['Lakers', 'Bulls']);
  });

  it('removes duplicates', () => {
    expect(splitList('History; Culture; History')).toEqual(['History', 'Culture']);
  });

  it('returns empty array for invalid input', () => {
    expect(splitList(null)).toEqual([]);
    expect(splitList('N/A')).toEqual([]);
    expect(splitList('')).toEqual([]);
  });
});

describe('parseFormats', () => {
  it('splits format string', () => {
    expect(parseFormats('Paperback/Hardcover/Kindle')).toEqual([
      'Paperback',
      'Hardcover',
      'Kindle',
    ]);
  });

  it('handles single format', () => {
    expect(parseFormats('Hardcover')).toEqual(['Hardcover']);
  });

  it('returns empty array for invalid input', () => {
    expect(parseFormats(null)).toEqual([]);
    expect(parseFormats('N/A')).toEqual([]);
  });
});

describe('generateSlug', () => {
  it('generates URL-safe slugs', () => {
    const slug = generateSlug('The Jordan Rules', 'Sam Smith', 'abc123def456');
    expect(slug).toMatch(/^the-jordan-rules-sam-smith-abc123$/);
  });

  it('handles special characters', () => {
    const slug = generateSlug("Giannis: The Improbable Rise of an NBA MVP", 'Mirin Fader', '123456789012');
    expect(slug).not.toContain(':');
    expect(slug).not.toContain("'");
  });

  it('truncates long titles', () => {
    const longTitle = 'This is a very very very very very very long book title that exceeds limits';
    const slug = generateSlug(longTitle, 'Author', '123456789012');
    expect(slug.length).toBeLessThan(100);
  });
});

describe('normalizeDescription', () => {
  it('normalizes whitespace', () => {
    expect(normalizeDescription('Hello    world')).toBe('Hello world');
    expect(normalizeDescription('Line1\n\nLine2')).toBe('Line1 Line2');
  });

  it('normalizes ellipses', () => {
    expect(normalizeDescription('More info...')).toBe('More info…');
  });

  it('returns empty string for invalid input', () => {
    expect(normalizeDescription(null)).toBe('');
    expect(normalizeDescription('N/A')).toBe('');
  });
});

describe('cleanString', () => {
  it('trims whitespace', () => {
    expect(cleanString('  hello  ')).toBe('hello');
  });

  it('returns empty string for N/A', () => {
    expect(cleanString('N/A')).toBe('');
    expect(cleanString('nan')).toBe('');
    expect(cleanString(null)).toBe('');
  });
});
