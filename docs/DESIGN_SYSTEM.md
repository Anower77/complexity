# Design System: Complexity

> Version: 1.0.0  
> Philosophy: Editorial Technical Minimalism

---

## 1. Brand Identity & Personality

Complexity is designed as an intelligent, technical, and editorial publication. It merges the typographical rigor of classic print journalism with the dynamic observability of modern distributed systems tools.

### Brand Attributes
- **Intelligent**: Treats the reader with respect; avoids condescension, oversimplification, or hand-wavy analogies.
- **Technical**: Uses precise engineering terminology, physical constraints (CPU cycles, sockets, packets), and exact data flow representations.
- **Minimal**: Whitespace is an active design element. No decorative clutter, unnecessary cards, or visual noise.
- **Editorial**: High-contrast serif headlines, balanced line lengths (65–75 characters), and comfortable reading rhythm.
- **Professional**: Monospaced data tags, structural borders, clean line art diagrams, and restrained palette.
- **Experimental**: Interactive visualizers invite readers to push systems to failure and observe the consequences.

### Anti-Patterns (Explicitly Avoided)
- ❌ **Generic SaaS Dashboard aesthetic**: No glowing gradient cards, rounded neon buttons, or cookie-cutter templates.
- ❌ **Excessive Glassmorphism**: No heavily blurred translucent surfaces that compromise legibility.
- ❌ **Emoji Illustrations**: No rocket ships, fire emojis, or cartoonish graphics representing servers or databases.
- ❌ **Gratuitous Animation**: Animations must communicate data movement or state transition; never animate for pure decoration.

---

## 2. Typography

Complexity pairs a high-character editorial serif with an ultra-clean technical sans-serif and an engineered monospace font.

| Role | Font Family | Fallback Stack | Usage |
| :--- | :--- | :--- | :--- |
| **Editorial Serif** | *Instrument Serif / Newsreader / Georgia* | `Georgia, serif` | Article titles, chapter headings, editorial pull-quotes |
| **Technical Sans** | *Inter / Geist Sans / System UI* | `system-ui, -apple-system, sans-serif` | Body text, UI controls, navigation, component labels |
| **Engineered Mono** | *JetBrains Mono / Geist Mono* | `ui-monospace, SFMono-Regular, monospace` | Code snippets, terminal outputs, metrics, packet headers |

### Type Scale
- **Display 1 (H1)**: `2.75rem (44px)` / Line Height `1.15` / Editorial Serif / Bold
- **Display 2 (H2)**: `2.00rem (32px)` / Line Height `1.25` / Editorial Serif / SemiBold
- **Section Heading (H3)**: `1.375rem (22px)` / Line Height `1.35` / Technical Sans / Medium
- **Subheading (H4)**: `1.125rem (18px)` / Line Height `1.4` / Technical Sans / SemiBold
- **Body Large**: `1.125rem (18px)` / Line Height `1.75` / Max width 68ch
- **Body Regular**: `1.000rem (16px)` / Line Height `1.65` / UI text and secondary descriptions
- **Caption / Mono**: `0.875rem (14px)` / Line Height `1.5` / Metrics, timestamps, tags

---

## 3. Color Tokens & Theme Architecture

The system provides fully tuned Dark and Light themes implemented via CSS variables.

```css
:root {
  /* Light Theme — Archival Paper & Ink */
  --bg-canvas: #fcfcfb;
  --bg-surface: #ffffff;
  --bg-surface-elevated: #f4f4f2;
  --border-subtle: #e5e5e0;
  --border-strong: #27272a;
  
  --text-primary: #121212;
  --text-secondary: #52525b;
  --text-muted: #71717a;
  
  --accent: #2563eb;          /* Technical Blue */
  --accent-subtle: #eff6ff;
  
  --status-success: #16a34a;  /* Operational */
  --status-warning: #d97706;  /* Degraded / Saturation */
  --status-danger: #dc2626;   /* Node Outage / Latency Spike */
  --status-info: #0284c7;
}

.dark {
  /* Dark Theme — Deep Slate & Technical Charcoal */
  --bg-canvas: #090a0f;
  --bg-surface: #11131a;
  --bg-surface-elevated: #181b24;
  --border-subtle: #222634;
  --border-strong: #3b4254;
  
  --text-primary: #f4f4f6;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;
  
  --accent: #3b82f6;          /* Technical Blue */
  --accent-subtle: #1e293b;
  
  --status-success: #22c55e;
  --status-warning: #f59e0b;
  --status-danger: #ef4444;
  --status-info: #38bdf8;
}
```

---

## 4. Diagram & Visualization Aesthetic

Architecture diagrams must look native to the editorial style:
- **Clean Vectors**: 1.5px stroke width, rounded corners (4px radius), subtle grid backdrops (16px dot matrix or faint graph grid).
- **Functional Color Only**: Colors are used exclusively to indicate component state:
  - Grey / Neutral: Idle, operational base state.
  - Accent (Blue): Active request path / selected component.
  - Warning (Amber): High queue backlog, degraded cache, high memory pressure.
  - Danger (Red): Network partition, dropped packets, 5xx responses.
- **Interactive States**:
  - Hover: Subtle border contrast increase and connection highlight.
  - Active / Selected: Opens the ComponentInspector showing internal properties (e.g. socket state, buffer size, latency contribution).

---

## 5. UI Primitives & Components

- **Buttons**: Flat, high-contrast borders, minimal padding, monospace labels (`[ EXPLORE ]`, `[ SIMULATE ]`).
- **Sliders**: Precision step controls with numeric value callout and unit badge (`5,000 req/s`).
- **Cards**: Single hairline border (`--border-subtle`), flat background, zero box-shadow in light mode or faint glow in dark mode.
- **Inspectors**: Side drawers or embedded panels with structured key-value tables and state badges.
- **Knowledge Check Blocks**: Multi-choice options with instant rationale disclosure upon selection.
