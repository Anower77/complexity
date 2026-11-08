import { describe, it, expect } from 'vitest';
import { buildCourseNavigation, getPreviousNextLessons } from '@/lib/content/navigation-builder';

describe('Navigation Engine', () => {
  const courseSlug = 'system-architecture-fundamentals';

  it('builds hierarchical course navigation correctly', () => {
    const nav = buildCourseNavigation(courseSlug, 'client-server-architecture', 'introduction-to-client-server');
    expect(nav).not.toBeNull();
    expect(nav?.courseSlug).toBe(courseSlug);
    expect(nav?.chapters?.length).toBeGreaterThanOrEqual(2);

    const firstChapter = nav?.chapters?.[0];
    expect(firstChapter?.slug).toBe('client-server-architecture');
    expect(firstChapter?.lessons?.length).toBeGreaterThanOrEqual(2);

    // Active lesson check
    const activeLesson = firstChapter?.lessons?.find((l) => l.slug === 'introduction-to-client-server');
    expect(activeLesson?.isActive).toBe(true);
  });

  it('computes previous and next navigation across chapter boundaries', () => {
    // 1. First lesson in course: previous should be undefined, next should be lesson 2
    const firstLessonNav = getPreviousNextLessons(courseSlug, 'introduction-to-client-server');
    expect(firstLessonNav.previous).toBeUndefined();
    expect(firstLessonNav.next).toBeDefined();
    expect(firstLessonNav.next?.title).toBe('Request Lifecycle & Transport Protocols');

    // 2. Second lesson in chapter 1: next should transition across to chapter 2's first lesson!
    const secondLessonNav = getPreviousNextLessons(courseSlug, 'request-lifecycle-and-protocols');
    expect(secondLessonNav.previous?.title).toBe('Introduction to Client-Server Architecture');
    expect(secondLessonNav.next?.title).toBe('DNS: How Domain Names Find Servers');
    expect(secondLessonNav.next?.chapterTitle).toBe('Network Fundamentals');
  });
});
