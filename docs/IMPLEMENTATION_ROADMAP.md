# Implementation Roadmap: Complexity (v1.0.4)

## 1. Roadmap Milestones & Execution Plan

```
[Milestone 1: Design System & Header/Footer]
                    |
                    v
[Milestone 2: Information Architecture & Article Routing]
                    |
                    v
[Milestone 3: Knowledge Graph & Topic Relationships]
                    |
                    v
[Milestone 4: Reusable Diagram Engine]
                    |
                    v
[Milestone 5: Custom Diagram Studio (Excalidraw-inspired Workspace)]
                    |
                    v
[Milestone 6: Verification, Testing & GitHub Pages Deployment Fix]
```

---

## 2. Milestone Details & Verification Criteria

### Milestone 1 — Design System & Global Layout Foundation
- **Deliverables**:
  - Update `src/styles/theme.css` with exact tokens for Light and Dark themes.
  - Update `src/components/layout/Navbar.astro` to add "Diagram Studio" (`/studio`), active state highlights, and responsive drawer links.
  - Update `src/components/layout/Footer.astro` to include Diagram Studio and updated section links.
  - Verify zero-FOUC theme switching script.
- **Verification**: Header and footer render cleanly on desktop, tablet, and mobile with high contrast.

### Milestone 2 — Information Architecture & Article Migration
- **Deliverables**:
  - Migrate all published guides to first-class `/articles/` routes:
    - `/articles/client-server-architecture`
    - `/articles/request-lifecycle-protocols`
    - `/articles/dns-resolution-and-sockets`
    - `/articles/kubernetes-services-clusterip-nodeport-loadbalancer`
  - Purge course enrollment, pricing, and student dashboard concepts.
  - Update `src/pages/articles/index.astro` and `src/pages/index.astro` links.
- **Verification**: All article links work directly without any course terminology.

### Milestone 3 — Topic Engine & Knowledge Graph
- **Deliverables**:
  - Unified topic schema with prerequisites, downstream concepts, and category grouping.
  - Interactive Knowledge Map with category filtering, node inspection, and accessible text view.
- **Verification**: Graph interaction works on click, keyboard, and screen reader.

### Milestone 4 — Reusable Interactive Diagram Engine
- **Deliverables**:
  - Standardized visual primitives: Client, Gateway, Server, Database, Cache, Queue, LoadBalancer, Container, Pod.
  - Directed connection paths with dynamic protocol labels.
  - Step-by-step request flow animator with Play, Pause, Step Next, Step Prev, Speed selector, and step explanation drawer.
  - Reduced-motion support.
- **Verification**: Reusable diagram components load without layout shift or lag.

### Milestone 5 — Custom Diagram Studio
- **Deliverables**:
  - Full-featured React editor in `src/components/studio/DiagramStudio.tsx`.
  - Dedicated page `src/pages/studio/index.astro` (and alias `/diagram-studio`).
  - Top Toolbar: name, undo/redo, zoom/pan, export PNG, export SVG, export JSON, import JSON, templates menu.
  - Left Toolbar: selection, hand, shapes, connections, text, eraser, and engineering shape palette.
  - Main Canvas: infinite grid canvas, snap to grid, drag-and-drop, drag-connect, element resize, multi-select.
  - Right Properties Panel: color, stroke, width, dashed/solid, opacity, font size, alignment, layer arrange, delete.
  - 8 Built-in Architecture Starter Templates.
  - Browser `localStorage` draft auto-save and draft recovery.
- **Verification**: Users can create diagrams, load templates, export PNG/SVG/JSON, and reload drafts without errors.

### Milestone 6 — Verification, Testing & Deployment
- **Deliverables**:
  - Unit tests in `tests/` covering diagram data validation, import/export, and article metadata.
  - Add `public/.nojekyll` to fix GitHub Pages asset routing.
  - Execute `npm test`, `npm run typecheck`, and `npm run build`.
  - Provide repository setup guidance for GitHub Pages deployment.
- **Verification**: 100% build pass, zero TypeScript errors, clean static output.
