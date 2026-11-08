import { describe, it, expect } from 'vitest';
import { validateContent } from '@/lib/content/content-validation';
import { getAllCourses } from '@/lib/content/course-loader';
import { getAllChapters } from '@/lib/content/chapter-loader';
import { getAllLessons } from '@/lib/content/lesson-loader';

describe('Content Model & Validation', () => {
  it('loads sample courses correctly', () => {
    const courses = getAllCourses();
    expect(courses.length).toBeGreaterThan(0);
    expect(courses[0].slug).toBe('system-architecture-fundamentals');
    expect(courses[0].title).toBe('System Architecture Fundamentals');
  });

  it('loads sample chapters in proper order', () => {
    const chapters = getAllChapters();
    expect(chapters.length).toBeGreaterThanOrEqual(2);
    expect(chapters[0].slug).toBe('client-server-architecture');
    expect(chapters[1].slug).toBe('network-fundamentals');
    expect(chapters[0].order).toBeLessThan(chapters[1].order);
  });

  it('loads sample lessons with valid metadata', () => {
    const lessons = getAllLessons();
    expect(lessons.length).toBeGreaterThanOrEqual(3);
    for (const l of lessons) {
      expect(l.id).toBeDefined();
      expect(l.slug).toBeDefined();
      expect(l.title).toBeDefined();
      expect(l.estimatedReadingTime).toBeGreaterThan(0);
      expect(l.objectives.length).toBeGreaterThan(0);
    }
  });

  it('validates production content integrity with zero errors', () => {
    const result = validateContent();
    if (!result.isValid) {
      console.error('Validation errors found:', result.errors);
    }
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
