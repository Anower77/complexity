import { getCourseBySlug } from './course-loader';
import { getChaptersByCourseId } from './chapter-loader';
import { getLessonsByChapterId } from './lesson-loader';
import { formatPath } from '@/lib/utilities/url';
import type { CourseNavigationData, NavChapterItem, PreviousNextNavigation } from '@/types/navigation';

export function buildCourseNavigation(
  courseSlug: string,
  activeChapterSlug?: string,
  activeLessonSlug?: string
): CourseNavigationData | null {
  const course = getCourseBySlug(courseSlug);
  if (!course) return null;

  const chapters = getChaptersByCourseId(course.slug);

  const navChapters: NavChapterItem[] = chapters.map((ch) => {
    const lessons = getLessonsByChapterId(ch.id);
    const navItems = lessons.map((l) => ({
      id: l.id,
      slug: l.slug,
      title: l.title,
      order: l.order,
      url: formatPath(`/courses/${course.slug}/${ch.slug}/${l.slug}`),
      isActive: l.slug === activeLessonSlug
    }));

    return {
      id: ch.id,
      slug: ch.slug,
      title: ch.title,
      order: ch.order,
      articles: navItems,
      lessons: navItems
    };
  });

  return {
    title: course.title,
    courseTitle: course.title,
    courseSlug: course.slug,
    modules: navChapters,
    chapters: navChapters,
    activeChapterSlug,
    activeLessonSlug
  };
}

export function getPreviousNextLessons(
  courseSlug: string,
  currentLessonSlug: string
): PreviousNextNavigation {
  const course = getCourseBySlug(courseSlug);
  if (!course) return {};

  const chapters = getChaptersByCourseId(course.slug);
  
  // Flatten ordered list of lessons with chapter info
  const flatLessons: {
    lessonSlug: string;
    lessonTitle: string;
    chapterSlug: string;
    chapterTitle: string;
  }[] = [];

  for (const ch of chapters) {
    const lessons = getLessonsByChapterId(ch.id);
    for (const l of lessons) {
      flatLessons.push({
        lessonSlug: l.slug,
        lessonTitle: l.title,
        chapterSlug: ch.slug,
        chapterTitle: ch.title
      });
    }
  }

  const currentIndex = flatLessons.findIndex((l) => l.lessonSlug === currentLessonSlug);
  if (currentIndex === -1) return {};

  const prev = currentIndex > 0 ? flatLessons[currentIndex - 1] : undefined;
  const next = currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1] : undefined;

  return {
    previous: prev
      ? {
          title: prev.lessonTitle,
          chapterTitle: prev.chapterTitle,
          url: formatPath(`/courses/${courseSlug}/${prev.chapterSlug}/${prev.lessonSlug}`)
        }
      : undefined,
    next: next
      ? {
          title: next.lessonTitle,
          chapterTitle: next.chapterTitle,
          url: formatPath(`/courses/${courseSlug}/${next.chapterSlug}/${next.lessonSlug}`)
        }
      : undefined
  };
}
