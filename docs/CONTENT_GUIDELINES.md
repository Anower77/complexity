# Content Guidelines: Complexity

> Version: 1.0.0  
> Core Standard: The 18-Step Editorial Framework

---

## 1. Editorial Philosophy

Complexity teaches systems engineering from first principles. Writing on Complexity must be rigorous, precise, accessible, and grounded in production realities.

### Core Tenets:
1. **Explain Before Assuming**: Never use an acronym or term (e.g., "TTL", "BGP", "epoll", "inode") without defining it or linking to its foundational concept first.
2. **Ground in Physics & OS Realities**: Don't treat software abstractions as magical black boxes. Map them to physical CPU registers, network interfaces, memory buffers, or kernel syscalls.
3. **No Fabricated Data**: Clearly distinguish between:
   - **Verified Physical Facts** (e.g., speed of light in fiber is ~5 microseconds per kilometer).
   - **Engineering Estimates** (e.g., standard round-trip time between US-East and EU-West is ~75ms).
   - **Hypothetical Scenarios** (e.g., "Let us imagine a high-traffic e-commerce flash sale receiving 50,000 checkout requests per second").
   - Never present an illustrative simulation calculation as an actual vendor-specific benchmark.

---

## 2. The 18-Step Standard Article Architecture

Every technical deep dive published under `/concepts/` or `/architecture/` must follow this reusable structure:

```markdown
1. Article Introduction
   - What this system/technology is in one crisp paragraph.
   - Core mental model.

2. The Real Engineering Problem
   - The real-world bottleneck or collapse scenario that happens without it.
   - The pain experienced by engineering teams before this existed.

3. Historical / Technical Background
   - When and why was it invented?
   - Key milestone papers or RFCs (e.g., RFC 2616, Google Bigtable paper).

4. Fundamental Explanation
   - Core concept explained in plain, accurate language.
   - Real-world physical analogy if appropriate.

5. Internal Working Mechanism
   - Data structures, state machines, and concurrency models.
   - Memory vs. disk storage patterns.

6. Architecture Diagram
   - Native interactive SVG or Mermaid system topology.
   - Component boundaries clearly defined.

7. Component-by-Component Explanation
   - Deep inspection of every node in the architecture diagram.
   - Responsibilities and operating invariants.

8. Request or Data Lifecycle
   - Step-by-step traversal: Step 1 (Ingress) → Step 2 (Validation) → Step 3 (Execution) → Step 4 (Storage) → Step 5 (Egress).

9. Interactive Visualization / Simulation
   - Embedded interactive simulator (e.g., adjusting hit ratios, server counts, or packet loss).

10. Industry Use Case
    - Real-world production adoption (e.g., GitHub, Discord, Cloudflare).
    - Verified architectural context.

11. Production Traffic Scenario
    - Normal operating conditions vs. 10x traffic spike.
    - Behavior of thread pools, buffers, and latencies.

12. Failure Scenarios
    - What happens during a crash, network partition, or disk saturation?
    - Cascading failure risks (thundering herds, retry storms).

13. Bottlenecks
    - Where does this technology hit a wall?
    - CPU bound vs. Memory bound vs. I/O bound vs. Network bound.

14. Trade-offs
    - What are you trading off? (e.g., Consistency vs. Availability, Latency vs. Durability).

15. Alternative Technologies
    - Comprehensive comparison matrix (Technology A vs. Technology B vs. Technology C).

16. Interview Questions & System Design Scenarios
    - Practical questions asked in senior engineering interviews.
    - Deep reasoning approaches.

17. Knowledge Check
    - 2 to 3 interactive scenario-based questions with detailed feedback.

18. Further Reading & Canonical RFCs
    - Authoritative papers, source code repositories, and documentation links.
```

---

## 3. MDX Frontmatter Schema

All articles must provide complete frontmatter complying with `src/content/config.ts`:

```yaml
---
title: "Redis: Understanding In-Memory Caching and Data Structures"
subtitle: "How single-threaded in-memory key-value stores absorb massive read traffic and protect relational databases."
phase: "infrastructure"
order: 8
difficulty: "intermediate"
readTimeMinutes: 14
publishedDate: "2026-11-08"
summary: "An in-depth exploration of Redis architecture, memory models, evictions policies, and cache degradation failure modes under extreme traffic."
tags: ["caching", "redis", "in-memory", "databases", "infrastructure"]
prerequisites:
  - "Client-Server Architecture"
  - "TCP vs UDP"
interactiveElements:
  - "RedisSimulator"
  - "CacheInspector"
relatedArticles:
  - "reverse-proxy-nginx"
  - "load-balancing-traffic"
---
```

---

## 4. Visual Components in Articles

Interactive components are imported and placed directly into MDX:

```mdx
import RedisSimulator from '@/components/simulations/RedisSimulator';
import ArchitectureDiagram from '@/components/diagrams/ArchitectureDiagram';

## 6. Architecture Diagram

<ArchitectureDiagram type="redis-cache-aside" client:visible />

...

## 9. Interactive Cache Simulator

<RedisSimulator client:visible />
```
