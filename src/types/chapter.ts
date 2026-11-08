export interface Chapter {
  id: string;
  slug: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  lessonIds: string[];
}
