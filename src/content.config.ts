import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const courses = defineCollection({
  loader: glob({ pattern: '**/course.json', base: './src/content/courses' }),
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    estimatedDuration: z.string(),
    learningObjectives: z.array(z.string()),
    prerequisites: z.array(z.string()),
    chapterIds: z.array(z.string()),
    status: z.enum(['draft', 'published', 'archived']),
    coverImage: z.string().optional(),
    metadata: z.record(z.any()).optional()
  })
});

const chapters = defineCollection({
  loader: glob({ pattern: '**/chapter.json', base: './src/content/courses' }),
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    courseId: z.string(),
    title: z.string(),
    description: z.string(),
    order: z.number(),
    lessonIds: z.array(z.string())
  })
});

const learningPaths = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/learning-paths' }),
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    difficulty: z.string(),
    courseSlugs: z.array(z.string()),
    estimatedDuration: z.string(),
    order: z.number()
  })
});

export const collections = {
  courses,
  chapters,
  'learning-paths': learningPaths
};
