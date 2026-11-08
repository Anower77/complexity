import React from 'react';
import type { DiagramNode } from '@/types/visualization';
import { X, Server } from 'lucide-react';

interface Props {
  node: DiagramNode | null;
  onClose: () => void;
}

export default function ComponentInspector({ node, onClose }: Props) {
  if (!node) return null;

  return (
    <div className="absolute top-4 right-4 z-20 w-72 rounded-lg border border-border-strong bg-surface/95 backdrop-blur-md p-4 shadow-lg text-xs animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center justify-between border-b border-border-subtle pb-2 mb-3">
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-brand">
          <Server className="w-3.5 h-3.5" />
          <span>INSPECTOR</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-text-muted hover:text-text-primary p-0.5 rounded transition-colors"
          aria-label="Close inspector"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mb-2">
        <h4 className="font-technical text-sm font-bold text-text-primary mb-1">
          {node.label}
        </h4>
        {node.type && (
          <span className="inline-block px-1.5 py-0.5 font-mono text-[10px] uppercase rounded bg-surface-elevated border border-border-subtle text-text-muted">
            Role: {node.type}
          </span>
        )}
      </div>

      {node.description && (
        <p className="text-text-secondary leading-relaxed mb-3 text-[11px]">
          {node.description}
        </p>
      )}

      {node.metrics && Object.keys(node.metrics).length > 0 && (
        <div className="border-t border-border-subtle pt-2 mt-2">
          <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider block mb-1.5">
            Internal State & Metrics
          </span>
          <div className="space-y-1 font-mono text-[11px]">
            {Object.entries(node.metrics).map(([key, val]) => (
              <div key={key} className="flex justify-between text-text-secondary">
                <span className="text-text-muted">{key}:</span>
                <span className="text-text-primary font-medium">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
