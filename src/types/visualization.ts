export type ArchitectureNodeType =
  | 'client'
  | 'browser'
  | 'gateway'
  | 'loadbalancer'
  | 'server'
  | 'service'
  | 'database'
  | 'cache'
  | 'queue'
  | 'container'
  | 'pod'
  | 'cloud'
  | 'boundary';

export interface DiagramNode {
  id: string;
  label: string;
  type?: ArchitectureNodeType;
  subtitle?: string;
  description?: string;
  status?: 'operational' | 'degraded' | 'failed' | 'idle';
  metrics?: Record<string, string | number>;
  x?: number;
  y?: number;
}

export interface DiagramConnection {
  from: string;
  to: string;
  label?: string;
  protocol?: string;
  isAnimated?: boolean;
  style?: 'solid' | 'dashed';
}

export interface ArchitectureFlowStep {
  step: number;
  title: string;
  whatIsMoving: string;
  sourceNodeId: string;
  targetNodeId: string;
  whyItMoves: string;
  stateChanges: string;
  latencyEstimate?: string;
  statusBadge?: string;
}

export interface DiagramData {
  title: string;
  caption?: string;
  nodes: DiagramNode[];
  connections: DiagramConnection[];
  flowSteps?: ArchitectureFlowStep[];
}

export interface EngineDiagramSpec extends DiagramData {
  id: string;
  description: string;
}
