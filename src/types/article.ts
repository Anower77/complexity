export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type ContentStatus = 'draft' | 'published';

export interface ArticleReference {
  title: string;
  url: string;
  type?: 'rfc' | 'paper' | 'documentation' | 'book';
}

export interface Article {
  id: string;
  slug: string;
  topicSlug: string;
  topicTitle: string;
  moduleNumber: string; // e.g. "01.01"
  title: string;
  description: string;
  order: number;
  difficulty: DifficultyLevel;
  readingTimeMinutes: number;
  objectives: string[];
  prerequisites: string[];
  references?: ArticleReference[];
  status: ContentStatus;
  interactiveType?: 'diagram' | 'workflow' | 'simulator' | 'comparison';
}

export interface PathModule {
  id: string;
  moduleNumber: string; // e.g. "01"
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  articles: Article[];
}
