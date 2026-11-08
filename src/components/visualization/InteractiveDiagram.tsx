import React, { useState } from 'react';
import type { DiagramData, DiagramNode } from '@/types/visualization';
import ComponentInspector from './ComponentInspector';
import { ArrowRight, Server, Globe, Cpu, Database, Network } from 'lucide-react';

interface Props {
  data: DiagramData;
}

export default function InteractiveDiagram({ data }: Props) {
  const [selectedNode, setSelectedNode] = useState<DiagramNode | null>(null);

  const getNodeIcon = (type?: string) => {
    switch (type) {
      case 'client':
        return <Globe className="w-4 h-4 text-brand" />;
      case 'gateway':
        return <Network className="w-4 h-4 text-purple-400" />;
      case 'service':
        return <Cpu className="w-4 h-4 text-emerald-400" />;
      case 'cache':
      case 'database':
        return <Database className="w-4 h-4 text-amber-400" />;
      default:
        return <Server className="w-4 h-4 text-text-secondary" />;
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-4 select-none">
      {/* Diagram Nodes Layout */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 w-full max-w-2xl">
        {data.nodes.map((node, idx) => {
          const isSelected = selectedNode?.id === node.id;
          const isLast = idx === data.nodes.length - 1;

          return (
            <React.Fragment key={node.id}>
              {/* Interactive Node Card */}
              <button
                type="button"
                onClick={() => setSelectedNode(node)}
                className={`flex flex-col items-center p-3.5 rounded-lg border text-center transition-all cursor-pointer min-w-[140px] ${
                  isSelected
                    ? 'border-brand bg-brand-subtle ring-2 ring-brand/30 shadow-md scale-105'
                    : 'border-border-strong bg-surface hover:border-brand/60 hover:bg-surface-elevated'
                }`}
                aria-label={`Inspect ${node.label}`}
              >
                <div className="p-2 rounded-md bg-surface-elevated mb-2 border border-border-subtle">
                  {getNodeIcon(node.type)}
                </div>
                <span className="font-technical text-xs font-semibold text-text-primary mb-0.5 line-clamp-1">
                  {node.label}
                </span>
                <span className="font-mono text-[10px] text-text-muted">
                  [Click to inspect]
                </span>
              </button>

              {/* Connection Arrow between nodes */}
              {!isLast && (
                <div className="flex flex-col items-center justify-center text-text-muted">
                  <ArrowRight className="w-4 h-4 text-text-muted hidden md:block" />
                  <span className="text-[10px] font-mono mt-1 text-text-muted hidden md:block">
                    {data.connections[idx]?.label || 'TCP/IP'}
                  </span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Component Inspector Drawer */}
      <ComponentInspector
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
}
