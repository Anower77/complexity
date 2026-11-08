import React, { useEffect, useState } from 'react';
import type { TableOfContentItem } from '@/types/navigation';
import { AlignLeft } from 'lucide-react';

interface Props {
  items: TableOfContentItem[];
}

export default function TableOfContents({ items }: Props) {
  const [activeId, setActiveId] = useState<string>('');
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    // Reading scroll progress listener
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const current = window.scrollY;
        const pct = Math.min(100, Math.max(0, Math.round((current / totalHeight) * 100)));
        setScrollProgress(pct);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Intersection observer for heading highlighting
    if (items.length === 0) return () => window.removeEventListener('scroll', handleScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-80px 0% -60% 0%', threshold: 0 }
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [items]);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className="w-sidebar-right hidden xl:block p-4 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-l border-border-subtle text-xs">
      {/* Reading Progress */}
      <div className="mb-4 pb-3 border-b border-border-subtle">
        <div className="flex items-center justify-between text-[11px] font-mono text-text-muted mb-1.5">
          <span>READING PROGRESS</span>
          <span>{scrollProgress}%</span>
        </div>
        <div className="w-full bg-surface-muted h-1 rounded-full overflow-hidden">
          <div
            className="bg-brand h-full rounded-full transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      {/* Table of Contents */}
      <div className="flex items-center gap-1.5 font-mono text-[11px] text-text-muted uppercase tracking-wider mb-3">
        <AlignLeft className="w-3.5 h-3.5" />
        <span>On this page</span>
      </div>

      <ul className="space-y-2">
        {items.map((item) => {
          const isActive = activeId === item.id;
          const isH3 = item.depth === 3;

          return (
            <li
              key={item.id}
              className={`${isH3 ? 'ml-3 text-[11px]' : 'text-xs'}`}
            >
              <a
                href={`#${item.id}`}
                className={`block transition-colors line-clamp-2 leading-relaxed ${
                  isActive
                    ? 'text-brand font-medium'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
