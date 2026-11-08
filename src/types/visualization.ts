export interface DiagramNode {
  id: string;
  label: string;
  type?: 'client' | 'gateway' | 'service' | 'cache' | 'database' | 'queue';
  description?: string;
  status?: 'operational' | 'degraded' | 'failed';
  metrics?: Record<string, string | number>;
}

export interface DiagramConnection {
  from: string;
  to: string;
  label?: string;
  protocol?: string;
  isAnimated?: boolean;
}

export interface DiagramData {
  title: string;
  caption?: string;
  nodes: DiagramNode[];
  connections: DiagramConnection[];
}
