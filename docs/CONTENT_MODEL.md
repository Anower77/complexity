# Content Model & Authoring: Complexity

> Version: 1.0.1

---

## 1. Information Hierarchy

The content architecture organizes engineering concepts into four nested tiers:

```
Platform
  └── Learning Paths (src/content/learning-paths/*.json)
        └── Courses (src/content/courses/[courseSlug]/course.json)
              └── Chapters (src/content/courses/[courseSlug]/chapters/[chapterSlug]/chapter.json)
                    └── Lessons (src/content/courses/[courseSlug]/chapters/[chapterSlug]/lessons/[lessonSlug].mdx)
```

---

## 2. Schema Specifications

### 2.1 Course Schema (`course.json`)

```json
{
  "id": "course-sys-arch-fund",
  "slug": "system-architecture-fundamentals",
  "title": "System Architecture Fundamentals",
  "description": "A comprehensive, first-principles exploration of how clients and servers exchange data.",
  "difficulty": "beginner",
  "estimatedDuration": "3 hours",
  "learningObjectives": [
    "Understand the separation of concerns between client agents and server processes",
    "Trace requests across transport layers, network sockets, and application runtimes"
  ],
  "prerequisites": [
    "Familiarity with basic programming concepts"
  ],
  "chapterIds": [
    "chapter-client-server",
    "chapter-network-foundations"
  ],
  "status": "published",
  "metadata": {
    "category": "Foundations",
    "tags": ["architecture", "networking", "sockets"],
    "author": "Complexity Editorial Board"
  }
}
```

### 2.2 Chapter Schema (`chapter.json`)

```json
{
  "id": "chapter-client-server",
  "slug": "client-server-architecture",
  "courseId": "system-architecture-fundamentals",
  "title": "Client-Server Architecture",
  "description": "Examine the primary communication architecture of the modern web.",
  "order": 1,
  "lessonIds": [
    "introduction-to-client-server",
    "request-lifecycle-and-protocols"
  ]
}
```

### 2.3 Lesson Schema (MDX Frontmatter)

```yaml
---
id: "introduction-to-client-server"
slug: "introduction-to-client-server"
chapterId: "chapter-client-server"
courseId: "system-architecture-fundamentals"
title: "Introduction to Client-Server Architecture"
description: "Deconstructing the fundamental communication paradigm that powers the modern internet."
order: 1
difficulty: "beginner"
estimatedReadingTime: 7
objectives:
  - "Understand the fundamental boundary between clients and servers"
  - "Explore network socket bindings, port multiplexing, and connection lifecycles"
prerequisites:
  - "Basic awareness of IP addresses and ports"
status: "published"
relatedLessons:
  - "request-lifecycle-and-protocols"
references:
  - title: "RFC 9110: HTTP Semantics"
    url: "https://www.rfc-editor.org/rfc/rfc9110"
    type: "rfc"
---
```

---

## 3. MDX Authoring Conventions

Every lesson is written in GitHub Flavored Markdown with imported interactive components:

```mdx
import InfoCallout from '@/components/interactive/InfoCallout.astro';
import ComparisonTable from '@/components/interactive/ComparisonTable.astro';
import KnowledgeCheck from '@/components/interactive/KnowledgeCheck';
import DiagramContainer from '@/components/visualization/DiagramContainer.astro';
import InteractiveDiagram from '@/components/visualization/InteractiveDiagram';

## 1. Section Title

Explanatory text written in precise technical language without fluff.

<InfoCallout type="note" title="Engineering Invariant">
Note content here.
</InfoCallout>

<DiagramContainer title="Topology Diagram" caption="Diagram caption description.">
  <InteractiveDiagram client:visible data={{ ... }} />
</DiagramContainer>

<KnowledgeCheck
  client:visible
  question="Scenario-based architectural question?"
  options={["Choice A", "Choice B", "Choice C", "Choice D"]}
  correctIndex={0}
  explanation="Detailed architectural explanation of why choice A is correct."
/>
```

---

## 4. Build-Time Validation Rules

The content validator (`src/lib/content/content-validation.ts`) automatically validates every build and test run:

1. **Duplicate Slug Detection**:
   - Course slugs must be globally unique.
   - Chapter slugs must be unique within their parent course.
   - Lesson slugs must be unique within their parent course.
2. **Relationship Integrity**:
   - Every chapter's `courseId` must match an active course slug.
   - Every lesson's `chapterId` must match an active chapter `id`.
   - Every lesson's `courseId` must match an active course slug.
3. **Ordering Constraints**:
   - Lesson orders within a chapter must be strictly unique numbers.
4. **Metadata Completeness**:
   - All lessons must specify a non-empty `title`, `description`, positive `estimatedReadingTime`, and at least one learning objective.
