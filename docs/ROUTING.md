# Routing Architecture: Complexity

> Version: 1.0.1

---

## 1. Route Hierarchy

The platform implements a clean, hierarchical URL structure:

| URL Pattern | Page Purpose | Static File Location |
| :--- | :--- | :--- |
| `/` | Landing page, editorial manifesto, featured courses | `src/pages/index.astro` |
| `/learn` | 6-phase engineering curriculum roadmap | `src/pages/learn/index.astro` |
| `/courses` | Full course directory with filters | `src/pages/courses/index.astro` |
| `/courses/[courseSlug]` | Course overview, learning objectives, syllabus | `src/pages/courses/[courseSlug]/index.astro` |
| `/courses/[courseSlug]/[chapterSlug]` | Chapter syllabus / redirect to first lesson | `src/pages/courses/[courseSlug]/[chapterSlug]/index.astro` |
| `/courses/[courseSlug]/[chapterSlug]/[lessonSlug]` | 3-Column lesson reading view | `src/pages/courses/[courseSlug]/[chapterSlug]/[lessonSlug].astro` |
| `/about` | Platform mission, team, and open architecture | `src/pages/about.astro` |
| `/search` | Full-page interactive fuzzy search | `src/pages/search.astro` |
| `/404` | Technical not-found page | `src/pages/404.astro` |

---

## 2. Dynamic Route Generation (`getStaticPaths`)

Astro generates all course, chapter, and lesson pages dynamically at build time:

```typescript
// src/pages/courses/[courseSlug]/[chapterSlug]/[lessonSlug].astro
export async function getStaticPaths() {
  const lessons = getAllLessons();
  const chapters = getAllChapters();

  return lessons.map((lesson) => {
    const parentChapter = chapters.find((ch) => ch.id === lesson.chapterId);
    return {
      params: {
        courseSlug: lesson.courseId,
        chapterSlug: parentChapter ? parentChapter.slug : 'chapter',
        lessonSlug: lesson.slug
      }
    };
  });
}
```

This guarantees:
- Zero manual routing configuration when adding new courses or lessons.
- Build-time detection of broken links, duplicate slugs, or missing parameters.

---

## 3. Base Path Handling

All routes and internal hyperlinks use `formatPath()` from `src/lib/utilities/url.ts`:

- Local development: `formatPath('/courses')` → `/courses`
- GitHub Pages: `formatPath('/courses')` → `/complexity/courses`
- Custom Apex Domain: `formatPath('/courses')` → `/courses`
