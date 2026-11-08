# System Architecture: Complexity

> Version: 1.0.1  
> Pattern: Static Site Generation (SSG) with Partial Hydration (Islands Architecture)

---

## 1. High-Level Architecture

Complexity is built as a static engineering platform prioritizing instant page loads, zero client-side JavaScript on static reading content, and isolated React islands for interactive features.

```
+-------------------------------------------------------------------------+
|                              Build Time                                 |
|                                                                         |
|  src/content/courses/*/course.json                                      |
|  src/content/courses/*/chapters/*/chapter.json                          |
|  src/content/courses/*/chapters/*/lessons/*.mdx                         |
|                                                                         |
|  +--------------------+    +--------------------+    +---------------+  |
|  | Content Loaders    |--->| Content Validation |--->| Astro Engine  |  |
|  | & Navigation Build |    | (Zero Build Errors)|    | (Static SSG)  |  |
|  +--------------------+    +--------------------+    +-------+-------+  |
+--------------------------------------------------------------|----------+
                                                               |
                                                               v
+-------------------------------------------------------------------------+
|                               Runtime                                   |
|                                                                         |
|  Statically Generated HTML / CSS (0kB JS)                               |
|  - Layout, Editorial Typography, Headings, Code Blocks                  |
|                                                                         |
|  Hydrated Islands (client:load / client:visible):                       |
|  - ThemeToggle.tsx (client:load - Instant Dark/Light Switching)         |
|  - CourseSidebar.tsx (client:load - LocalStorage Progress Sync)         |
|  - TableOfContents.tsx (client:load - Scroll & Reading Progress)        |
|  - InteractiveDiagram.tsx (client:visible - Vector Node Inspector)     |
|  - KnowledgeCheck.tsx (client:visible - Instant Feedback Scenarios)     |
+-------------------------------------------------------------------------+
```

---

## 2. Rendering & Hydration Strategy

1. **Static HTML First**: Every page is statically pre-rendered at build time into `dist/`. No server runtime, database query, or serverless invocation occurs at request time.
2. **Selective Island Hydration**:
   - `client:load`: Used for lightweight controls needed immediately on layout load (`ThemeToggle`, `CourseSidebar`, `TableOfContents`).
   - `client:visible`: Used for below-the-fold interactive components (`InteractiveDiagram`, `KnowledgeCheck`). React is not downloaded or executed until the reader scrolls the component into view.
3. **Zero FOUC Mechanism**: An inline blocking `<script>` in the `<head>` checks `localStorage.getItem('theme')` or `prefers-color-scheme` before the DOM renders, preventing any white flashes in dark mode.

---

## 3. Dynamic Route Generation

Astro dynamic routes query the content loaders during build time:

- `/courses/[courseSlug]/index.astro`: Generates routes for all published courses via `getAllCourses()`.
- `/courses/[courseSlug]/[chapterSlug]/index.astro`: Generates redirects to the first lesson of each chapter via `getAllChapters()`.
- `/courses/[courseSlug]/[chapterSlug]/[lessonSlug].astro`: Generates all individual lesson reading pages via `getAllLessons()`.

---

## 4. Static Hosting Constraints & Path Handling

Because GitHub Pages hosts repositories under subpaths (e.g. `https://anower77.github.io/complexity/`), all internal routing, links, and asset references pass through the `formatPath()` utility in `src/lib/utilities/url.ts`:

```typescript
export function formatPath(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath === '/') return cleanBase ? `${cleanBase}/` : '/';
  return `${cleanBase}${cleanPath}`;
}
```

This guarantees seamless switching between local development (`/`), default GitHub Pages (`/complexity`), and future custom apex domains (`complexity.github.io`).
