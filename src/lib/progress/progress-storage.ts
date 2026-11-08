export interface CourseProgressRecord {
  completedLessons: string[]; // lesson slugs or IDs
  lastVisitedLesson?: {
    chapterSlug: string;
    lessonSlug: string;
    visitedAt: string;
  };
}

const STORAGE_KEY_PREFIX = 'complexity_progress_';

function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function getCourseProgress(courseSlug: string): CourseProgressRecord {
  if (!isStorageAvailable()) {
    return { completedLessons: [] };
  }
  try {
    const item = window.localStorage.getItem(`${STORAGE_KEY_PREFIX}${courseSlug}`);
    if (!item) return { completedLessons: [] };
    return JSON.parse(item);
  } catch (err) {
    console.warn(`Failed to read progress for course ${courseSlug}`, err);
    return { completedLessons: [] };
  }
}

export function saveCourseProgress(courseSlug: string, record: CourseProgressRecord): void {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.setItem(`${STORAGE_KEY_PREFIX}${courseSlug}`, JSON.stringify(record));
    window.dispatchEvent(new CustomEvent('complexity:progress-updated', { detail: { courseSlug, record } }));
  } catch (err) {
    console.warn(`Failed to save progress for course ${courseSlug}`, err);
  }
}

export function toggleLessonCompletion(courseSlug: string, lessonId: string): boolean {
  const current = getCourseProgress(courseSlug);
  const exists = current.completedLessons.includes(lessonId);
  const updated = exists
    ? current.completedLessons.filter((id) => id !== lessonId)
    : [...current.completedLessons, lessonId];

  saveCourseProgress(courseSlug, {
    ...current,
    completedLessons: updated
  });

  return !exists;
}

export function setLastVisited(courseSlug: string, chapterSlug: string, lessonSlug: string): void {
  const current = getCourseProgress(courseSlug);
  saveCourseProgress(courseSlug, {
    ...current,
    lastVisitedLesson: {
      chapterSlug,
      lessonSlug,
      visitedAt: new Date().toISOString()
    }
  });
}

export function resetCourseProgress(courseSlug: string): void {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.removeItem(`${STORAGE_KEY_PREFIX}${courseSlug}`);
    window.dispatchEvent(new CustomEvent('complexity:progress-updated', { detail: { courseSlug, record: { completedLessons: [] } } }));
  } catch (err) {
    console.warn(`Failed to reset progress for course ${courseSlug}`, err);
  }
}

export function calculateCompletionPercentage(completedCount: number, totalCount: number): number {
  if (totalCount === 0) return 0;
  return Math.min(100, Math.round((completedCount / totalCount) * 100));
}
