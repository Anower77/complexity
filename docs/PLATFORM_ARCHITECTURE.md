# Platform Architecture: Complexity (v1.0.4)

## 1. System Overview

Complexity is built as an ultra-fast, statically rendered engineering publication paired with client-hydrated interactive visualization modules and a local-first diagram creation studio.

```
+---------------------------------------------------------------------------------+
|                                 Astro Platform                                  |
|                                                                                 |
|  +--------------------+   +-----------------------+   +----------------------+  |
|  |     Pages & UI     |   |   Static Content MDX  |   |   Dynamic Engines    |  |
|  |                    |   |                       |   |                      |  |
|  |  - Home (/)        |   |  - System Architecture|   |  - Diagram Engine    |  |
|  |  - Explore         |   |  - Networking         |   |  - Flow Simulator    |  |
|  |  - Learning Paths  |   |  - Linux & Runtimes   |   |  - Diagram Studio    |  |
|  |  - System Design   |   |  - Distributed Storage|   |  - Knowledge Graph   |  |
|  |  - Articles        |   |  - Kubernetes Guides  |   |  - Client Search     |  |
|  |  - Diagram Studio  |   |                       |   |                      |  |
|  +--------------------+   +-----------------------+   +----------------------+  |
+---------------------------------------------------------------------------------+
                                      |
                                      v Static Build
+---------------------------------------------------------------------------------+
|                        GitHub Pages Deployment (/complexity)                    |
|                        Static HTML + Optimized CSS + JS Chunks                  |
+---------------------------------------------------------------------------------+
```

---

## 2. Route Architecture

All routes are fully static and support the `/complexity` base path in production:

| Route | Purpose | Hydration Model |
| :--- | :--- | :--- |
| `/` | Publication Homepage with Hero flow, Knowledge Map, Guides | Static HTML + `client:visible` interactive engines |
| `/explore` | Categorized directory of all engineering concepts | Static HTML + lightweight client search filter |
| `/path` | Sequential topic learning paths with prerequisites | Static HTML + interactive dependency graph |
| `/system-design` | Production case studies (URL shortener, chat, streaming) | Static HTML |
| `/articles` | Master directory of technical architecture guides | Static HTML |
| `/articles/[slug]` | Individual deep-dive technical articles | Static prose + client diagram engines |
| `/studio` | Custom Diagram Studio workspace | Client-rendered (`client:only="react"`) |
| `/search` | Global command-palette search index | Static HTML + `client:idle` modal |
| `/about` | Editorial manifesto, principles, and invariants | Static HTML |

---

## 3. Technology Stack & Decision Matrix

1. **Astro 5.x**:
   - Zero-JS by default for all article reading, layout chrome, and metadata.
   - Built-in MDX support with syntax highlighting (Shiki `github-dark-dimmed`).
2. **React 19**:
   - Used selectively for interactive components: `DiagramStudio`, `InteractiveKnowledgeMap`, `TrafficSimulator`, `SystemFlowSimulator`, and `ThemeToggle`.
   - Island architecture: each React component loads independently without monolithic bundle cost.
3. **Tailwind CSS 3.4**:
   - Design tokens exposed as semantic utility classes.
   - Zero runtime overhead; pruned at build time.
4. **Lucide React**:
   - High-contrast, standardized icons for system components (Server, Database, Network, Cpu, Shield, etc.).
5. **No External Backend**:
   - All state in Diagram Studio is stored in local browser `localStorage`.
   - Search uses an in-memory client index generated at build time.
   - Fully compatible with static web hosting (GitHub Pages, Cloudflare Pages, Netlify).

---

## 4. Base Path & GitHub Pages Compatibility

Because the production deployment URL is `https://anower77.github.io/complexity/`, all asset URLs, scripts, styles, and internal links must pass through `formatPath(url)` from `src/lib/utilities/url.ts`.

- In development: `formatPath('/explore')` resolves to `/explore`.
- In production: `formatPath('/explore')` resolves to `/complexity/explore`.
- A `.nojekyll` file in `public/` guarantees that GitHub Pages serves the `_astro/` asset directory without ignoring underscore-prefixed directories.
