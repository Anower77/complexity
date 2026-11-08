import type { Chapter } from '@/types/chapter';

export function getAllChapters(): Chapter[] {
  const chapterModules = import.meta.glob<{ default: Chapter }>(
    '/src/content/courses/*/chapters/*/chapter.json',
    { eager: true }
  );

  const chapters: Chapter[] = Object.values(chapterModules).map((mod) => mod.default);
  return chapters.sort((a, b) => a.order - b.order);
}

export function getChaptersByCourseId(courseId: string): Chapter[] {
  const all = getAllChapters();
  return all.filter((ch) => ch.courseId === courseId).sort((a, b) => a.order - b.order);
}

export function getChapterBySlug(courseSlug: string, chapterSlug: string): Chapter | undefined {
  const chapters = getAllChapters();
  return chapters.find((ch) => ch.courseId === courseSlug && ch.slug === chapterSlug);
}
