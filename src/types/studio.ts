export type StudioTool =
  | 'select'
  | 'pan'
  | 'rectangle'
  | 'rounded-rect'
  | 'ellipse'
  | 'diamond'
  | 'arrow'
  | 'line'
  | 'text'
  | 'pencil'
  | 'eraser'
  // Engineering shapes
  | 'client'
  | 'browser'
  | 'gateway'
  | 'loadbalancer'
  | 'server'
  | 'database'
  | 'cache'
  | 'queue'
  | 'microservice'
  | 'container'
  | 'pod'
  | 'cloud'
  | 'boundary';

export type StrokeStyle = 'solid' | 'dashed' | 'dotted';

export interface StudioElement {
  id: string;
  type: StudioTool;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  strokeStyle: StrokeStyle;
  opacity: number;
  fontSize: number;
  textAlign: 'left' | 'center' | 'right';
  points?: { x: number; y: number }[]; // For freehand pencil or connectors
  sourceId?: string;
  targetId?: string;
}

export interface DiagramDocument {
  version: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  elements: StudioElement[];
  viewState?: {
    pan: { x: number; y: number };
    zoom: number;
  };
}

export interface ArchitectureTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  elements: StudioElement[];
}
