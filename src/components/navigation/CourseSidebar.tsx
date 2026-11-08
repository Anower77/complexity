import React, { useState, useEffect } from 'react';
import type { PathNavigationData } from '@/types/navigation';
import { getCourseProgress, calculateCompletionPercentage } from '@/lib/progress/progress-storage';
import { ChevronDown, ChevronRight, CheckCircle2, Circle, Compass } from 'lucide-react';
import { formatPath } from '@/lib/utilities/url';

interface Props {
  navigation: PathNavigationData;
  className?: string;
}

export default function CourseSidebar({ navigation, className = '' }: Props) {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});

  const pathSlug = navigation.courseSlug || 'system-architecture-fundamentals';
  const modules = navigation.modules || navigation.chapters || [];
  const activeArticleSlug = navigation.activeArticleSlug || navigation.activeLessonSlug;

  // Initialize completed lessons from localStorage
  useEffect(() => {
    const progress = getCourseProgress(pathSlug);
    setCompletedLessons(progress.completedLessons);

    // Default expand all modules
    const initialExpanded: Record<string, boolean> = {};
    for (const mod of modules) {
      initialExpanded[mod.slug] = true;
    }
    setExpandedChapters(initialExpanded);

    const handleProgressUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.courseSlug === pathSlug) {
        setCompletedLessons(customEvent.detail.record.completedLessons);
      }
    };

    window.addEventListener('complexity:progress-updated', handleProgressUpdate);
    return () => window.removeEventListener('complexity:progress-updated', handleProgressUpdate);
  }, [pathSlug, modules]);

  const toggleChapter = (moduleSlug: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [moduleSlug]: !prev[moduleSlug]
    }));
  };

  const totalLessons = modules.reduce((sum, mod) => sum + (mod.articles || mod.lessons || []).length, 0);
  const completionPct = calculateCompletionPercentage(completedLessons.length, totalLessons);

  return (
    <aside
      className={`w-full md:w-sidebar-left bg-surface border-r border-border-subtle flex flex-col h-full overflow-y-auto ${className}`}
      aria-label="Path navigation"
    >
      {/* Path Title Header */}
      <div className="p-4 border-b border-border-subtle">
        <a
          href={formatPath('/path')}
          className="group block"
        >
          <div className="flex items-center gap-2 text-xs font-mono text-text-muted mb-1">
            <Compass className="w-3.5 h-3.5 text-brand" />
            <span>STRUCTURED PATH</span>
          </div>
          <h2 className="font-technical text-sm font-bold text-text-primary group-hover:text-brand transition-colors line-clamp-2">
            {navigation.title || navigation.courseTitle || 'System Architecture'}
          </h2>
        </a>

        {/* Completion Progress */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-text-muted mb-1.5">
            <span>Read Progress</span>
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

      {/* Module & Article Navigation */}
      <div className="p-2 space-y-1 flex-1 overflow-y-auto">
        {modules.map((mod, modIdx) => {
          const isExpanded = expandedChapters[mod.slug] ?? true;
          const articles = mod.articles || mod.lessons || [];

          return (
            <div key={mod.slug} className="rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => toggleChapter(mod.slug)}
                className="w-full flex items-center justify-between px-2.5 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-elevated rounded transition-colors"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-2 text-left truncate">
                  <span className="font-mono text-text-muted text-[10px]">
                    MOD {modIdx + 1}
                  </span>
                  <span className="truncate">{mod.title}</span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="ml-2 pl-2 border-l border-border-subtle mt-1 space-y-0.5">
                  {articles.map((item) => {
                    const isCompleted = completedLessons.includes(item.id);
                    const isActive = item.isActive || item.slug === activeArticleSlug;

                    return (
                      <a
                        key={item.slug}
                        href={item.url}
                        className={`group flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs transition-colors ${
                          isActive
                            ? 'bg-brand-subtle text-brand font-medium border-l-2 border-brand -ml-[9px] pl-[15px]'
                            : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-text-muted flex-shrink-0 group-hover:text-text-secondary" />
                        )}
                        <span className="truncate">{item.title}</span>
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
