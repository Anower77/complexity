export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type ContentStatus = 'draft' | 'published' | 'archived';

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  estimatedDuration: string;
  learningObjectives: string[];
  prerequisites: string[];
  chapterIds: string[];
  status: ContentStatus;
  coverImage?: string;
  metadata?: {
    tags?: string[];
    author?: string;
    version?: string;
    category?: string;
  };
}
