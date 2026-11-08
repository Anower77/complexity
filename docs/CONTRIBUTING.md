# Contributing Guidelines: Complexity

> Version: 1.0.0

Thank you for contributing to Complexity. This platform maintains high standards for technical accuracy, educational clarity, and visual precision.

---

## 1. Principles of Contribution

1. **Precision Over Hype**: Explain how systems actually work under the hood. Avoid hype words, hand-waving, or simplistic analogies that break down under scrutiny.
2. **First-Principles Derivation**: Build up from fundamental constraints (memory, network packets, file descriptors, disk sectors) before introducing high-level frameworks.
3. **Decoupled Simulation Logic**: Any interactive simulation must have its mathematical calculation engine placed in `src/lib/simulation/` as pure TypeScript functions, accompanied by unit tests.
4. **Accessible Visuals**: All diagrams must be responsive, maintain contrast standards (WCAG AA), and support keyboard navigation where interactive.

---

## 2. Article Authoring Workflow

1. **Verify Topic Coverage**: Check `docs/ROADMAP.md` to see where the topic fits within the 6-phase curriculum.
2. **Follow the 18-Step Architecture**: Every concept or system design story must implement the 18 steps described in `docs/CONTENT_GUIDELINES.md`.
3. **Create MDX File**:
   - Concepts: `src/content/concepts/<slug>.mdx`
   - Architecture: `src/content/architecture/<slug>.mdx`
4. **Frontmatter Validation**: Ensure all required metadata fields (title, subtitle, phase, order, difficulty, readTimeMinutes, tags, summary) validate against the Zod schema in `src/content/config.ts`.

---

## 3. Developing Interactive Simulators

1. **Simulations must reside in**:
   - Calculation engine: `src/lib/simulation/<name>.ts`
   - Unit tests: `src/lib/simulation/__tests__/<name>.test.ts`
   - React UI widget: `src/components/simulations/<Name>Simulator.tsx`
2. **Calculations must be pure**:
   ```typescript
   export interface CacheSimulationInput {
     qps: number;
     hitRatio: number; // 0.0 to 1.0
     cacheLatencyMs: number;
     dbLatencyMs: number;
     dbCapacityQps: number;
   }

   export interface CacheSimulationResult {
     cacheQps: number;
     dbQps: number;
     dbSaturationPct: number;
     effectiveLatencyMs: number;
     isDbOverloaded: boolean;
   }

   export function calculateCacheMetrics(input: CacheSimulationInput): CacheSimulationResult {
     // Pure mathematical calculation with documented assumptions
   }
   ```
3. **Transparent Assumptions**:
   Always surface a "Simulation Assumptions" collapsible panel within the UI, explaining formulas, fixed parameters, and limitations.

---

## 4. Code Standards & Quality Checks

Run the following checks before committing code:

```bash
# Verify TypeScript strict mode compilation
npm run typecheck

# Run unit tests
npm run test

# Build production static bundle and verify no broken internal links
npm run build
```

---

## 5. Pull Request Lifecycle

- Provide a concise description of the conceptual topic, new interactive diagram, or simulation enhancement.
- Include screenshots or recordings of interactive diagrams in both Light and Dark mode.
- Confirm all tests pass and documentation adheres to the editorial style guide.
