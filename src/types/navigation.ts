export interface NavLessonItem {
  id: string;
  slug: string;
  title: string;
  order: number;
  url: string;
  isCompleted?: boolean;
  isActive?: boolean;
}

export interface NavChapterItem {
  id: string;
  slug: string;
  title: string;
  order: number;
  lessons: NavLessonItem[];
}

export interface CourseNavigationData {
  courseTitle: string;
  courseSlug: string;
  chapters: NavChapterItem[];
  activeChapterSlug?: string;
  activeLessonSlug?: string;
}

export interface PreviousNextNavigation {
  previous?: {
    title: string;
    url: string;
    chapterTitle: string;
  };
  next?: {
    title: string;
    url: string;
    chapterTitle: string;
  };
}

export interface TableOfContentItem {
  id: string;
  text: string;
  depth: number;
}
