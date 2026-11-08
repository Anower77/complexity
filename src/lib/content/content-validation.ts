import { getAllCourses } from './course-loader';
import { getAllChapters } from './chapter-loader';
import { getAllLessons } from './lesson-loader';

export interface ValidationError {
  type: 'duplicate-slug' | 'missing-metadata' | 'broken-relationship' | 'invalid-ordering';
  entity: 'course' | 'chapter' | 'lesson';
  id: string;
  message: string;
}

export function validateContent(): { isValid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  const courses = getAllCourses();
  const chapters = getAllChapters();
  const lessons = getAllLessons();

  // 1. Check duplicate course slugs
  const courseSlugs = new Set<string>();
  for (const c of courses) {
    if (!c.slug) {
      errors.push({ type: 'missing-metadata', entity: 'course', id: c.id, message: `Course ${c.id} is missing a slug` });
    } else if (courseSlugs.has(c.slug)) {
      errors.push({ type: 'duplicate-slug', entity: 'course', id: c.id, message: `Duplicate course slug: ${c.slug}` });
    } else {
      courseSlugs.add(c.slug);
    }
    if (!c.title || !c.description) {
      errors.push({ type: 'missing-metadata', entity: 'course', id: c.id, message: `Course ${c.id} missing title or description` });
    }
  }

  // 2. Check chapter relationships and duplicate slugs
  const courseIdSet = new Set(courses.map((c) => c.slug));
  const chapterSlugsByCourse = new Map<string, Set<string>>();

  for (const ch of chapters) {
    if (!courseIdSet.has(ch.courseId)) {
      errors.push({
        type: 'broken-relationship',
        entity: 'chapter',
        id: ch.id,
        message: `Chapter ${ch.id} references non-existent courseId "${ch.courseId}"`
      });
    }

    if (!chapterSlugsByCourse.has(ch.courseId)) {
      chapterSlugsByCourse.set(ch.courseId, new Set());
    }
    const slugSet = chapterSlugsByCourse.get(ch.courseId)!;
    if (slugSet.has(ch.slug)) {
      errors.push({
        type: 'duplicate-slug',
        entity: 'chapter',
        id: ch.id,
        message: `Duplicate chapter slug "${ch.slug}" in course "${ch.courseId}"`
      });
    } else {
      slugSet.add(ch.slug);
    }
  }

  // 3. Check lesson relationships and ordering
  const chapterIdSet = new Set(chapters.map((ch) => ch.id));
  const lessonSlugsByCourse = new Map<string, Set<string>>();
  const lessonOrdersByChapter = new Map<string, Set<number>>();

  for (const l of lessons) {
    if (!chapterIdSet.has(l.chapterId)) {
      errors.push({
        type: 'broken-relationship',
        entity: 'lesson',
        id: l.id,
        message: `Lesson ${l.id} references non-existent chapterId "${l.chapterId}"`
      });
    }

    if (!courseIdSet.has(l.courseId)) {
      errors.push({
        type: 'broken-relationship',
        entity: 'lesson',
        id: l.id,
        message: `Lesson ${l.id} references non-existent courseId "${l.courseId}"`
      });
    }

    // Check duplicate slug within course
    if (!lessonSlugsByCourse.has(l.courseId)) {
      lessonSlugsByCourse.set(l.courseId, new Set());
    }
    const slugsInCourse = lessonSlugsByCourse.get(l.courseId)!;
    if (slugsInCourse.has(l.slug)) {
      errors.push({
        type: 'duplicate-slug',
        entity: 'lesson',
        id: l.id,
        message: `Duplicate lesson slug "${l.slug}" in course "${l.courseId}"`
      });
    } else {
      slugsInCourse.add(l.slug);
    }

    // Check lesson ordering uniqueness within chapter
    if (!lessonOrdersByChapter.has(l.chapterId)) {
      lessonOrdersByChapter.set(l.chapterId, new Set());
    }
    const ordersInChapter = lessonOrdersByChapter.get(l.chapterId)!;
    if (ordersInChapter.has(l.order)) {
      errors.push({
        type: 'invalid-ordering',
        entity: 'lesson',
        id: l.id,
        message: `Duplicate lesson order ${l.order} in chapter "${l.chapterId}"`
      });
    } else {
      ordersInChapter.add(l.order);
    }

    // Check required fields
    if (!l.title || !l.description || l.estimatedReadingTime <= 0) {
      errors.push({
        type: 'missing-metadata',
        entity: 'lesson',
        id: l.id,
        message: `Lesson ${l.id} missing title, description, or valid reading time`
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
