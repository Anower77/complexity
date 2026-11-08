# Project Structure: Complexity

> Version: 1.0.1

This document outlines the organization of the Complexity repository, the role of each directory, and conventions for adding new content and components.

---

## 1. Directory Tree & Responsibilities

```
complexity/
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions CI/CD for GitHub Pages
├── docs/                        # Architectural blueprints & engineering standards
│   ├── PRODUCT.md
│   ├── ARCHITECTURE.md
│   ├── PROJECT_STRUCTURE.md
│   ├── CONTENT_MODEL.md
│   ├── DESIGN_SYSTEM.md
│   ├── COMPONENT_GUIDELINES.md
│   ├── ROUTING.md
│   ├── DEPLOYMENT.md
│   └── ROADMAP.md
├── public/                      # Static assets directly copied to dist root
│   ├── favicon.svg              # SVG brand mark
│   └── robots.txt               # Crawler directives
├── src/
│   ├── components/
│   │   ├── course/              # Course overview UI (Card, Header, Progress)
│   │   ├── interactive/         # Interactive lesson widgets (Callout, Table, Quiz)
│   │   ├── layout/              # Universal chrome (Navbar, Footer, ThemeToggle)
│   │   ├── navigation/          # Course sidebar, TableOfContents, Breadcrumbs
│   │   ├── search/              # Modal and dialog search components
│   │   ├── ui/                  # Atomic primitives (Button, Card, Badge, Progress)
│   │   └── visualization/       # Reusable SVG diagrams and ComponentInspector
│   ├── content/
│   │   ├── courses/             # Structured course JSONs and MDX lessons
│   │   │   └── [courseSlug]/
│   │   │       ├── course.json
│   │   │       └── chapters/
│   │   │           └── [chapterSlug]/
│   │   │               ├── chapter.json
│   │   │               └── lessons/
│   │   │                   └── [lessonSlug].mdx
│   │   └── learning-paths/      # Learning roadmap curriculum definitions
│   ├── layouts/
│   │   ├── BaseLayout.astro     # Global HTML shell (Theme script, Meta, SEO)
│   │   └── LessonLayout.astro   # ByteByteGo-style 3-column reading experience
│   ├── lib/
│   │   ├── content/             # Data loaders, nav builders, validation rules
│   │   ├── progress/            # LocalStorage progress tracker and event bus
│   │   ├── search/              # Client-side fuzzy-search document generator
│   │   └── utilities/           # Slugifier, reading-time, duration, URL helpers
│   ├── pages/                   # Astro file-based routes
│   │   ├── index.astro          # Landing page
│   │   ├── about.astro          # Editorial philosophy
│   │   ├── search.astro         # Full-page discovery
│   │   ├── 404.astro            # Custom 404 page
│   │   ├── learn/index.astro    # Structured curriculum roadmap
│   │   └── courses/
│   │       ├── index.astro      # Course catalog
│   │       └── [courseSlug]/
│   │           ├── index.astro  # Course overview & syllabus
│   │           └── [chapterSlug]/
│   │               ├── index.astro # Chapter redirect
│   │               └── [lessonSlug].astro # Lesson reading view
│   ├── styles/
│   │   ├── global.css           # Global CSS and Tailwind directives
│   │   ├── theme.css            # Light/Dark CSS semantic variables
│   │   ├── typography.css       # Editorial serif and technical sans typography
│   │   └── code.css             # Code block and terminal styling
│   └── types/                   # Strict TypeScript interface definitions
├── tests/                       # Vitest unit and integration test suite
│   ├── content/                 # Content validation and loader tests
│   ├── navigation/              # Navigation engine and prev/next tests
│   ├── progress/                # Completion calculations
│   └── utilities/               # Reading time and slug tests
├── astro.config.mjs             # Astro 5 configuration
├── tailwind.config.ts           # Tailwind design tokens
├── tsconfig.json                # Strict TypeScript configuration
├── vitest.config.ts             # Vitest test runner configuration
└── package.json
```

---

## 2. Where to Add New Artifacts

### Adding a New Course
1. Create a folder in `src/content/courses/<course-slug>/`.
2. Add `course.json` with the required metadata fields (see `docs/CONTENT_MODEL.md`).
3. Add chapters under `src/content/courses/<course-slug>/chapters/<chapter-slug>/`.

### Adding a New Lesson
1. Create `<lesson-slug>.mdx` under `src/content/courses/<course-slug>/chapters/<chapter-slug>/lessons/`.
2. Populate the frontmatter with `id`, `slug`, `title`, `description`, `chapterId`, `courseId`, `order`, etc.
3. Write MDX using the standard lesson components (`<InfoCallout>`, `<InteractiveDiagram>`, `<KnowledgeCheck>`).
4. Run `npm test` — the automated content validator will verify that all chapter and course relationships are valid.

### Adding a New Interactive Widget
1. If the widget is static, author it as an Astro component in `src/components/interactive/` or `src/components/ui/`.
2. If it requires client-side state or user events (clicks, sliders, toggles), author it as a React component in `src/components/visualization/` or `src/components/interactive/`.
3. Embed it into MDX using `<MyComponent client:visible />`.
