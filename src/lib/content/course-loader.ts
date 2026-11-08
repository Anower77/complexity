import type { Course } from '@/types/course';

export function getAllCourses(): Course[] {
  const courseModules = import.meta.glob<{ default: Course }>('/src/content/courses/*/course.json', {
    eager: true
  });

  const courses: Course[] = Object.values(courseModules).map((mod) => mod.default);
  return courses.filter((course) => course.status !== 'archived');
}

export function getCourseBySlug(slug: string): Course | undefined {
  const courses = getAllCourses();
  return courses.find((course) => course.slug === slug);
}
