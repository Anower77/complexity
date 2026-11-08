# Component Guidelines: Complexity

> Version: 1.0.1

This guide governs component authoring, framework selection (Astro vs React), partial hydration strategies, and visual diagram conventions.

---

## 1. Astro vs. React Decision Matrix

Complexity follows the principle of **minimal client-side JavaScript**.

| Use Case | Recommended Framework | Hydration Directive |
| :--- | :--- | :--- |
| **Static Layout & Chrome** (Navbar, Footer, BaseLayout) | **Astro** | *None (Zero JS output)* |
| **Static Content Blocks** (Callouts, Tables, Headers, Badges) | **Astro** | *None (Zero JS output)* |
| **Theme Toggler** | **React** | `client:load` |
| **Course Navigation Sidebar** (LocalStorage progress syncing) | **React** | `client:load` |
| **Table of Contents** (Scroll & reading progress tracking) | **React** | `client:load` |
| **Interactive Diagrams** (Node inspection, state drawer) | **React** | `client:visible` |
| **Knowledge Checks** (Scenario quiz with instant feedback) | **React** | `client:visible` |
| **Search Dialog** | **React** | `client:load` |

---

## 2. Component Authoring Rules

### 2.1 Astro Components (`.astro`)
- Always declare strict typed props using TypeScript `interface Props`.
- Avoid hardcoded paths; use `formatPath('/target')` for all internal links to maintain GitHub Pages base path compatibility.
- Ensure all SVG icons or decorative visuals have `aria-hidden="true"`, and interactive icons provide `aria-label`.

### 2.2 React Components (`.tsx`)
- Keep business logic and calculation math in `src/lib/` outside component JSX.
- Always use standard JSX comments `{/* Comment */}`, never HTML comments `<!-- Comment -->`.
- Make event listeners passive where appropriate (e.g., scroll listeners).
- Clean up all event listeners and `IntersectionObserver` instances in `useEffect` return functions.

---

## 3. Visualization Guidelines

1. **Native Vectors**: Use SVG elements with CSS variables for stroke and fills. Diagrams scale sharply on 4K/retina displays.
2. **Container Uniformity**: Always wrap diagrams in `<DiagramContainer title="..." caption="...">` to maintain uniform border, background grid, and typography standards.
3. **Accessibility**: Provide meaningful `aria-label` tags on nodes and accessible text fallbacks for screen readers.
4. **Theme Awareness**: Use semantic CSS tokens (`var(--border-subtle)`, `var(--brand-primary)`) rather than hardcoded hex colors so diagrams adapt instantly to Dark and Light modes.
