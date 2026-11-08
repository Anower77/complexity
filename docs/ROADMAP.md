# Roadmap & Milestones: Complexity

> Version: 1.0.1  
> Scope: Platform Milestones & 6-Phase Engineering Curriculum

---

## 1. Platform Engineering Milestones

### Milestone 1: Platform Foundation & Content Infrastructure (COMPLETED)
- [x] Initialized Astro 5 with TypeScript strict mode, React 19, and Tailwind CSS.
- [x] Built the editorial design system (archival light / technical slate dark themes with zero FOUC).
- [x] Implemented data-driven course navigation and content loaders (`course-loader`, `chapter-loader`, `lesson-loader`).
- [x] Implemented automated content validation engine checking duplicate slugs, ordering, and metadata integrity.
- [x] Built ByteByteGo-inspired 3-column lesson reading layout with persistent course sidebar, breadcrumbs, on-page Table of Contents, and reading progress.
- [x] Implemented browser `localStorage` progress tracking with completion checkmarks.
- [x] Built reusable visualization interfaces (`DiagramContainer`, `InteractiveDiagram`, `ComponentInspector`, `KnowledgeCheck`).
- [x] Established automated Vitest test suite and verified 100% test pass rate.
- [x] Configured GitHub Actions CI/CD workflow for GitHub Pages deployment.
- [x] Authored complete documentation suite across 10 specifications in `/docs`.

### Milestone 2: Foundation Concepts Rollout (NEXT)
- [ ] Expand Phase 1: Engineering Foundations lessons (How the Internet Works, Processes & Threads, Memory Hierarchy).
- [ ] Add interactive networking packet simulator (Client → DNS → Gateway → Socket).
- [ ] Add TCP 3-way handshake interactive state machine.

### Milestone 3: Infrastructure Curriculum & Simulators
- [ ] Author Docker container internals and OverlayFS lesson.
- [ ] Author Nginx reverse proxy and load balancing algorithms lesson.
- [ ] Author Redis in-memory caching and cache-aside simulation.
- [ ] Implement Redis cache hit/miss workload visualizer.

### Milestone 4: Distributed Systems & Message Brokers
- [ ] Author Kafka and RabbitMQ event streaming lessons.
- [ ] Build interactive queue depth and consumer lag simulator.
- [ ] Author database replication and partitioning case studies.

### Milestone 5: System Design Stories & Case Studies
- [ ] Design a Scalable URL Shortener end-to-end interactive case study.
- [ ] Design YouTube Video Streaming & Transcoding Pipeline.
- [ ] Design Real-Time Chat & WebSocket Connection Manager.

---

## 2. The 6-Phase Technical Curriculum

- **Phase 1: Engineering Foundations** — Sockets, processes, threads, memory hierarchy, DNS, HTTP/HTTPS, TCP vs UDP.
- **Phase 2: Infrastructure** — Virtual machines, Docker, containerd, Nginx, Redis, PostgreSQL, connection pooling.
- **Phase 3: Backend & Distributed Systems** — REST APIs, API gateways, message queues, Kafka, background workers, replication.
- **Phase 4: Production Engineering** — High availability, horizontal scaling, rate limiting, circuit breakers, observability.
- **Phase 5: System Design Stories** — URL shortener, YouTube, WhatsApp, Uber, Netflix, payment ledgers.
- **Phase 6: Advanced Architecture** — Event sourcing, CQRS, multi-region active-active, consensus (Raft/Paxos).
