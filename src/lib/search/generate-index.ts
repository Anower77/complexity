import { getAllCourses } from '@/lib/content/course-loader';
import { getAllChapters } from '@/lib/content/chapter-loader';
import { getAllLessons } from '@/lib/content/lesson-loader';
import { formatPath } from '@/lib/utilities/url';
import type { SearchDocument } from './search-index';

export function generateSearchDocuments(): SearchDocument[] {
  const courses = getAllCourses();
  const chapters = getAllChapters();
  const lessons = getAllLessons();

  const documents: SearchDocument[] = [];

  // Courses
  for (const c of courses) {
    documents.push({
      id: `course-${c.slug}`,
      type: 'course',
      title: c.title,
      description: c.description,
      url: formatPath(`/courses/${c.slug}`),
      tags: c.metadata?.tags,
      difficulty: c.difficulty
    });
  }

  // Chapters
  for (const ch of chapters) {
    const parentCourse = courses.find((c) => c.slug === ch.courseId);
    documents.push({
      id: `chapter-${ch.id}`,
      type: 'chapter',
      title: ch.title,
      description: ch.description,
      url: formatPath(`/courses/${ch.courseId}/${ch.slug}`),
      courseTitle: parentCourse?.title
    });
  }

  // Lessons
  for (const l of lessons) {
    const parentCourse = courses.find((c) => c.slug === l.courseId);
    const parentChapter = chapters.find((ch) => ch.id === l.chapterId);
    documents.push({
      id: `lesson-${l.id}`,
      type: 'lesson',
      title: l.title,
      description: l.description,
      url: formatPath(`/courses/${l.courseId}/${parentChapter?.slug || 'ch'}/${l.slug}`),
      courseTitle: parentCourse?.title,
      chapterTitle: parentChapter?.title,
      difficulty: l.difficulty
    });
  }

  return documents;
}
