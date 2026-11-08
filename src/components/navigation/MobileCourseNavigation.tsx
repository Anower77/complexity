import React, { useState } from 'react';
import type { CourseNavigationData } from '@/types/navigation';
import CourseSidebar from './CourseSidebar';
import { Menu, X } from 'lucide-react';

interface Props {
  navigation: CourseNavigationData;
}

export default function MobileCourseNavigation({ navigation }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden border-b border-border-subtle bg-surface px-4 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-2 truncate">
        <span className="text-xs font-mono text-text-muted">CH:</span>
        <span className="text-xs font-semibold text-text-primary truncate">
          {navigation.activeLessonSlug || 'Course Outline'}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-text-secondary bg-surface-elevated border border-border-subtle rounded hover:text-text-primary"
        aria-label="Open course navigation"
      >
        <Menu className="w-3.5 h-3.5" />
        <span>Outline</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative z-10 w-4/5 max-w-sm bg-surface h-full shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-border-subtle">
              <span className="font-mono text-xs font-bold text-text-primary">COURSE NAVIGATION</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-text-muted hover:text-text-primary"
                aria-label="Close navigation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <CourseSidebar navigation={navigation} className="border-r-0" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
