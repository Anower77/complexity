import React, { useState, useEffect } from 'react';
import type { CourseNavigationData } from '@/types/navigation';
import { getCourseProgress, calculateCompletionPercentage } from '@/lib/progress/progress-storage';
import { ChevronDown, ChevronRight, CheckCircle2, Circle, BookOpen } from 'lucide-react';
import { formatPath } from '@/lib/utilities/url';

interface Props {
  navigation: CourseNavigationData;
  className?: string;
}

export default function CourseSidebar({ navigation, className = '' }: Props) {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});

  // Initialize completed lessons from localStorage
  useEffect(() => {
    const progress = getCourseProgress(navigation.courseSlug);
    setCompletedLessons(progress.completedLessons);

    // Default expand all chapters or active chapter
    const initialExpanded: Record<string, boolean> = {};
    for (const ch of navigation.chapters) {
      initialExpanded[ch.slug] = true;
    }
    setExpandedChapters(initialExpanded);

    const handleProgressUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.courseSlug === navigation.courseSlug) {
        setCompletedLessons(customEvent.detail.record.completedLessons);
      }
    };

    window.addEventListener('complexity:progress-updated', handleProgressUpdate);
    return () => window.removeEventListener('complexity:progress-updated', handleProgressUpdate);
  }, [navigation.courseSlug, navigation.chapters]);

  const toggleChapter = (chapterSlug: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterSlug]: !prev[chapterSlug]
    }));
  };

  const totalLessons = navigation.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
  const completionPct = calculateCompletionPercentage(completedLessons.length, totalLessons);

  return (
    <aside
      className={`w-full md:w-sidebar-left bg-surface border-r border-border-subtle flex flex-col h-full overflow-y-auto ${className}`}
      aria-label="Course navigation"
    >
      {/* Course Title Header */}
      <div className="p-4 border-b border-border-subtle">
        <a
          href={formatPath(`/courses/${navigation.courseSlug}`)}
          className="group block"
        >
          <div className="flex items-center gap-2 text-xs font-mono text-text-muted mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>COURSE</span>
          </div>
          <h2 className="font-technical text-sm font-bold text-text-primary group-hover:text-brand transition-colors line-clamp-2">
            {navigation.courseTitle}
          </h2>
        </a>

        {/* Course Completion Progress */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-text-muted mb-1.5">
            <span>Progress</span>
            <span>{completionPct}%</span>
          </div>
          <div className="w-full bg-surface-muted h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-brand h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Chapter & Lesson Navigation */}
      <div className="p-2 space-y-1 flex-1 overflow-y-auto">
        {navigation.chapters.map((chapter, chIdx) => {
          const isExpanded = expandedChapters[chapter.slug] ?? true;
          const chapterCompleted = chapter.lessons.every((l) => completedLessons.includes(l.id));

          return (
            <div key={chapter.slug} className="rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => toggleChapter(chapter.slug)}
                className="w-full flex items-center justify-between px-2.5 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-elevated rounded transition-colors"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-2 text-left truncate">
                  <span className="font-mono text-text-muted text-[10px]">
                    CH {chIdx + 1}
                  </span>
                  <span className="truncate">{chapter.title}</span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="ml-2 pl-2 border-l border-border-subtle mt-1 space-y-0.5">
                  {chapter.lessons.map((lesson) => {
                    const isCompleted = completedLessons.includes(lesson.id);
                    const isActive = lesson.isActive;

                    return (
                      <a
                        key={lesson.slug}
                        href={lesson.url}
                        className={`group flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs transition-colors ${
                          isActive
                            ? 'bg-brand-subtle text-brand font-medium border-l-2 border-brand -ml-[9px] pl-[15px]'
                            : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-text-muted flex-shrink-0 group-hover:text-text-secondary" />
                        )}
                        <span className="truncate">{lesson.title}</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
