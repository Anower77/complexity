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
          {isCompleted ? 'Article Read' : 'Finished this article?'}
        </div>
        <p className="text-xs text-text-muted mt-0.5">
          {isCompleted
            ? 'Saved to your local browser storage.'
            : 'Mark as read to track your progress across the structured architecture path.'}
        </p>
      </div>

      <button
        type="button"
        onClick={handleToggle}
        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-xs transition-all ${
          isCompleted
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
            : 'bg-brand text-white hover:bg-brand-hover shadow-sm'
        }`}
      >
        {isCompleted ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Marked as Read</span>
          </>
        ) : (
          <>
            <Circle className="w-4 h-4" />
            <span>Mark as Read</span>
          </>
        )}
      </button>
    </div>
  );
}
