import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MousePointer,
  Hand,
  Square,
  Circle,
  Diamond,
  ArrowRight,
  Minus,
  Type,
  Pencil,
  Trash2,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Upload,
  FileJson,
  FileImage,
  Code,
  Grid,
  Check,
  ChevronDown,
  Layers,
  Laptop,
  Globe,
  Shield,
  Server,
  Database,
  Zap,
  Box,
  Cpu,
  Cloud,
  Copy,
  FolderOpen,
  HelpCircle,
  Sun,
  Moon,
  RotateCcw
} from 'lucide-react';
import type { StudioTool, StudioElement, DiagramDocument, StrokeStyle } from '@/types/studio';
import { STUDIO_TEMPLATES } from './studio-templates';

const COLOR_PALETTE = [
  { name: 'Transparent', value: 'transparent', border: '#cbd5e1' },
  { name: 'Paper White', value: '#ffffff', border: '#e2e8f0' },
  { name: 'Architectural Blue', value: '#eff6ff', border: '#3b82f6' },
  { name: 'Mint Emerald', value: '#ecfdf5', border: '#10b981' },
  { name: 'Amber Gold', value: '#fefce8', border: '#eab308' },
  { name: 'Warm Orange', value: '#fff7ed', border: '#f97316' },
  { name: 'Soft Purple', value: '#faf5ff', border: '#8b5cf6' },
  { name: 'Rose Red', value: '#fff1f2', border: '#f43f5e' },
  { name: 'Obsidian Slate', value: '#1e2938', border: '#475569' }
];

const STROKE_COLORS = [
  '#172033',
  '#315e8a',
  '#397c78',
  '#10b981',
  '#eab308',
  '#f97316',
  '#8b5cf6',
  '#ef4444',
  '#94a3b8'
];

export const DiagramStudio: React.FC = () => {
  // Document state
  const [diagramName, setDiagramName] = useState('Production Architecture');
  const [elements, setElements] = useState<StudioElement[]>(() => {
    return STUDIO_TEMPLATES[0].elements;
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTool, setActiveTool] = useState<StudioTool>('select');

  // History stack for Undo/Redo
  const [history, setHistory] = useState<StudioElement[][]>([]);
  const [future, setFuture] = useState<StudioElement[][]>([]);

  // Canvas viewport state
  const [pan, setPan] = useState({ x: 40, y: 40 });
  const [zoom, setZoom] = useState(1);
  const [gridType, setGridType] = useState<'dot' | 'line' | 'none'>('dot');
  const [snapToGrid, setSnapToGrid] = useState(true);

  // UI Modals / dropdowns
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('Saved locally');

  // Interaction references
  const canvasRef = useRef<SVGSVGElement | null>(null);
  const isDraggingRef = useRef(false);
  const isPanningRef = useRef(false);
  const startDragPosRef = useRef({ x: 0, y: 0 });
  const elementStartPosRef = useRef<Map<string, { x: number; y: number }>>(new Map());
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load from local storage draft on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('complexity_diagram_draft');
      if (saved) {
        const parsed: DiagramDocument = JSON.parse(saved);
        if (parsed.elements && Array.isArray(parsed.elements)) {
          setElements(parsed.elements);
          if (parsed.name) setDiagramName(parsed.name);
          if (parsed.viewState) {
            setPan(parsed.viewState.pan || { x: 40, y: 40 });
            setZoom(parsed.viewState.zoom || 1);
          }
          setSaveStatus('Restored draft');
        }
      }
    } catch (e) {
      console.warn('Could not restore local diagram draft:', e);
    }
  }, []);

  // Auto-save draft changes to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const doc: DiagramDocument = {
          version: '1.0.4',
          name: diagramName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          elements,
          viewState: { pan, zoom }
        };
        localStorage.setItem('complexity_diagram_draft', JSON.stringify(doc));
        setSaveStatus('Saved locally');
      } catch (e) {
        setSaveStatus('Storage full');
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [elements, diagramName, pan, zoom]);

  // Push state to history before modifying elements
  const pushHistory = useCallback(() => {
    setHistory((prev) => [...prev.slice(-30), elements]);
    setFuture([]);
  }, [elements]);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setFuture((prev) => [elements, ...prev]);
    setHistory((prev) => prev.slice(0, -1));
    setElements(previous);
    setSelectedIds([]);
  }, [history, elements]);

  const handleRedo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setHistory((prev) => [...prev, elements]);
    setFuture((prev) => prev.slice(1));
    setElements(next);
  }, [future, elements]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedIds.length > 0) {
          e.preventDefault();
          pushHistory();
          setElements((prev) => prev.filter((el) => !selectedIds.includes(el.id)));
          setSelectedIds([]);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        handleDuplicate();
      } else if (e.key === 'v') {
        setActiveTool('select');
      } else if (e.key === 'h') {
        setActiveTool('pan');
      } else if (e.key === 'r') {
        setActiveTool('rectangle');
      } else if (e.key === 't') {
        setActiveTool('text');
      } else if (e.key === 'a') {
        setActiveTool('arrow');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds, handleUndo, handleRedo, pushHistory]);

  const handleDuplicate = () => {
    if (selectedIds.length === 0) return;
    pushHistory();
    const newElements: StudioElement[] = [];
    const newSelectedIds: string[] = [];

    elements.forEach((el) => {
      if (selectedIds.includes(el.id)) {
        const copy: StudioElement = {
          ...el,
          id: `elem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          x: el.x + 30,
          y: el.y + 30
        };
        newElements.push(copy);
        newSelectedIds.push(copy.id);
      }
    });

    setElements((prev) => [...prev, ...newElements]);
    setSelectedIds(newSelectedIds);
  };

  const handleDelete = () => {
    if (selectedIds.length === 0) return;
    pushHistory();
    setElements((prev) => prev.filter((el) => !selectedIds.includes(el.id)));
    setSelectedIds([]);
  };

  // Canvas Coordinate Mapping
  const getCanvasCoords = (e: React.MouseEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const rawX = (e.clientX - rect.left - pan.x) / zoom;
    const rawY = (e.clientY - rect.top - pan.y) / zoom;

    if (snapToGrid) {
      const snap = 10;
      return {
        x: Math.round(rawX / snap) * snap,
        y: Math.round(rawY / snap) * snap
      };
    }
    return { x: Math.round(rawX), y: Math.round(rawY) };
  };

  // Add a new element when clicking canvas with a creation tool active
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || activeTool === 'pan') {
      // Middle click or Pan tool
      isPanningRef.current = true;
      startDragPosRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
      return;
    }

    const { x, y } = getCanvasCoords(e);

    if (activeTool !== 'select') {
      pushHistory();
      const newId = `elem-${Date.now()}`;
      let newElem: StudioElement;

      const base = {
        id: newId,
        x,
        y,
        strokeColor: '#315e8a',
        strokeWidth: 2,
        strokeStyle: 'solid' as StrokeStyle,
        opacity: 1,
        fontSize: 12,
        textAlign: 'center' as const
      };

      switch (activeTool) {
        case 'rectangle':
        case 'rounded-rect':
          newElem = {
            ...base,
            type: activeTool,
            width: 140,
            height: 70,
            label: 'Process Block',
            fillColor: '#eff6ff'
          };
          break;
        case 'ellipse':
          newElem = {
            ...base,
            type: 'ellipse',
            width: 100,
            height: 100,
            label: 'State Node',
            fillColor: '#ecfdf5'
          };
          break;
        case 'diamond':
          newElem = {
            ...base,
            type: 'diamond',
            width: 110,
            height: 80,
            label: 'Decision',
            fillColor: '#fefce8'
          };
          break;
        case 'arrow':
          newElem = {
            ...base,
            type: 'arrow',
            width: 100,
            height: 0,
            label: 'Connect',
            fillColor: 'transparent'
          };
          break;
        case 'line':
          newElem = {
            ...base,
            type: 'line',
            width: 100,
            height: 0,
            label: '',
            fillColor: 'transparent'
          };
          break;
        case 'text':
          newElem = {
            ...base,
            type: 'text',
            width: 150,
            height: 40,
            label: 'Architecture Annotation',
            fillColor: 'transparent',
            strokeWidth: 0,
            fontSize: 14,
            textAlign: 'left'
          };
          break;
        case 'client':
        case 'browser':
          newElem = {
            ...base,
            type: activeTool,
            width: 140,
            height: 65,
            label: 'Client Browser\n(HTTPS Client)',
            fillColor: '#eff6ff',
            strokeColor: '#2563eb'
          };
          break;
        case 'gateway':
          newElem = {
            ...base,
            type: 'gateway',
            width: 150,
            height: 70,
            label: 'API Gateway\n(0.0.0.0:443)',
            fillColor: '#ecfdf5',
            strokeColor: '#059669'
          };
          break;
        case 'loadbalancer':
          newElem = {
            ...base,
            type: 'loadbalancer',
            width: 160,
            height: 70,
            label: 'Load Balancer\n(Layer 4 / NLB)',
            fillColor: '#eff6ff',
            strokeColor: '#3b82f6'
          };
          break;
        case 'server':
        case 'microservice':
          newElem = {
            ...base,
            type: activeTool,
            width: 150,
            height: 70,
            label: 'Application Server\n(FastAPI / 8000)',
            fillColor: '#faf5ff',
            strokeColor: '#7c3aed'
          };
          break;
        case 'database':
          newElem = {
            ...base,
            type: 'database',
            width: 150,
            height: 75,
            label: 'PostgreSQL DB\n(WAL / B-Tree)',
            fillColor: '#fefce8',
            strokeColor: '#ca8a04'
          };
          break;
        case 'cache':
          newElem = {
            ...base,
            type: 'cache',
            width: 140,
            height: 65,
            label: 'Redis Cache\n(In-Memory RAM)',
            fillColor: '#fff7ed',
            strokeColor: '#ea580c'
          };
          break;
        case 'queue':
          newElem = {
            ...base,
            type: 'queue',
            width: 150,
            height: 70,
            label: 'Kafka Broker\n(Partitioned Topic)',
            fillColor: '#fdf4ff',
            strokeColor: '#c026d3'
          };
          break;
        case 'pod':
        case 'container':
          newElem = {
            ...base,
            type: activeTool,
            width: 140,
            height: 65,
            label: 'Kubernetes Pod\n(IP: 10.244.1.5)',
            fillColor: '#f0fdfa',
            strokeColor: '#0d9488'
          };
          break;
        case 'cloud':
        case 'boundary':
          newElem = {
            ...base,
            type: activeTool,
            width: 280,
            height: 200,
            label: 'Virtual Private Cloud (VPC)',
            fillColor: 'transparent',
            strokeColor: '#94a3b8',
            strokeStyle: 'dashed',
            strokeWidth: 1.5,
            fontSize: 11,
            textAlign: 'left'
          };
          break;
        default:
          return;
      }

      setElements((prev) => [...prev, newElem]);
      setSelectedIds([newId]);
      setActiveTool('select');
    } else {
      // Clicking empty canvas in Select mode clears selection
      setSelectedIds([]);
    }
  };

  const handleElementMouseDown = (e: React.MouseEvent, elemId: string) => {
    e.stopPropagation();

    if (activeTool === 'eraser') {
      pushHistory();
      setElements((prev) => prev.filter((el) => el.id !== elemId));
      setSelectedIds([]);
      return;
    }

    if (activeTool === 'select') {
      if (e.shiftKey) {
        setSelectedIds((prev) =>
          prev.includes(elemId) ? prev.filter((id) => id !== elemId) : [...prev, elemId]
        );
      } else if (!selectedIds.includes(elemId)) {
        setSelectedIds([elemId]);
      }

      // Record start position for dragging
      isDraggingRef.current = true;
      startDragPosRef.current = { x: e.clientX, y: e.clientY };
      const posMap = new Map<string, { x: number; y: number }>();
      elements.forEach((el) => {
        posMap.set(el.id, { x: el.x, y: el.y });
      });
      elementStartPosRef.current = posMap;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanningRef.current) {
      setPan({
        x: e.clientX - startDragPosRef.current.x,
        y: e.clientY - startDragPosRef.current.y
      });
      return;
    }

    if (isDraggingRef.current && selectedIds.length > 0) {
      const dx = (e.clientX - startDragPosRef.current.x) / zoom;
      const dy = (e.clientY - startDragPosRef.current.y) / zoom;

      setElements((prev) =>
        prev.map((el) => {
          if (!selectedIds.includes(el.id)) return el;
          const orig = elementStartPosRef.current.get(el.id);
          if (!orig) return el;

          let targetX = orig.x + dx;
          let targetY = orig.y + dy;

          if (snapToGrid) {
            targetX = Math.round(targetX / 10) * 10;
            targetY = Math.round(targetY / 10) * 10;
          }

          return { ...el, x: targetX, y: targetY };
        })
      );
    }
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      pushHistory();
    }
    isDraggingRef.current = false;
    isPanningRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom((prev) => Math.min(Math.max(prev * zoomFactor, 0.3), 2.5));
  };

  // Property Panel Updates
  const selectedElement = elements.find((el) => el.id === selectedIds[0]);

  const updateSelectedProperty = (key: keyof StudioElement, val: any) => {
    if (selectedIds.length === 0) return;
    pushHistory();
    setElements((prev) =>
      prev.map((el) => (selectedIds.includes(el.id) ? { ...el, [key]: val } : el))
    );
  };

  // Layer Ordering
  const bringForward = () => {
    if (selectedIds.length === 0) return;
    pushHistory();
    setElements((prev) => {
      const selected = prev.filter((el) => selectedIds.includes(el.id));
      const rest = prev.filter((el) => !selectedIds.includes(el.id));
      return [...rest, ...selected];
    });
  };

  const sendBackward = () => {
    if (selectedIds.length === 0) return;
    pushHistory();
    setElements((prev) => {
      const selected = prev.filter((el) => selectedIds.includes(el.id));
      const rest = prev.filter((el) => !selectedIds.includes(el.id));
      return [...selected, ...rest];
    });
  };

  // Export to JSON
  const exportJSON = () => {
    const doc: DiagramDocument = {
      version: '1.0.4',
      name: diagramName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      elements,
      viewState: { pan, zoom }
    };
    const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${diagramName.toLowerCase().replace(/\s+/g, '-')}.complexity.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  // Export to SVG
  const exportSVG = () => {
    if (!canvasRef.current) return;
    const svgClone = canvasRef.current.cloneNode(true) as SVGSVGElement;
    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const svgData = new XMLSerializer().serializeToString(svgClone);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${diagramName.toLowerCase().replace(/\s+/g, '-')}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  // Export to PNG via Offscreen Canvas
  const exportPNG = () => {
    if (!canvasRef.current) return;
    const svgClone = canvasRef.current.cloneNode(true) as SVGSVGElement;
    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const svgString = new XMLSerializer().serializeToString(svgClone);
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1600;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = `${diagramName.toLowerCase().replace(/\s+/g, '-')}.png`;
        a.click();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
    setShowExportMenu(false);
  };

  // Import JSON File
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.elements && Array.isArray(parsed.elements)) {
          pushHistory();
          setElements(parsed.elements);
          if (parsed.name) setDiagramName(parsed.name);
          if (parsed.viewState) {
            setPan(parsed.viewState.pan || { x: 40, y: 40 });
            setZoom(parsed.viewState.zoom || 1);
          }
          setSelectedIds([]);
        }
      } catch (err) {
        alert('Invalid Complexity diagram JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const loadTemplate = (template: (typeof STUDIO_TEMPLATES)[0]) => {
    pushHistory();
    setDiagramName(template.title);
    setElements(template.elements);
    setSelectedIds([]);
    setPan({ x: 40, y: 40 });
    setZoom(1);
    setShowTemplatesModal(false);
  };

  const renderElement = (el: StudioElement) => {
    const isSelected = selectedIds.includes(el.id);
    const strokeDash =
      el.strokeStyle === 'dashed' ? '5,5' : el.strokeStyle === 'dotted' ? '2,3' : undefined;

    return (
      <g
        key={el.id}
        transform={`translate(${el.x}, ${el.y})`}
        onMouseDown={(e) => handleElementMouseDown(e, el.id)}
        className="cursor-move group"
      >
        {/* Render Vector Shapes */}
        {(el.type === 'rectangle' ||
          el.type === 'client' ||
          el.type === 'browser' ||
          el.type === 'gateway' ||
          el.type === 'loadbalancer' ||
          el.type === 'server' ||
          el.type === 'microservice' ||
          el.type === 'database' ||
          el.type === 'cache' ||
          el.type === 'queue' ||
          el.type === 'pod' ||
          el.type === 'container') && (
          <rect
            width={el.width}
            height={el.height}
            rx={el.type === 'database' || el.type === 'queue' ? 4 : 6}
            fill={el.fillColor}
            stroke={el.strokeColor}
            strokeWidth={el.strokeWidth}
            strokeDasharray={strokeDash}
            opacity={el.opacity}
          />
        )}

        {el.type === 'rounded-rect' && (
          <rect
            width={el.width}
            height={el.height}
            rx={20}
            fill={el.fillColor}
            stroke={el.strokeColor}
            strokeWidth={el.strokeWidth}
            strokeDasharray={strokeDash}
            opacity={el.opacity}
          />
        )}

        {el.type === 'ellipse' && (
          <ellipse
            cx={el.width / 2}
            cy={el.height / 2}
            rx={el.width / 2}
            ry={el.height / 2}
            fill={el.fillColor}
            stroke={el.strokeColor}
            strokeWidth={el.strokeWidth}
            strokeDasharray={strokeDash}
            opacity={el.opacity}
          />
        )}

        {el.type === 'diamond' && (
          <polygon
            points={`${el.width / 2},0 ${el.width},${el.height / 2} ${el.width / 2},${
              el.height
            } 0,${el.height / 2}`}
            fill={el.fillColor}
            stroke={el.strokeColor}
            strokeWidth={el.strokeWidth}
            strokeDasharray={strokeDash}
            opacity={el.opacity}
          />
        )}

        {(el.type === 'cloud' || el.type === 'boundary') && (
          <rect
            width={el.width}
            height={el.height}
            rx={8}
            fill={el.fillColor}
            stroke={el.strokeColor}
            strokeWidth={el.strokeWidth}
            strokeDasharray="6,4"
            opacity={el.opacity}
          />
        )}

        {el.type === 'arrow' && (
          <g>
            <defs>
              <marker
                id={`arrow-${el.id}`}
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 8 4, 0 8" fill={el.strokeColor} />
              </marker>
            </defs>
            <line
              x1="0"
              y1="0"
              x2={el.width}
              y2={el.height}
              stroke={el.strokeColor}
              strokeWidth={el.strokeWidth}
              strokeDasharray={strokeDash}
              markerEnd={`url(#arrow-${el.id})`}
            />
          </g>
        )}

        {el.type === 'line' && (
          <line
            x1="0"
            y1="0"
            x2={el.width}
            y2={el.height}
            stroke={el.strokeColor}
            strokeWidth={el.strokeWidth}
            strokeDasharray={strokeDash}
          />
        )}

        {/* Text Labels */}
        {el.label && (
          <text
            x={el.textAlign === 'center' ? el.width / 2 : 10}
            y={el.height / 2}
            textAnchor={el.textAlign === 'center' ? 'middle' : 'start'}
            dominantBaseline="middle"
            fill={el.strokeColor === '#1e2938' ? '#ffffff' : '#172033'}
            fontSize={el.fontSize}
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight="500"
            className="select-none pointer-events-none"
          >
            {el.label.split('\n').map((line, i) => (
              <tspan key={i} x={el.textAlign === 'center' ? el.width / 2 : 10} dy={i === 0 ? 0 : 16}>
                {line}
              </tspan>
            ))}
          </text>
        )}

        {/* Selection bounding box indicator */}
        {isSelected && (
          <rect
            x={-4}
            y={-4}
            width={el.width + 8}
            height={el.height + 8}
            fill="none"
            stroke="#315e8a"
            strokeWidth="1.5"
            strokeDasharray="3,3"
            rx="4"
            className="pointer-events-none"
          />
        )}
      </g>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] w-full bg-canvas text-text-primary overflow-hidden select-none">
      {/* TOP TOOLBAR */}
      <header className="h-12 border-b border-border-subtle bg-surface px-4 flex items-center justify-between flex-shrink-0 z-30">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={diagramName}
            onChange={(e) => setDiagramName(e.target.value)}
            className="font-editorial font-bold text-sm bg-transparent border-b border-transparent hover:border-border-strong focus:border-brand focus:outline-none px-1 py-0.5 text-text-primary w-48 sm:w-64"
            title="Click to rename diagram"
          />
          <span className="hidden sm:inline-block font-mono text-[10px] text-text-muted px-2 py-0.5 rounded bg-surface-elevated border border-border-subtle">
            {saveStatus}
          </span>
        </div>

        {/* Center Controls: Undo, Redo, Zoom, Templates */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length === 0}
            aria-label="Undo (Ctrl+Z)"
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded hover:bg-surface-elevated disabled:opacity-30 text-text-secondary hover:text-text-primary"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={future.length === 0}
            aria-label="Redo (Ctrl+Y)"
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded hover:bg-surface-elevated disabled:opacity-30 text-text-secondary hover:text-text-primary"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-border-subtle mx-1" />

          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(z - 0.1, 0.3))}
            aria-label="Zoom Out"
            className="p-1.5 rounded hover:bg-surface-elevated text-text-secondary"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs text-text-muted w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(z + 0.1, 2.5))}
            aria-label="Zoom In"
            className="p-1.5 rounded hover:bg-surface-elevated text-text-secondary"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setZoom(1);
              setPan({ x: 40, y: 40 });
            }}
            aria-label="Reset Zoom"
            title="Reset to 100%"
            className="p-1.5 rounded hover:bg-surface-elevated text-text-secondary"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-border-subtle mx-1" />

          {/* Templates Selector Button */}
          <button
            type="button"
            onClick={() => setShowTemplatesModal(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-elevated border border-border-subtle text-xs font-mono font-semibold hover:border-brand text-text-primary"
          >
            <FolderOpen className="w-3.5 h-3.5 text-brand" />
            <span className="hidden sm:inline">Templates</span>
          </button>
        </div>

        {/* Right Controls: Export & Import */}
        <div className="flex items-center gap-2 relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 rounded hover:bg-surface-elevated text-text-secondary hover:text-text-primary text-xs font-mono inline-flex items-center gap-1"
            title="Import diagram JSON file"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Import</span>
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowExportMenu((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-brand text-white text-xs font-mono font-semibold hover:bg-brand-hover shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 top-9 w-48 rounded-lg border border-border-subtle bg-surface shadow-xl p-1.5 space-y-1 z-50 text-xs">
                <button
                  type="button"
                  onClick={exportPNG}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-surface-elevated flex items-center gap-2"
                >
                  <FileImage className="w-4 h-4 text-emerald-500" />
                  <span>Export PNG Image</span>
                </button>
                <button
                  type="button"
                  onClick={exportSVG}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-surface-elevated flex items-center gap-2"
                >
                  <Code className="w-4 h-4 text-blue-500" />
                  <span>Export Vector SVG</span>
                </button>
                <button
                  type="button"
                  onClick={exportJSON}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-surface-elevated flex items-center gap-2 border-t border-border-subtle/50 pt-2"
                >
                  <FileJson className="w-4 h-4 text-amber-500" />
                  <span>Export Diagram JSON</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN WORKSPACE: LEFT PALETTE | CANVAS | RIGHT PROPERTIES */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* LEFT TOOLBAR */}
        <aside className="w-14 sm:w-16 border-r border-border-subtle bg-surface flex flex-col items-center py-3 gap-1 overflow-y-auto z-20 flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveTool('select')}
            aria-label="Select Tool (V)"
            title="Select Tool (V)"
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'select'
                ? 'bg-brand text-white shadow-sm'
                : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'
            }`}
          >
            <MousePointer className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('pan')}
            aria-label="Hand / Pan Tool (H)"
            title="Hand / Pan Tool (H)"
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'pan'
                ? 'bg-brand text-white shadow-sm'
                : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'
            }`}
          >
            <Hand className="w-4 h-4" />
          </button>

          <div className="w-8 h-px bg-border-subtle my-1" />

          {/* Geometric Primitives */}
          <button
            type="button"
            onClick={() => setActiveTool('rectangle')}
            aria-label="Rectangle (R)"
            title="Rectangle (R)"
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'rectangle'
                ? 'bg-brand text-white'
                : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'
            }`}
          >
            <Square className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('ellipse')}
            aria-label="Ellipse"
            title="Ellipse"
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'ellipse'
                ? 'bg-brand text-white'
                : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'
            }`}
          >
            <Circle className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('diamond')}
            aria-label="Diamond / Decision"
            title="Diamond / Decision"
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'diamond'
                ? 'bg-brand text-white'
                : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'
            }`}
          >
            <Diamond className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('arrow')}
            aria-label="Arrow Connector (A)"
            title="Arrow Connector (A)"
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'arrow'
                ? 'bg-brand text-white'
                : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'
            }`}
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('text')}
            aria-label="Text Annotation (T)"
            title="Text Annotation (T)"
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'text'
                ? 'bg-brand text-white'
                : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'
            }`}
          >
            <Type className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('eraser')}
            aria-label="Eraser"
            title="Eraser (Click element to delete)"
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'eraser'
                ? 'bg-rose-500 text-white'
                : 'text-text-secondary hover:bg-surface-elevated hover:text-rose-500'
            }`}
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="w-8 h-px bg-border-subtle my-1" />

          {/* Engineering Systems Palette */}
          <div className="font-mono text-[9px] text-text-muted uppercase font-bold text-center">
            Sys
          </div>

          <button
            type="button"
            onClick={() => setActiveTool('client')}
            title="Client / Browser"
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'client'
                ? 'bg-brand text-white'
                : 'text-text-secondary hover:bg-surface-elevated text-sky-500'
            }`}
          >
            <Laptop className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('gateway')}
            title="API Gateway / Proxy"
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'gateway'
                ? 'bg-brand text-white'
                : 'text-text-secondary hover:bg-surface-elevated text-emerald-500'
            }`}
          >
            <Globe className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('loadbalancer')}
            title="Load Balancer"
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'loadbalancer'
                ? 'bg-brand text-white'
                : 'text-text-secondary hover:bg-surface-elevated text-blue-500'
            }`}
          >
            <Shield className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('server')}
            title="Application Server"
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'server'
                ? 'bg-brand text-white'
                : 'text-text-secondary hover:bg-surface-elevated text-indigo-500'
            }`}
          >
            <Server className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('database')}
            title="Database"
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'database'
                ? 'bg-brand text-white'
                : 'text-text-secondary hover:bg-surface-elevated text-amber-500'
            }`}
          >
            <Database className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('cache')}
            title="Redis Cache"
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'cache'
                ? 'bg-brand text-white'
                : 'text-text-secondary hover:bg-surface-elevated text-orange-500'
            }`}
          >
            <Zap className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('queue')}
            title="Message Queue / Kafka"
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'queue'
                ? 'bg-brand text-white'
                : 'text-text-secondary hover:bg-surface-elevated text-purple-500'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('pod')}
            title="Kubernetes Pod / Container"
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'pod'
                ? 'bg-brand text-white'
                : 'text-text-secondary hover:bg-surface-elevated text-teal-500'
            }`}
          >
            <Cpu className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('cloud')}
            title="Cloud Boundary / VPC"
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'cloud'
                ? 'bg-brand text-white'
                : 'text-text-secondary hover:bg-surface-elevated text-sky-400'
            }`}
          >
            <Cloud className="w-4 h-4" />
          </button>
        </aside>

        {/* MAIN CANVAS */}
        <main
          className="flex-1 h-full overflow-hidden relative cursor-default"
          onWheel={handleWheel}
        >
          <svg
            ref={canvasRef}
            className="w-full h-full"
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <defs>
              {/* Dot Grid Pattern */}
              <pattern
                id="studio-dot-grid"
                width={20 * zoom}
                height={20 * zoom}
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx={10 * zoom}
                  cy={10 * zoom}
                  r={1}
                  fill="currentColor"
                  className="text-border-subtle"
                />
              </pattern>
            </defs>

            {/* Grid Backdrop */}
            {gridType === 'dot' && (
              <rect width="100%" height="100%" fill="url(#studio-dot-grid)" />
            )}

            {/* Viewport Transform Group */}
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {elements.map(renderElement)}
            </g>
          </svg>

          {/* Floating Bottom Grid & Snap Controls */}
          <div className="absolute bottom-4 left-4 rounded-lg border border-border-subtle bg-surface/90 backdrop-blur px-3 py-1.5 flex items-center gap-3 text-xs font-mono text-text-secondary shadow-md">
            <button
              type="button"
              onClick={() => setGridType((g) => (g === 'dot' ? 'none' : 'dot'))}
              className={`hover:text-text-primary flex items-center gap-1 ${
                gridType === 'dot' ? 'text-brand font-bold' : ''
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <span className="text-border-subtle">•</span>
            <button
              type="button"
              onClick={() => setSnapToGrid((s) => !s)}
              className={`hover:text-text-primary ${snapToGrid ? 'text-brand font-bold' : ''}`}
            >
              Snap {snapToGrid ? 'ON' : 'OFF'}
            </button>
            <span className="text-border-subtle">•</span>
            <span>{elements.length} components</span>
          </div>
        </main>

        {/* RIGHT PROPERTIES PANEL */}
        <aside className="w-64 border-l border-border-subtle bg-surface p-4 flex flex-col gap-5 overflow-y-auto z-20 flex-shrink-0">
          {selectedElement ? (
            <div className="space-y-5 text-xs">
              <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                <span className="font-mono text-[10px] text-brand uppercase font-bold">
                  Element Inspector
                </span>
                <span className="font-mono text-[10px] text-text-muted uppercase">
                  {selectedElement.type}
                </span>
              </div>

              {/* Text Label */}
              <div>
                <label className="font-mono text-[11px] text-text-muted block mb-1">
                  Text Label
                </label>
                <textarea
                  value={selectedElement.label}
                  onChange={(e) => updateSelectedProperty('label', e.target.value)}
                  rows={2}
                  className="w-full px-2.5 py-1.5 rounded border border-border-subtle bg-surface-elevated text-text-primary text-xs focus:border-brand focus:outline-none"
                />
              </div>

              {/* Fill Color */}
              <div>
                <label className="font-mono text-[11px] text-text-muted block mb-1.5">
                  Fill Color
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {COLOR_PALETTE.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      title={c.name}
                      onClick={() => updateSelectedProperty('fillColor', c.value)}
                      style={{ backgroundColor: c.value, borderColor: c.border }}
                      className={`w-7 h-7 rounded border transition-all ${
                        selectedElement.fillColor === c.value
                          ? 'ring-2 ring-brand scale-110'
                          : 'hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Stroke Color */}
              <div>
                <label className="font-mono text-[11px] text-text-muted block mb-1.5">
                  Stroke Color
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {STROKE_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => updateSelectedProperty('strokeColor', color)}
                      style={{ backgroundColor: color }}
                      className={`w-7 h-7 rounded border border-border-subtle transition-all ${
                        selectedElement.strokeColor === color
                          ? 'ring-2 ring-brand scale-110'
                          : 'hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Stroke Style & Width */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[11px] text-text-muted block mb-1">
                    Stroke Width
                  </label>
                  <select
                    value={selectedElement.strokeWidth}
                    onChange={(e) => updateSelectedProperty('strokeWidth', Number(e.target.value))}
                    className="w-full px-2 py-1 rounded border border-border-subtle bg-surface-elevated text-xs focus:outline-none"
                  >
                    <option value={1}>1px Thin</option>
                    <option value={2}>2px Normal</option>
                    <option value={3}>3px Bold</option>
                    <option value={4}>4px Heavy</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-[11px] text-text-muted block mb-1">
                    Line Style
                  </label>
                  <select
                    value={selectedElement.strokeStyle}
                    onChange={(e) => updateSelectedProperty('strokeStyle', e.target.value)}
                    className="w-full px-2 py-1 rounded border border-border-subtle bg-surface-elevated text-xs focus:outline-none"
                  >
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                  </select>
                </div>
              </div>

              {/* Font Size & Alignment */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[11px] text-text-muted block mb-1">
                    Font Size
                  </label>
                  <select
                    value={selectedElement.fontSize}
                    onChange={(e) => updateSelectedProperty('fontSize', Number(e.target.value))}
                    className="w-full px-2 py-1 rounded border border-border-subtle bg-surface-elevated text-xs focus:outline-none"
                  >
                    <option value={10}>10px Micro</option>
                    <option value={12}>12px Small</option>
                    <option value={14}>14px Medium</option>
                    <option value={18}>18px Large</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-[11px] text-text-muted block mb-1">
                    Align
                  </label>
                  <select
                    value={selectedElement.textAlign}
                    onChange={(e) => updateSelectedProperty('textAlign', e.target.value)}
                    className="w-full px-2 py-1 rounded border border-border-subtle bg-surface-elevated text-xs focus:outline-none"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>

              {/* Layer Ordering */}
              <div>
                <label className="font-mono text-[11px] text-text-muted block mb-1.5">
                  Layer Ordering
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={bringForward}
                    className="px-2 py-1.5 rounded border border-border-subtle bg-surface-elevated hover:bg-surface font-mono text-[11px] text-center"
                  >
                    Bring Forward
                  </button>
                  <button
                    type="button"
                    onClick={sendBackward}
                    className="px-2 py-1.5 rounded border border-border-subtle bg-surface-elevated hover:bg-surface font-mono text-[11px] text-center"
                  >
                    Send Backward
                  </button>
                </div>
              </div>

              {/* Actions: Duplicate & Delete */}
              <div className="pt-2 border-t border-border-subtle grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDuplicate}
                  className="px-2.5 py-1.5 rounded border border-border-subtle bg-surface-elevated hover:bg-surface text-xs font-mono inline-flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Duplicate</span>
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-2.5 py-1.5 rounded bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20 text-xs font-mono inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="font-mono text-[10px] text-brand uppercase font-bold border-b border-border-subtle pb-2">
                Workspace Canvas
              </div>
              <p className="text-text-secondary leading-relaxed font-technical">
                Select any component to inspect and customize colors, borders, typography, and connections.
              </p>
              <div className="space-y-2 pt-2 border-t border-border-subtle/80 font-mono text-[11px] text-text-muted">
                <div>Shortcuts:</div>
                <div>• <kbd className="text-text-primary font-bold">V</kbd> Select tool</div>
                <div>• <kbd className="text-text-primary font-bold">H</kbd> Hand / pan tool</div>
                <div>• <kbd className="text-text-primary font-bold">R</kbd> Rectangle</div>
                <div>• <kbd className="text-text-primary font-bold">A</kbd> Arrow</div>
                <div>• <kbd className="text-text-primary font-bold">Del</kbd> Delete element</div>
                <div>• <kbd className="text-text-primary font-bold">Ctrl+D</kbd> Duplicate</div>
                <div>• <kbd className="text-text-primary font-bold">Ctrl+Z</kbd> Undo</div>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* TEMPLATES MODAL */}
      {showTemplatesModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="rounded-xl border border-border-subtle bg-surface max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-border-subtle flex items-center justify-between">
              <div>
                <h3 className="font-editorial text-lg font-bold text-text-primary">
                  Architecture Starter Templates
                </h3>
                <p className="text-xs text-text-secondary font-technical mt-0.5">
                  Select a production architecture blueprint to load directly into the canvas.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTemplatesModal(false)}
                className="p-1.5 rounded-md hover:bg-surface-elevated text-text-muted hover:text-text-primary"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
              {STUDIO_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => loadTemplate(tmpl)}
                  className="p-4 rounded-lg border border-border-subtle hover:border-brand/50 hover:bg-surface-elevated/50 transition-all cursor-pointer flex items-center justify-between gap-4 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-brand uppercase font-bold px-2 py-0.5 rounded bg-brand-subtle border border-brand/20">
                        {tmpl.category}
                      </span>
                      <h4 className="font-editorial text-base font-bold text-text-primary group-hover:text-brand transition-colors">
                        {tmpl.title}
                      </h4>
                    </div>
                    <p className="text-xs text-text-secondary font-technical leading-relaxed">
                      {tmpl.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded bg-surface border border-border-subtle group-hover:border-brand group-hover:bg-brand group-hover:text-white text-xs font-mono font-semibold transition-all flex-shrink-0"
                  >
                    Load &rarr;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
