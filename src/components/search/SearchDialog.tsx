import React, { useState, useEffect } from 'react';
import type { SearchDocument } from '@/lib/search/search-index';
import { searchDocuments } from '@/lib/search/search-index';
import { Search, X, BookOpen, Layers, FileText, ArrowRight } from 'lucide-react';

interface Props {
  documents: SearchDocument[];
  isOpenDefault?: boolean;
}

export default function SearchDialog({ documents, isOpenDefault = false }: Props) {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchDocument[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
    } else {
      const hits = searchDocuments(query, documents, 8);
      setResults(hits);
    }
  }, [query, documents]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="w-4 h-4 text-brand" />;
      case 'chapter':
        return <Layers className="w-4 h-4 text-purple-400" />;
      default:
        return <FileText className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-full max-w-xl rounded-xl border border-border-strong bg-surface shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border-subtle">
              <Search className="w-5 h-5 text-text-muted flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses, chapters, concepts..."
                className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 text-text-muted hover:text-text-primary"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-block font-mono text-[10px] px-1.5 py-0.5 rounded border border-border-subtle text-text-muted bg-surface-elevated">
                ESC
              </kbd>
            </div>

            {/* Search Results View */}
            <div className="max-h-96 overflow-y-auto p-2">
              {query.trim() && results.length === 0 ? (
                <div className="py-12 text-center text-xs text-text-muted">
                  No matches found for <span className="font-semibold text-text-primary">"{query}"</span>
                </div>
              ) : (
                <div className="space-y-1">
                  {results.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.url}
                      className="group flex items-start gap-3 p-3 rounded-lg hover:bg-surface-elevated transition-colors border border-transparent hover:border-border-subtle"
                    >
                      <div className="p-2 rounded bg-surface-elevated border border-border-subtle mt-0.5">
                        {getIcon(doc.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[10px] uppercase text-text-muted">
                            {doc.type}
                          </span>
                          {doc.courseTitle && (
                            <span className="text-[10px] text-text-muted truncate">
                              • {doc.courseTitle}
                            </span>
                          )}
                        </div>
                        <h4 className="font-technical text-sm font-semibold text-text-primary group-hover:text-brand transition-colors truncate">
                          {doc.title}
                        </h4>
                        <p className="text-xs text-text-secondary line-clamp-1 mt-0.5">
                          {doc.description}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-brand group-hover:translate-x-0.5 transition-all mt-3" />
                    </a>
                  ))}
                </div>
              )}

              {!query.trim() && (
                <div className="py-8 text-center text-xs text-text-muted">
                  Type a topic (e.g., <span className="text-brand">"client"</span>, <span className="text-brand">"dns"</span>, <span className="text-brand">"sockets"</span>) to search.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
