import React, { useState, useEffect } from 'react';
import { getCourseProgress, toggleLessonCompletion, setLastVisited } from '@/lib/progress/progress-storage';
import { CheckCircle2, Circle } from 'lucide-react';

interface Props {
  courseSlug: string;
  chapterSlug: string;
  lessonId: string;
}

export default function LessonProgress({ courseSlug, chapterSlug, lessonId }: Props) {
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    // Record last visited lesson
    setLastVisited(courseSlug, chapterSlug, lessonId);

    // Check completion status
    const progress = getCourseProgress(courseSlug);
    setIsCompleted(progress.completedLessons.includes(lessonId));

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.courseSlug === courseSlug) {
        setIsCompleted(customEvent.detail.record.completedLessons.includes(lessonId));
      }
    };

    window.addEventListener('complexity:progress-updated', handleUpdate);
    return () => window.removeEventListener('complexity:progress-updated', handleUpdate);
  }, [courseSlug, chapterSlug, lessonId]);

  const handleToggle = () => {
    const updatedState = toggleLessonCompletion(courseSlug, lessonId);
    setIsCompleted(updatedState);
  };

  return (
    <div className="flex items-center justify-between p-4 my-6 rounded-lg border border-border-subtle bg-surface-elevated">
      <div>
        <div className="font-technical text-sm font-semibold text-text-primary">
          {isCompleted ? 'Lesson Completed' : 'Finished this lesson?'}
        </div>
        <p className="text-xs text-text-muted mt-0.5">
          {isCompleted
            ? 'Your completion status has been saved in your local browser.'
            : 'Mark as completed to track your learning journey through this course.'}
        </p>
      </div>

      <button
        type="button"
        onClick={handleToggle}
        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-xs transition-all ${
          isCompleted
            ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 hover:bg-green-500/20'
            : 'bg-brand text-white hover:bg-brand-hover shadow-sm'
        }`}
      >
        {isCompleted ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            <span>Completed</span>
          </>
        ) : (
          <>
            <Circle className="w-4 h-4" />
            <span>Mark Complete</span>
          </>
        )}
      </button>
    </div>
  );
}
