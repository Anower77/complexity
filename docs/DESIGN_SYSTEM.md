# Design System: Complexity (v1.0.4)

## 1. Overview & Architectural Philosophy

Complexity is an engineering knowledge publication and interactive visualization platform. The design system is engineered for technical clarity, high typographical legibility, calm color restraint, and functional visual feedback.

### Core Principles
1. **Restraint over Decoration**: No gratuitous gradients, glowing neon borders, or generic marketing fluff. Every visual cue communicates meaning (state, topology, packet movement, or hierarchy).
2. **First-Principles Accuracy**: Architecture diagrams depict realistic component boundaries, protocols, and failure modes.
3. **Dual-Theme Rigor**: Light and dark themes are designed symmetrically with strict WCAG AA contrast compliance.
4. **Accessible Visualizations**: Interactive visualizers provide accessible keyboard controls, step-by-step descriptions, and respect `prefers-reduced-motion`.

---

## 2. Centralized Color Tokens

Tokens are defined via CSS variables in `src/styles/theme.css` and exposed to Tailwind CSS in `tailwind.config.ts`.

### Light Theme (Archival Blueprint & Editorial Slate)
- **Canvas (`--bg-canvas`)**: `#F8FAFC` (Clean, warm neutral paper)
- **Surface (`--bg-surface`)**: `#FFFFFF` (Card and panel backgrounds)
- **Surface Elevated (`--bg-surface-elevated`)**: `#F1F5F9` (Hover states, toolbar items, tags)
- **Surface Muted (`--bg-surface-muted`)**: `#E2E8F0` (Dividers, disabled states)
- **Border Subtle (`--border-subtle`)**: `#E2E8F0` (Structural hairline borders)
- **Border Strong (`--border-strong`)**: `#CBD5E1` (Active card borders, inputs)
- **Text Primary (`--text-primary`)**: `#172033` (Contrast ratio > 11:1 against canvas)
- **Text Secondary (`--text-secondary`)**: `#64748B` (Descriptions, metadata)
- **Text Muted (`--text-muted`)**: `#94A3B8` (Captions, footnotes, timestamps)
- **Brand Primary Accent (`--brand-primary`)**: `#315E8A` (Deep architectural steel blue)
- **Brand Subtle (`--brand-subtle`)**: `#EAF1F8` (Tinted highlight badges and active nodes)
- **Secondary Accent (`--accent-secondary`)**: `#397C78` (Subtle engineering teal)

### Dark Theme (Engineered Obsidian & Technical Slate)
- **Canvas (`--bg-canvas`)**: `#10151D` (Deep matte technical slate)
- **Surface (`--bg-surface`)**: `#171F2B` (Panels, code blocks, cards)
- **Surface Elevated (`--bg-surface-elevated`)**: `#1E2938` (Toolbars, inputs, hover state)
- **Surface Muted (`--bg-surface-muted`)**: `#273549` (Selected rows, inactive controls)
- **Border Subtle (`--border-subtle`)**: `#2B394A` (Hairline component separators)
- **Border Strong (`--border-strong`)**: `#3B4E65` (High-visibility borders)
- **Text Primary (`--text-primary`)**: `#E7EDF5` (Crisp contrast ratio > 12:1)
- **Text Secondary (`--text-secondary`)**: `#A3B0C2` (Secondary text, descriptions)
- **Text Muted (`--text-muted`)**: `#728299` (Captions, non-essential details)
- **Brand Primary Accent (`--brand-primary`)**: `#83ADD6` (Light steel blue, vibrant on dark)
- **Brand Subtle (`--brand-subtle`)**: `#22364A` (Low-contrast background tint)
- **Secondary Accent (`--accent-secondary`)**: `#75B6A9` (Muted mint teal)

### Status Tokens (Both Themes)
- **Success (`--status-success`)**: `#10B981` (Light) / `#34D399` (Dark) — Healthy nodes, 200 OK
- **Warning (`--status-warning`)**: `#F59E0B` (Light) / `#FBBF24` (Dark) — High latency, queue backlog
- **Danger (`--status-danger`)**: `#EF4444` (Light) / `#F87171` (Dark) — Outage, packet drops, 5xx
- **Info (`--status-info`)**: `#315E8A` (Light) / `#83ADD6` (Dark) — Informational annotations

---

## 3. Typography System

| Role | Font Family | Tailwind Class | Application |
| :--- | :--- | :--- | :--- |
| **Editorial Headings** | Newsreader, Georgia, serif | `font-editorial` | Article titles, Hero headlines, section titles |
| **Technical Body & UI** | Inter, system-ui, sans-serif | `font-technical` / `font-sans` | Explanations, UI controls, navigation |
| **Engineered Code & Tags**| JetBrains Mono, monospace | `font-mono` | Code snippets, metrics, IP/ports, metadata |

### Hierarchy Scale
- **Display 1**: `text-4xl sm:text-6xl lg:text-7xl` / line-height `1.08`
- **Section Heading (H2)**: `text-2xl sm:text-4xl` / line-height `1.2`
- **Subheading (H3)**: `text-lg sm:text-xl` / line-height `1.3`
- **Body Large**: `text-base sm:text-lg` / max-width `70ch` / line-height `1.75`
- **Body Regular**: `text-sm sm:text-base` / line-height `1.65`
- **Caption / Metadata**: `text-xs font-mono` / line-height `1.4`

---

## 4. Spacing, Grids & Layout Invariants

- **Maximum Page Container**: `max-w-layout` (`1440px`), centered with `mx-auto px-4 sm:px-6`.
- **Article Reading Column**: `max-w-content` (`900px`) and `max-w-reading` (`70ch`).
- **Sidebar Dimensions**:
  - Left navigation: `width: 280px–300px` (desktop), collapsible drawer on mobile/tablet.
  - Right table-of-contents: `width: 240px` (desktop xl).
- **Border Radius Standards**:
  - Small tags and buttons: `rounded-md` (`6px`)
  - Panels, cards, diagrams: `rounded-lg` (`8px`)
  - Full pills: `rounded-full` (`9999px`)
- **Focus Indicators**: Visible focus outline on all interactive elements: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2`.

---

## 5. Diagram & Studio Visual Guidelines

1. **Vectors**: Hairline 1.5px or 2px stroke, crisp vector icons (Lucide React), subtle 20px dot grid canvas.
2. **Engineering Primitives**: Consistent semantic borders and badges for Client, Server, Database, Cache, Queue, Gateway, Load Balancer, Container, Pod, and Cloud.
3. **Connections**: Clean bezier or orthogonal lines with arrowheads indicating request and response flow direction.
