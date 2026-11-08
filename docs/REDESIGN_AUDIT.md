# Complexity Platform Redesign Audit

**Document Version:** 1.0.4  
**Date:** November 2026  
**Auditor:** Complexity Engineering & Product Architecture Team  
**Scope:** Deployed Site (`https://anower77.github.io/complexity/`), Repository Structure, Navigation, Visual Identity, Information Architecture, Diagram Engine, Content Model, Build & Deployment Pipeline.

---

## 1. Executive Summary

Complexity was originally conceived as an engineering publication and architecture visualizer. However, earlier iterations accumulated legacy structures:
1. Course-selling/LMS terminology and residual route patterns (`/courses/...`).
2. Absence of a centralized, reusable Interactive Diagram Engine (visualizations were custom single-purpose React components).
3. Missing Diagram Studio (the core product pillar of a custom architecture diagram workspace).
4. Missing Diagram Studio entry in the primary navigation.
5. Live site deployment discrepancy: GitHub Actions successfully builds the static site, but `https://anower77.github.io/complexity/` returns a `404` with a legacy fallback page because the repository's GitHub Pages source needs configuration or base-path asset routing alignment.

This document records the empirical findings of the platform audit and provides the actionable remediation plan.

---

## 2. Live Site & Deployment Findings

### 2.1 Live URL Behavior
- **URL Tested:** `https://anower77.github.io/complexity/`
- **Observed Response:** HTTP/2 404 (served with a legacy custom 404 redirect button page).
- **Cause Analysis:**
  - The repository's GitHub Actions workflow `.github/workflows/deploy.yml` runs successfully (`actions/deploy-pages@v4`), uploading the `dist` artifact.
  - However, the public API `https://api.github.com/repos/Anower77/complexity/pages` indicates that GitHub Pages is either not enabled or its source is set to a branch rather than "GitHub Actions" in the repository settings (`Settings > Pages > Source: GitHub Actions`).
  - Furthermore, static site deployments to GitHub Pages require a `.nojekyll` file in `public/` to prevent Jekyll from skipping files starting with underscores (e.g. `dist/_astro/...`).

### 2.2 Corrective Action
- Add `public/.nojekyll` to ensure `dist/_astro/` assets are never ignored by GitHub Pages.
- Provide explicit instructions for GitHub Repository settings to ensure Pages builds directly from the GitHub Actions environment.
- Verify `astro.config.mjs` base URL handling (`/complexity` in production, `/` in local development).

---

## 3. Product & Information Architecture Audit

### 3.1 Course-Selling & LMS Residual Semantics
- **Problem:** Files located in `src/pages/courses/`, `src/components/course/`, and `src/content/courses/` still carry course, chapter, and student progress terminology.
- **Why it is a problem:** Complexity is an open engineering publication, not a commercial LMS. Educational paywalls, enrollment buttons, or course-selling metaphors degrade trustworthiness and alienate senior engineering readers.
- **Observed Links:** `src/pages/articles/index.astro` and `src/pages/index.astro` contained links to `/courses/system-architecture-fundamentals/client-server-architecture/...`.
- **Solution:** Migrate all published guides to first-class `/articles/` routes (`/articles/client-server-architecture`, `/articles/request-lifecycle-protocols`, `/articles/dns-resolution-and-sockets`, `/articles/kubernetes-services-clusterip-nodeport-loadbalancer`). Maintain seamless backward-compatibility redirects for any legacy links.

### 3.2 Navigation Architecture
- **Problem:** The top navigation bar currently contains:
  - Explore
  - Learning Paths
  - System Design
  - Articles
  - About
  - Search (dialog)
  - Theme Toggle
  - GitHub
- **Deficiency:** "Diagram Studio" is completely missing from both the desktop header and the mobile drawer.
- **Solution:** Add "Diagram Studio" (`/studio`) as a primary item in both desktop and mobile navigation bars and footer navigation.

---

## 4. Visual Identity & Design System Audit

### 4.1 Color System & Tokens
- **Current State:** CSS variables in `src/styles/theme.css` provide initial tokens, but need alignment with the refined specification in `instruction/v1.0.4.md`:
  - Light theme: Canvas `#F8FAFC`, Surface `#FFFFFF`, Surface-Elevated `#F1F5F9`, Primary Text `#172033`, Secondary Text `#64748B`, Border `#E2E8F0`, Brand Accent `#315E8A`, Secondary Accent `#397C78`.
  - Dark theme: Canvas `#10151D`, Surface `#171F2B`, Surface-Elevated `#1E2938`, Primary Text `#E7EDF5`, Secondary Text `#A3B0C2`, Border `#2B394A`, Brand Accent `#83ADD6`, Secondary Accent `#75B6A9`.
- **Assessment:** High contrast, calm, editorial palette with zero neon gradients or purple/pink SaaS clichés.

### 4.2 Typography & Spacing
- **Current State:** Typography pairings (Inter + JetBrains Mono + Newsreader serif) look sharp and editorial.
- **Improvements Needed:** Standardize max-width classes (`max-w-layout` at `1440px`, reading width `max-w-reading` at `70ch`, content width at `900px`). Ensure all card grids use identical spacing and flex alignments.

---

## 5. Diagram Engine & Visualization Audit

### 5.1 Current Diagram Implementation
- **Problem:** In previous milestones, visualizations like `SystemFlowSimulator.tsx`, `TrafficSimulator.tsx`, and `WorkflowDiagram.tsx` were built as bespoke, monolithic components.
- **Limitations:**
  - Content authors cannot define diagrams using structured JSON or declarative props.
  - No modular visual primitives (`ClientNode`, `ServerNode`, `DatabaseNode`, `CacheNode`, `QueueNode`, etc.).
  - Animations are hardcoded rather than driven by step sequences.
- **Solution:** Create a centralized Diagram Engine (`src/components/diagram-engine/`) with:
  1. Standardized Node visual primitives with accessible labels and semantic colors.
  2. Directed connection arrows with dynamic routing and label badges.
  3. Step-by-step playback engine with Play/Pause, Next, Prev, Reset, and Speed controls.
  4. Step explanation drawer explaining: What moves, where it starts, where it goes, why it moves, and what state changes.
  5. `prefers-reduced-motion` compliance.

---

## 6. Diagram Studio Audit & Requirements

### 6.1 Status: Not Yet Implemented
- The platform currently has no interactive diagram editor.
- **Requirement:** Build a dedicated, full-screen engineering diagram workspace at `/studio` (and `/diagram-studio`) that provides:
  - Top Toolbar: diagram naming, undo/redo, zoom/pan controls, export (PNG, SVG, JSON), import JSON, theme sync, starter templates.
  - Left Toolbar: select, pan, shapes (rect, rounded rect, diamond, arrow, connector, line, pencil, text, eraser) + engineering shape palette (Client, Browser, API Gateway, Load Balancer, App Server, Database, Cache, Message Queue, Container, Pod, Cloud, Boundary).
  - Main Canvas: infinite/pannable grid canvas with snap-to-grid, element selection, drag-and-drop, connection port handles, resize handles, and keyboard shortcuts.
  - Right Properties Panel: stroke, fill, stroke width, dashed/solid, opacity, font size, alignment, layer ordering (forward/backward), duplicate, delete.
  - 8 Built-in Architecture Starter Templates.
  - Offline-ready draft persistence in browser `localStorage`.

---

## 7. Performance & Accessibility Audit

1. **JavaScript Bundles:** Keep Astro static generation for all text content; hydrate interactive diagram components only where visible (`client:visible` or `client:idle`).
2. **Diagram Studio Lazy Loading:** Diagram Studio should be client-rendered cleanly without breaking SSR.
3. **Contrast & Reduced Motion:** All node components and control buttons must meet WCAG AA contrast (minimum 4.5:1 for normal text, 3:1 for large text/icons). All CSS transitions and animations must check `prefers-reduced-motion`.
4. **Keyboard Accessibility:** All buttons and inputs must have visible focus rings (`focus-visible:ring-2 focus-visible:ring-brand`).

---

## 8. Summary of Milestones

| Milestone | Focus | Key Deliverables |
| :--- | :--- | :--- |
| **Milestone 1** | Audit & Design System | Complete audit docs, update theme tokens, header, footer with Diagram Studio link. |
| **Milestone 2** | Information Architecture | Migrate articles to `/articles/`, purge course semantics, clean navigation routes. |
| **Milestone 3** | Knowledge Graph | Unified topic system with prerequisites, dependencies, category filtering, and accessible text view. |
| **Milestone 4** | Diagram Engine | Reusable visual primitives, animated packet playback, step explanations, reduced-motion. |
| **Milestone 5** | Diagram Studio | Full-featured Excalidraw-inspired engineering diagram workspace with 8 templates, export/import, and local drafts. |
| **Milestone 6** | Quality & Deployment | Unit tests, static build verification, GitHub Pages deployment fix. |
