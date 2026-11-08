import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Info,
  Clock,
  ArrowRight,
  Layers,
  Sparkles,
  Eye,
  Sliders,
  CheckCircle2,
  X
} from 'lucide-react';
import type { DiagramData, DiagramNode, ArchitectureFlowStep } from '@/types/visualization';
import { ArchitectureNode, getNodeIcon } from './NodePrimitives';

interface Props {
  data: DiagramData;
  className?: string;
}

export const ArchitectureFlowPlayer: React.FC<Props> = ({ data, className = '' }) => {
  const steps = data.flowSteps || [];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [selectedNode, setSelectedNode] = useState<DiagramNode | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Timer loop for auto playback
  useEffect(() => {
    if (!isPlaying || steps.length <= 1) return;

    const baseDelay = 3500;
    const interval = setTimeout(() => {
      setCurrentStepIndex((prev) => (prev + 1) % steps.length);
    }, baseDelay / speedMultiplier);

    return () => clearTimeout(interval);
  }, [isPlaying, currentStepIndex, speedMultiplier, steps.length]);

  const activeStep: ArchitectureFlowStep | undefined = steps[currentStepIndex];

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => (prev + 1) % steps.length);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => (prev - 1 + steps.length) % steps.length);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setSelectedNode(null);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      setIsPlaying((prev) => !prev);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    }
  };

  const activeSourceId = activeStep?.sourceNodeId;
  const activeTargetId = activeStep?.targetNodeId;

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`rounded-lg border border-border-subtle bg-surface overflow-hidden glow-card focus:outline-none focus:ring-1 focus:ring-brand/40 ${className}`}
    >
      {/* Diagram Top Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-border-subtle bg-surface-elevated/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-brand uppercase font-bold tracking-wider">
              INTERACTIVE ARCHITECTURE FLOW
            </span>
            {steps.length > 0 && (
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface border border-border-subtle text-text-muted">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
            )}
          </div>
          <h3 className="font-editorial text-lg sm:text-xl font-bold text-text-primary mt-0.5">
            {data.title}
          </h3>
          {data.caption && (
            <p className="text-xs text-text-secondary mt-0.5 font-technical">
              {data.caption}
            </p>
          )}
        </div>

        {/* Stepper Toolbar */}
        {steps.length > 0 && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              aria-label="Previous Step"
              className="p-1.5 rounded-md border border-border-subtle bg-surface hover:bg-surface-elevated disabled:opacity-40 transition-colors text-text-primary"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              aria-label={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-brand text-white text-xs font-mono font-semibold hover:bg-brand-hover transition-colors shadow-sm"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Play</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentStepIndex === steps.length - 1}
              aria-label="Next Step"
              className="p-1.5 rounded-md border border-border-subtle bg-surface hover:bg-surface-elevated disabled:opacity-40 transition-colors text-text-primary"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleReset}
              aria-label="Reset Workflow"
              className="p-1.5 rounded-md border border-border-subtle bg-surface hover:bg-surface-elevated transition-colors text-text-secondary hover:text-text-primary"
              title="Reset to initial state"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-border-subtle font-mono text-[10px]">
              <span className="text-text-muted">Speed:</span>
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpeedMultiplier(s)}
                  className={`px-1.5 py-0.5 rounded ${
                    speedMultiplier === s
                      ? 'bg-brand text-white font-bold'
                      : 'text-text-secondary hover:bg-surface-elevated'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Visual Stage */}
      <div className="p-6 relative bg-canvas/60">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.nodes.map((node) => {
            const isSource = activeSourceId === node.id;
            const isTarget = activeTargetId === node.id;
            const isSelected = selectedNode?.id === node.id;

            return (
              <ArchitectureNode
                key={node.id}
                id={node.id}
                label={node.label}
                type={node.type}
                subtitle={node.subtitle}
                status={node.status || 'operational'}
                isSelected={isSelected}
                isActive={isSource || isTarget}
                onClick={() => setSelectedNode(node)}
              />
            );
          })}
        </div>

        {/* Directed Connections Display */}
        <div className="mt-6 pt-4 border-t border-border-subtle/80 flex flex-wrap items-center gap-3 text-xs font-mono">
          <span className="text-text-muted">Active Ingress Paths:</span>
          {data.connections.map((conn, idx) => {
            const isConnActive =
              activeSourceId === conn.from && activeTargetId === conn.to;
            return (
              <div
                key={idx}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded border text-[11px] transition-colors ${
                  isConnActive
                    ? 'border-brand bg-brand-subtle text-brand font-bold'
                    : 'border-border-subtle bg-surface text-text-secondary'
                }`}
              >
                <span>{conn.from}</span>
                <ArrowRight className="w-3 h-3 text-text-muted" />
                <span>{conn.to}</span>
                {conn.label && (
                  <span className="text-[10px] text-text-muted">({conn.label})</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Explanation Card (Answers the 5 Fundamental Questions) */}
      {activeStep && (
        <div className="p-4 sm:p-5 border-t border-border-subtle bg-surface-elevated/20">
          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand text-white">
                  Step {activeStep.step}
                </span>
                <h4 className="font-editorial text-base sm:text-lg font-bold text-text-primary">
                  {activeStep.title}
                </h4>
                {activeStep.latencyEstimate && (
                  <span className="font-mono text-[11px] text-text-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {activeStep.latencyEstimate}
                  </span>
                )}
              </div>

              {/* 5 Invariant Answers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-technical">
                <div className="p-2.5 rounded bg-surface border border-border-subtle">
                  <span className="font-mono text-[10px] text-brand font-bold uppercase block mb-1">
                    What is moving & Path
                  </span>
                  <div className="text-text-primary font-medium">
                    {activeStep.whatIsMoving}
                  </div>
                  <div className="text-[11px] font-mono text-text-muted mt-1 flex items-center gap-1">
                    <span>{activeStep.sourceNodeId}</span>
                    <ArrowRight className="w-3 h-3 text-brand" />
                    <span>{activeStep.targetNodeId}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-surface border border-border-subtle">
                  <span className="font-mono text-[10px] text-brand font-bold uppercase block mb-1">
                    State Change upon Arrival
                  </span>
                  <div className="text-text-primary">
                    {activeStep.stateChanges}
                  </div>
                </div>
              </div>

              <div className="text-xs text-text-secondary leading-relaxed font-technical pt-1">
                <strong className="text-text-primary">Why it moves:</strong> {activeStep.whyItMoves}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Node Inspection Slideout/Drawer */}
      {selectedNode && (
        <div className="p-4 sm:p-5 border-t border-brand/30 bg-surface-elevated/80 flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-surface border border-border-subtle">
                {getNodeIcon(selectedNode.type)}
              </div>
              <h4 className="font-editorial text-base font-bold text-text-primary">
                {selectedNode.label}
              </h4>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface border border-border-subtle text-brand uppercase font-bold">
                {selectedNode.type}
              </span>
            </div>

            {selectedNode.description && (
              <p className="text-xs text-text-secondary leading-relaxed font-technical max-w-2xl">
                {selectedNode.description}
              </p>
            )}

            {selectedNode.metrics && Object.keys(selectedNode.metrics).length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {Object.entries(selectedNode.metrics).map(([k, v]) => (
                  <div
                    key={k}
                    className="px-2.5 py-1 rounded bg-surface border border-border-subtle font-mono text-[11px]"
                  >
                    <span className="text-text-muted">{k}: </span>
                    <span className="text-text-primary font-bold">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setSelectedNode(null)}
            aria-label="Close Inspection"
            className="p-1.5 rounded-md hover:bg-surface text-text-secondary hover:text-text-primary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
