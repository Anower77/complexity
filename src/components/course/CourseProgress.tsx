import React, { useState, useEffect } from 'react';
import { getCourseProgress, calculateCompletionPercentage, resetCourseProgress } from '@/lib/progress/progress-storage';
import { Play, RotateCcw, CheckCircle2 } from 'lucide-react';
import { formatPath } from '@/lib/utilities/url';

interface Props {
  courseSlug: string;
  totalLessons: number;
  firstLessonUrl: string;
}

export default function CourseProgress({ courseSlug, totalLessons, firstLessonUrl }: Props) {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [lastVisited, setLastVisited] = useState<{ chapterSlug: string; lessonSlug: string } | null>(null);

  useEffect(() => {
    const progress = getCourseProgress(courseSlug);
    setCompletedLessons(progress.completedLessons);
    if (progress.lastVisitedLesson) {
      setLastVisited(progress.lastVisitedLesson);
    }

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.courseSlug === courseSlug) {
        setCompletedLessons(customEvent.detail.record.completedLessons);
      }
    };

    window.addEventListener('complexity:progress-updated', handleUpdate);
    return () => window.removeEventListener('complexity:progress-updated', handleUpdate);
  }, [courseSlug]);

  const handleReset = () => {
    if (window.confirm('Reset reading progress for this track?')) {
      resetCourseProgress(courseSlug);
      setCompletedLessons([]);
      setLastVisited(null);
    }
  };

  const percentage = calculateCompletionPercentage(completedLessons.length, totalLessons);
  const continueUrl = lastVisited
    ? formatPath(`/courses/${courseSlug}/${lastVisited.chapterSlug}/${lastVisited.lessonSlug}`)
    : firstLessonUrl;

  const isStarted = completedLessons.length > 0 || lastVisited !== null;

  return (
    <div className="p-6 rounded-lg border border-border-subtle bg-surface mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-xs font-semibold text-text-muted uppercase tracking-wider">
              READING PROGRESS
            </span>
            <span className="font-mono text-xs font-bold text-brand">
              {percentage}%
            </span>
          </div>

          <div className="w-48 sm:w-64 bg-surface-muted h-2 rounded-full overflow-hidden">
            <div
              className="bg-brand h-full rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <p className="text-xs text-text-muted mt-2 font-mono">
            {completedLessons.length} of {totalLessons} articles read
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isStarted && (
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 text-xs font-mono text-text-muted hover:text-text-primary border border-border-subtle rounded-md hover:bg-surface-elevated transition-colors flex items-center gap-1.5"
              title="Reset progress"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <a
            href={continueUrl}
            className="px-5 py-2.5 rounded-md bg-brand text-white hover:bg-brand-hover text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isStarted ? 'Continue Reading' : 'Start Reading Track'}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
