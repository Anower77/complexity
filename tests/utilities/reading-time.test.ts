import { describe, it, expect } from 'vitest';
import { calculateReadingTime } from '@/lib/utilities/reading-time';
import { formatDuration } from '@/lib/utilities/format-duration';
import { slugify } from '@/lib/utilities/slug';

describe('Reading Time & Slug Utilities', () => {
  it('calculates reading time accurately based on 200 words per minute', () => {
    expect(calculateReadingTime('')).toBe(1);
    
    // 400 words should be exactly 2 minutes
    const text400 = new Array(400).fill('packet').join(' ');
    expect(calculateReadingTime(text400)).toBe(2);

    // 100 words should round up to 1 minute
    const text100 = new Array(100).fill('server').join(' ');
    expect(calculateReadingTime(text100)).toBe(1);
  });

  it('formats duration string correctly', () => {
    expect(formatDuration(8)).toBe('8 min read');
    expect(formatDuration(60)).toBe('1 hr read');
    expect(formatDuration(75)).toBe('1 hr 15 min read');
  });

  it('slugifies string into URL-safe format', () => {
    expect(slugify('Client-Server Architecture!')).toBe('client-server-architecture');
    expect(slugify('  HTTP & HTTPS: Request Lifecycle  ')).toBe('http-https-request-lifecycle');
  });
});
