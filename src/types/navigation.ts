export interface NavArticleItem {
  id: string;
  slug: string;
  moduleNumber?: string;
  title: string;
  order: number;
  url: string;
  isCompleted?: boolean;
  isActive?: boolean;
}

export interface NavModuleItem {
  id: string;
  slug: string;
  moduleNumber?: string;
  title: string;
  order: number;
  articles?: NavArticleItem[];
  lessons?: NavArticleItem[];
}

export interface PathNavigationData {
  title?: string;
  modules?: NavModuleItem[];
  activeModuleSlug?: string;
  activeArticleSlug?: string;
  courseTitle?: string;
  courseSlug?: string;
  chapters?: NavModuleItem[];
  activeChapterSlug?: string;
  activeLessonSlug?: string;
}

// Backwards compatibility type aliases
export type CourseNavigationData = PathNavigationData;
export type NavChapterItem = NavModuleItem;
export type NavLessonItem = NavArticleItem;

export interface PreviousNextNavigation {
  previous?: {
    title: string;
    url: string;
    chapterTitle?: string;
    moduleTitle?: string;
  };
  next?: {
    title: string;
    url: string;
    chapterTitle?: string;
    moduleTitle?: string;
  };
}

export interface TableOfContentItem {
  id: string;
  text: string;
  depth: number;
  slug: string;
}
