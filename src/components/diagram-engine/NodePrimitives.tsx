import React from 'react';
import {
  Laptop,
  Globe,
  Shield,
  Layers,
  Server,
  Database,
  Zap,
  Cpu,
  Box,
  Cloud
} from 'lucide-react';
import type { ArchitectureNodeType } from '@/types/visualization';

interface NodePrimitiveProps {
  id: string;
  label: string;
  type?: ArchitectureNodeType;
  subtitle?: string;
  status?: 'operational' | 'degraded' | 'failed' | 'idle';
  isSelected?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function getNodeIcon(type?: ArchitectureNodeType) {
  switch (type) {
    case 'client':
    case 'browser':
      return <Laptop className="w-4 h-4 text-sky-500" />;
    case 'gateway':
      return <Globe className="w-4 h-4 text-emerald-500" />;
    case 'loadbalancer':
      return <Shield className="w-4 h-4 text-blue-500" />;
    case 'service':
    case 'server':
      return <Server className="w-4 h-4 text-indigo-500" />;
    case 'database':
      return <Database className="w-4 h-4 text-amber-500" />;
    case 'cache':
      return <Zap className="w-4 h-4 text-orange-500" />;
    case 'queue':
      return <Layers className="w-4 h-4 text-purple-500" />;
    case 'container':
      return <Box className="w-4 h-4 text-cyan-500" />;
    case 'pod':
      return <Cpu className="w-4 h-4 text-teal-500" />;
    case 'cloud':
      return <Cloud className="w-4 h-4 text-blue-400" />;
    default:
      return <Server className="w-4 h-4 text-text-muted" />;
  }
}

export const ArchitectureNode: React.FC<NodePrimitiveProps> = ({
  id,
  label,
  type = 'server',
  subtitle,
  status = 'operational',
  isSelected = false,
  isActive = false,
  onClick,
  className = ''
}) => {
  const getBorderColor = () => {
    if (isSelected) return 'border-brand ring-2 ring-brand/30 shadow-md';
    if (isActive) return 'border-brand ring-2 ring-brand/40 shadow-sm animate-pulse';
    return 'border-border-subtle hover:border-brand/40';
  };

  const getStatusColor = () => {
    switch (status) {
      case 'operational':
        return 'bg-emerald-500';
      case 'degraded':
        return 'bg-amber-500';
      case 'failed':
        return 'bg-rose-500';
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Inspect ${label}`}
      className={`relative text-left p-3 rounded-lg border bg-surface transition-all flex flex-col justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${getBorderColor()} ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1 rounded bg-surface-elevated flex-shrink-0">
            {getNodeIcon(type)}
          </div>
          <span className="font-technical text-xs font-bold text-text-primary truncate">
            {label}
          </span>
        </div>
        <span
          className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor()}`}
          title={`Status: ${status}`}
        />
      </div>

      {subtitle && (
        <span className="font-mono text-[10px] text-text-muted truncate">
          {subtitle}
        </span>
      )}
    </button>
  );
};
