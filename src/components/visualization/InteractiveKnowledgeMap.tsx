import React, { useState, useMemo } from 'react';
import {
  TOPICS,
  TOPIC_EDGES,
  CATEGORIES,
  type TopicNode,
  type TopicCategory
} from '@/data/topics';
import { formatPath } from '@/lib/utilities/url';
import {
  Search,
  RotateCcw,
  Layers,
  ArrowRight,
  List,
  Network,
  ExternalLink,
  BookOpen,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function InteractiveKnowledgeMap() {
  const [selectedTopicId, setSelectedTopicId] = useState<string>('client-server');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'graph' | 'list'>('graph');
  const [hoveredTopicId, setHoveredTopicId] = useState<string | null>(null);

  // Active topic
  const activeTopic = useMemo(() => {
    return TOPICS.find((t) => t.id === selectedTopicId) || TOPICS[0];
  }, [selectedTopicId]);

  // Connected node IDs for highlighting
  const connectedNodeIds = useMemo(() => {
    const ids = new Set<string>();
    ids.add(activeTopic.id);
    activeTopic.prerequisites.forEach((p) => ids.add(p));
    activeTopic.nextTopics.forEach((n) => ids.add(n));
    activeTopic.relatedTopics.forEach((r) => ids.add(r));
    return ids;
  }, [activeTopic]);

  // Filtered topics for list view and search highlighting
  const filteredTopics = useMemo(() => {
    return TOPICS.filter((topic) => {
      const matchesCategory =
        selectedCategory === 'all' || topic.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Prerequisite objects for active topic
  const prerequisiteTopics = useMemo(() => {
    return activeTopic.prerequisites
      .map((id) => TOPICS.find((t) => t.id === id))
      .filter(Boolean) as TopicNode[];
  }, [activeTopic]);

  // Next topic objects for active topic
  const nextTopics = useMemo(() => {
    return activeTopic.nextTopics
      .map((id) => TOPICS.find((t) => t.id === id))
      .filter(Boolean) as TopicNode[];
  }, [activeTopic]);

  const handleReset = () => {
    setSelectedTopicId('client-server');
    setSelectedCategory('all');
    setSearchQuery('');
    setHoveredTopicId(null);
  };

  return (
    <div className="w-full rounded-xl border border-border-strong bg-surface glow-card overflow-hidden">
      {/* Control Bar */}
      <div className="p-4 sm:p-5 border-b border-border-subtle bg-surface-elevated/70 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-brand uppercase tracking-wider mb-1">
            <Network className="w-3.5 h-3.5" />
            <span>INTERACTIVE ARCHITECTURE KNOWLEDGE MAP</span>
          </div>
          <h3 className="font-editorial text-xl font-bold text-text-primary">
            Engineering Concepts, Prerequisites & Dependencies
          </h3>
          <p className="text-xs text-text-secondary mt-0.5 font-technical">
            Click nodes to trace architectural prerequisites, explore upstream invariants, and inspect downstream unlock paths.
          </p>
        </div>

        {/* View Toggle & Search */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded bg-surface border border-border-subtle text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand w-40 sm:w-48 font-technical"
              aria-label="Filter concepts"
            />
          </div>

          <div className="inline-flex rounded-md border border-border-subtle bg-surface p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('graph')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono transition-colors ${
                viewMode === 'graph'
                  ? 'bg-brand text-white font-semibold'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              aria-label="Graph View"
            >
              <Network className="w-3 h-3" />
              <span>Graph</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono transition-colors ${
                viewMode === 'list'
                  ? 'bg-brand text-white font-semibold'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              aria-label="Accessible List View"
            >
              <List className="w-3 h-3" />
              <span>List View</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded border border-border-subtle text-xs text-text-muted hover:text-text-primary hover:bg-surface-elevated font-mono transition-colors"
            title="Reset map selection"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="px-4 sm:px-6 py-2.5 border-b border-border-subtle bg-surface/50 flex items-center gap-2 overflow-x-auto text-xs font-technical">
        <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider mr-1 whitespace-nowrap">
          Filter:
        </span>
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-brand text-white'
              : 'bg-surface-elevated text-text-secondary hover:text-text-primary border border-border-subtle'
          }`}
        >
          All Concepts ({TOPICS.length})
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-brand text-white'
                : 'bg-surface-elevated text-text-secondary hover:text-text-primary border border-border-subtle'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Graph View / Accessible List View */}
      {viewMode === 'graph' ? (
        <div className="relative bg-tech-grid overflow-x-auto p-4 sm:p-6">
          <div className="min-w-[1080px] h-[460px] relative select-none">
            {/* SVG Link Layer */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ overflow: 'visible' }}
            >
              <defs>
                <marker
                  id="map-arrowhead"
                  markerWidth="8"
                  markerHeight="6"
                  refX="8"
                  refY="3"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 8 3, 0 6"
                    className="fill-border-strong dark:fill-border-active transition-colors"
                  />
                </marker>
                <marker
                  id="map-arrowhead-active"
                  markerWidth="9"
                  markerHeight="6"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 9 3, 0 6" fill="var(--brand-primary)" />
                </marker>
              </defs>

              {/* Render edges */}
              {TOPIC_EDGES.map((edge) => {
                const sourceNode = TOPICS.find((t) => t.id === edge.source);
                const targetNode = TOPICS.find((t) => t.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const isConnected =
                  edge.source === activeTopic.id || edge.target === activeTopic.id;
                const isPrereqOfActive = edge.target === activeTopic.id;
                const isNextOfActive = edge.source === activeTopic.id;

                // Center coordinates
                const x1 = sourceNode.x + 85;
                const y1 = sourceNode.y + 35;
                const x2 = targetNode.x + 85;
                const y2 = targetNode.y + 35;

                // Subtle cubic bezier curves
                const dx = x2 - x1;
                const dy = y2 - y1;
                const cx1 = x1 + dx * 0.5;
                const cy1 = y1;
                const cx2 = x1 + dx * 0.5;
                const cy2 = y2;
                const pathD = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

                return (
                  <g key={edge.id}>
                    <path
                      d={pathD}
                      fill="none"
                      stroke={
                        isConnected
                          ? 'var(--brand-primary)'
                          : 'var(--border-subtle)'
                      }
                      strokeWidth={isConnected ? 2.5 : 1.25}
                      strokeDasharray={
                        edge.relationshipType === 'commonly-used-with' ? '4 3' : undefined
                      }
                      markerEnd={
                        isConnected
                          ? 'url(#map-arrowhead-active)'
                          : 'url(#map-arrowhead)'
                      }
                      className="transition-all duration-300"
                    />
                    {isConnected && edge.label && (
                      <text
                        x={(x1 + x2) / 2}
                        y={(y1 + y2) / 2 - 6}
                        textAnchor="middle"
                        className="font-mono text-[9px] fill-text-muted bg-surface px-1 select-none"
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Render Nodes */}
            {TOPICS.map((topic) => {
              const isSelected = topic.id === activeTopic.id;
              const isPrereq = activeTopic.prerequisites.includes(topic.id);
              const isNext = activeTopic.nextTopics.includes(topic.id);
              const isHovered = topic.id === hoveredTopicId;
              const isDimmed =
                (selectedCategory !== 'all' && topic.category !== selectedCategory) ||
                (searchQuery &&
                  !topic.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                  !topic.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()));

              return (
                <div
                  key={topic.id}
                  style={{
                    left: `${topic.x}px`,
                    top: `${topic.y}px`,
                    width: '170px'
                  }}
                  onClick={() => setSelectedTopicId(topic.id)}
                  onMouseEnter={() => setHoveredTopicId(topic.id)}
                  onMouseLeave={() => setHoveredTopicId(null)}
                  className={`absolute rounded-lg border p-3 cursor-pointer transition-all duration-200 z-10 ${
                    isSelected
                      ? 'border-brand bg-brand-subtle ring-2 ring-brand/40 shadow-lg scale-105 z-20'
                      : isPrereq
                      ? 'border-emerald-500/50 bg-emerald-500/5 hover:border-emerald-500'
                      : isNext
                      ? 'border-sky-500/50 bg-sky-500/5 hover:border-sky-500'
                      : 'border-border-subtle bg-surface hover:border-border-strong hover:bg-surface-elevated'
                  } ${isDimmed ? 'opacity-30' : 'opacity-100'}`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedTopicId(topic.id);
                    }
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[9px] text-text-muted uppercase">
                      {topic.difficulty}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
                    )}
                    {isPrereq && (
                      <span className="font-mono text-[8px] text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded border border-emerald-500/20 font-semibold">
                        PREREQ
                      </span>
                    )}
                    {isNext && (
                      <span className="font-mono text-[8px] text-sky-400 bg-sky-500/10 px-1 py-0.2 rounded border border-sky-500/20 font-semibold">
                        UNLOCKS
                      </span>
                    )}
                  </div>

                  <h4 className="font-technical text-xs font-bold text-text-primary line-clamp-1 mb-1">
                    {topic.title}
                  </h4>

                  <p className="text-[10px] text-text-secondary line-clamp-2 leading-snug">
                    {topic.shortDescription}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Accessible List View Alternative (Meets Section 14 & Section 7 Accessibility Requirements) */
        <div className="p-4 sm:p-6 divide-y divide-border-subtle max-h-[500px] overflow-y-auto">
          {filteredTopics.map((topic) => {
            const isSelected = topic.id === activeTopic.id;
            return (
              <div
                key={topic.id}
                onClick={() => setSelectedTopicId(topic.id)}
                className={`py-3 px-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-brand-subtle border-l-4 border-brand'
                    : 'hover:bg-surface-elevated'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface-elevated border border-border-subtle text-text-muted">
                      {topic.categoryLabel}
                    </span>
                    <span className="font-mono text-[10px] font-semibold text-text-secondary">
                      {topic.difficulty.toUpperCase()}
                    </span>
                    {topic.status === 'published' && (
                      <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        GUIDE AVAILABLE
                      </span>
                    )}
                  </div>
                  <h4 className="font-editorial text-base font-bold text-text-primary">
                    {topic.title}
                  </h4>
                  <p className="text-xs text-text-secondary font-technical max-w-2xl">
                    {topic.shortDescription}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTopicId(topic.id);
                    }}
                    className="px-3 py-1.5 rounded bg-surface border border-border-subtle text-xs font-mono text-text-primary hover:border-brand transition-colors"
                  >
                    Inspect Invariants
                  </button>
                  {topic.articleUrl && (
                    <a
                      href={formatPath(topic.articleUrl)}
                      className="px-3 py-1.5 rounded bg-brand text-white text-xs font-mono font-medium hover:bg-brand-hover transition-colors"
                    >
                      Read Guide
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Topic Detail Drawer / Inspection Panel */}
      <div className="p-5 sm:p-6 border-t border-border-strong bg-surface-elevated/80">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-brand uppercase tracking-wider">
                SELECTED CONCEPT:
              </span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface border border-border-subtle text-text-muted">
                {activeTopic.categoryLabel}
              </span>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-surface border border-border-subtle text-text-secondary">
                {activeTopic.difficulty}
              </span>
              {activeTopic.status === 'published' ? (
                <span className="font-mono text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
                  PUBLISHED GUIDE
                </span>
              ) : (
                <span className="font-mono text-[11px] text-text-muted bg-surface px-2 py-0.5 rounded border border-border-subtle">
                  ROADMAP TOPIC
                </span>
              )}
            </div>

            <h4 className="font-editorial text-2xl font-bold text-text-primary">
              {activeTopic.title}
            </h4>

            <p className="text-sm text-text-secondary font-technical leading-relaxed max-w-3xl">
              {activeTopic.detailedDescription}
            </p>
          </div>

          {activeTopic.articleUrl && (
            <div className="flex-shrink-0 self-start">
              <a
                href={formatPath(activeTopic.articleUrl)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-brand text-white font-mono text-xs font-semibold hover:bg-brand-hover shadow-sm transition-all"
              >
                <span>Read Technical Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Prerequisites & Unlocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-5 border-t border-border-subtle">
          {/* Prerequisites */}
          <div className="p-4 rounded-lg bg-surface border border-border-subtle space-y-2">
            <div className="font-mono text-xs font-semibold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Learn First (Prerequisites)</span>
            </div>
            {prerequisiteTopics.length > 0 ? (
              <div className="space-y-1.5">
                {prerequisiteTopics.map((pre) => (
                  <button
                    key={pre.id}
                    type="button"
                    onClick={() => setSelectedTopicId(pre.id)}
                    className="w-full text-left p-2 rounded hover:bg-surface-elevated border border-transparent hover:border-border-subtle transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-technical text-xs font-bold text-text-primary group-hover:text-brand">
                        {pre.title}
                      </div>
                      <div className="text-[11px] text-text-muted line-clamp-1">
                        {pre.shortDescription}
                      </div>
                    </div>
                    <ArrowRight className="w-3 h-3 text-text-muted group-hover:text-brand group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-muted italic">
                None. This is an entry-level root concept.
              </p>
            )}
          </div>

          {/* Unlocks / Next Concepts */}
          <div className="p-4 rounded-lg bg-surface border border-border-subtle space-y-2">
            <div className="font-mono text-xs font-semibold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand" />
              <span>Unlocks Next (Dependent Concepts)</span>
            </div>
            {nextTopics.length > 0 ? (
              <div className="space-y-1.5">
                {nextTopics.map((next) => (
                  <button
                    key={next.id}
                    type="button"
                    onClick={() => setSelectedTopicId(next.id)}
                    className="w-full text-left p-2 rounded hover:bg-surface-elevated border border-transparent hover:border-border-subtle transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-technical text-xs font-bold text-text-primary group-hover:text-brand">
                        {next.title}
                      </div>
                      <div className="text-[11px] text-text-muted line-clamp-1">
                        {next.shortDescription}
                      </div>
                    </div>
                    <ArrowRight className="w-3 h-3 text-text-muted group-hover:text-brand group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-muted italic">
                Terminal advanced architectural node.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
