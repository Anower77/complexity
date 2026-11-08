# Complexity

> Open engineering knowledge publication and interactive system design reference. Deconstruct backend infrastructure, network lifecycles, and distributed architecture through first-principles guides and interactive flow diagrams.

Production URL: [https://anower77.github.io/complexity/](https://anower77.github.io/complexity/)

---

## 1. Product Overview

**Complexity** is a free, open technical engineering publication and system architecture reference. We believe developers learn best when complex distributed primitives are deconstructed from mechanical first principles rather than black-box summaries or paid course offerings.

The platform provides:
- **Zero Course Selling**: Free, open technical blog and system design guide. No paywalls, no enrollments, no subscriptions.
- **Structured Learning Paths**: Sequential 6-phase engineering curriculum showing concepts, prerequisites, and dependencies.
- **Interactive Visual Simulators**: Live packet workflows, socket allocations, and failure-injection sandboxes (traffic surges, cache evictions, cascading failures).
- **Articles & Deep Dives**: Comprehensive architectural breakdowns answering the 7 fundamental questions behind production systems.
- **3-Column Technical Reading Experience**: Left module sidebar, focused reading canvas with SVG diagrams, right table of contents with reading progress.

Each guide deconstructs software systems from first principles, answering seven core questions:
1. **Why does it exist?** (The historical bottleneck or hardware boundary)
2. **What problem does it solve?** (The precise engineering pain point)
3. **How does it work internally?** (Sockets, buffers, memory hierarchy, state machines)
4. **What happens under real traffic?** (Concurrency models, connection pooling, queue depth)
5. **What happens when it fails?** (Cascading timeouts, network partitions, thundering herds)
6. **What alternatives exist?** (Objective trade-off matrices)
7. **Why would an engineering team choose it?** (Production decision criteria)

---

## 2. Core Platform Features

- **Course-Based Curriculum**: Hierarchical Learning Paths → Courses → Chapters → Lessons.
- **3-Column Reading Experience**:
  - **Left Sidebar**: Persistent course syllabus with expandable chapters, active lesson indicators, and completion checkmarks.
  - **Center Canvas**: Focused reading view with breadcrumbs, structured MDX content, code tabs, and interactive diagrams.
  - **Right Sidebar**: On-page Table of Contents tracking scroll position with dynamic reading progress percentage.
- **Interactive Component Inspector**: Vector architecture diagrams where clicking any node reveals internal buffers, worker threads, and socket states.
- **Zero-FOUC Dual Themes**: Seamless light (archival paper) and dark (technical slate) themes with inline `<head>` detection.
- **Local Progress Tracking**: Mark lessons as completed with local persistence via `localStorage` (no account or login required).
- **Fast Client-Side Search**: Fast fuzzy-search across courses, chapters, and concepts with `Cmd+K` / `Ctrl+K`.

---

## 3. Technology Stack

- **Framework**: [Astro 5](https://astro.build/) (Static Site Generation, Minimal JS Islands Architecture)
- **Language**: TypeScript 5 (Strict Mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom design tokens for Light/Dark modes
- **Content**: MDX (Markdown with embedded React interactive diagrams and knowledge checks)
- **Interactive UI**: React 19 (Hydrated only where client interactivity is needed)
- **Diagrams**: Native SVG with interactive inspection + Component Inspector
- **Testing**: [Vitest](https://vitest.dev/)
- **Deployment**: GitHub Actions → GitHub Pages

---

## 4. Local Development

### Prerequisites

- Node.js `v22+`
- npm `v9+`

### Setup Commands

```bash
# Install dependencies
npm install

# Start local development server (runs at http://localhost:4321/)
npm run dev

# Run unit tests
npm test

# Run TypeScript typecheck
npm run typecheck

# Build static production bundle into dist/
npm run build

# Preview production build locally
npm run preview
```

---

## 5. Architectural Documentation

Detailed technical blueprints and specifications are documented in `/docs`:

- [Product Specification](docs/PRODUCT.md) — Product vision, target personas, and scope.
- [System Architecture](docs/ARCHITECTURE.md) — SSG rendering model, hydration strategy, and loader engine.
- [Project Structure](docs/PROJECT_STRUCTURE.md) — File tree responsibilities and where new code belongs.
- [Content Model](docs/CONTENT_MODEL.md) — Course, chapter, and lesson schemas, MDX authoring rules, and validation.
- [Design System](docs/DESIGN_SYSTEM.md) — Design tokens, typography scales, color palettes, and diagram standards.
- [Component Guidelines](docs/COMPONENT_GUIDELINES.md) — Astro vs React usage, MDX component interfaces.
- [Routing](docs/ROUTING.md) — URL hierarchy, static path generation, and base path handling.
- [Deployment](docs/DEPLOYMENT.md) — GitHub Pages CI/CD workflow, asset resolution, and troubleshooting.
- [Roadmap](docs/ROADMAP.md) — Milestones and 6-phase engineering curriculum rollout.
