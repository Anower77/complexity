import type { DifficultyLevel, ContentStatus } from './course';

export interface LessonReference {
  title: string;
  url: string;
  type?: 'rfc' | 'paper' | 'documentation' | 'book';
}

export interface Lesson {
  id: string;
  slug: string;
  chapterId: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  difficulty: DifficultyLevel;
  estimatedReadingTime: number; // in minutes
  objectives: string[];
  prerequisites: string[];
  content?: string;
  references?: LessonReference[];
  status: ContentStatus;
  relatedLessons?: string[];
}
