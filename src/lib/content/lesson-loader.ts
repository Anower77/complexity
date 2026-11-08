import type { Lesson } from '@/types/lesson';
import { load as yamlLoad } from 'js-yaml';
import { slugify } from '@/lib/utilities/slug';

export interface LessonHeading {
  depth: number;
  slug: string;
  text: string;
}

export interface LoadedLesson extends Lesson {
  headings: LessonHeading[];
  rawContent: string;
}

export function parseLessonContent(raw: string): LoadedLesson {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---([\s\S]*)$/);
  if (!match) {
    throw new Error('Lesson MDX missing frontmatter block');
  }

  const frontmatterStr = match[1];
  const markdownBody = match[2];

  const frontmatter = yamlLoad(frontmatterStr) as Lesson;

  // Extract H2 and H3 headings
  const headings: LessonHeading[] = [];
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  let hMatch: RegExpExecArray | null;

  while ((hMatch = headingRegex.exec(markdownBody)) !== null) {
    const depth = hMatch[1].length;
    const text = hMatch[2].trim();
    const slug = slugify(text);
    headings.push({ depth, slug, text });
  }

  return {
    ...frontmatter,
    headings,
    rawContent: markdownBody
  };
}

export function getAllLessons(): LoadedLesson[] {
  const lessonFiles = import.meta.glob<string>(
    '/src/content/courses/*/chapters/*/lessons/*.mdx',
    { query: '?raw', import: 'default', eager: true }
  );

  const lessons: LoadedLesson[] = Object.values(lessonFiles).map((raw) => {
    return parseLessonContent(raw);
  });

  return lessons.sort((a, b) => a.order - b.order);
}

export function getLessonsByChapterId(chapterId: string): LoadedLesson[] {
  const all = getAllLessons();
  return all.filter((l) => l.chapterId === chapterId).sort((a, b) => a.order - b.order);
}

export function getLessonsByCourseId(courseId: string): LoadedLesson[] {
  const all = getAllLessons();
  return all.filter((l) => l.courseId === courseId).sort((a, b) => a.order - b.order);
}

export function getLessonBySlug(courseSlug: string, lessonSlug: string): LoadedLesson | undefined {
  const all = getAllLessons();
  return all.find((l) => l.courseId === courseSlug && l.slug === lessonSlug);
}
