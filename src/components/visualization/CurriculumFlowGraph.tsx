import React, { useState } from 'react';
import { ArrowRight, Network } from 'lucide-react';
import { formatPath } from '@/lib/utilities/url';

interface PhaseNode {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'active' | 'in-progress' | 'queued';
  prereq?: string;
  courseUrl?: string;
  topics: string[];
}

export default function CurriculumFlowGraph() {
  const [selectedPhase, setSelectedPhase] = useState<string>('phase-1');

  const phases: PhaseNode[] = [
    {
      id: 'phase-1',
      step: '01',
      title: 'Engineering Foundations',
      subtitle: 'Sockets, Transport Protocols, Hardware & Network Demarcation',
      difficulty: 'Beginner',
      status: 'active',
      courseUrl: formatPath('/courses/system-architecture-fundamentals'),
      topics: [
        'Client-Server Topology & Network Invariants',
        'TCP 3-Way Handshake vs UDP Datagrams',
        'DNS Tree Resolution, Root Nameservers & TTL Caching',
        'Stateless Protocols & Horizontal Scaling Foundations'
      ]
    },
    {
      id: 'phase-2',
      step: '02',
      title: 'Infrastructure & Linux',
      subtitle: 'Kernel Syscalls, Container Runtimes, Reverse Proxies & In-Memory Caching',
      difficulty: 'Intermediate',
      status: 'in-progress',
      prereq: 'Phase 01: Engineering Foundations',
      courseUrl: formatPath('/courses/system-architecture-fundamentals'),
      topics: [
        'Linux Processes, File Descriptors & Epoll Event Loop',
        'Docker Internals: Linux Namespaces, Cgroups & OverlayFS',
        'Nginx Reverse Proxying, Upstreams & SSL Termination',
        'Redis In-Memory Key-Value Caching & Eviction Policies'
      ]
    },
    {
      id: 'phase-3',
      step: '03',
      title: 'Backend & Distributed Systems',
      subtitle: 'Message Brokers, Event Streams, Replication & Partitioning',
      difficulty: 'Intermediate',
      status: 'queued',
      prereq: 'Phase 02: Infrastructure & Linux',
      topics: [
        'Asynchronous Task Queues & Dead Letter Exchanges (RabbitMQ)',
        'Kafka Commit Logs, Partitions & Consumer Groups',
        'Database Replication: Sync vs Async & Replication Lag',
        'Horizontal Database Sharding & Consistent Hashing'
      ]
    },
    {
      id: 'phase-4',
      step: '04',
      title: 'Production Engineering',
      subtitle: 'Fault Tolerance, Graceful Degradation, Rate Limiting & SRE',
      difficulty: 'Advanced',
      status: 'queued',
      prereq: 'Phase 03: Distributed Systems',
      topics: [
        'Token Bucket & Sliding Window Rate Limiting Algorithms',
        'Circuit Breakers: Closed, Open & Half-Open State Machines',
        'Cascading Failures, Thundering Herds & Load Shedding',
        'Observability: OpenTelemetry Distributed Tracing'
      ]
    },
    {
      id: 'phase-5',
      step: '05',
      title: 'System Design Stories',
      subtitle: 'Production Architectural Blueprints & End-to-End Case Studies',
      difficulty: 'Advanced',
      status: 'queued',
      prereq: 'Phase 04: Production Engineering',
      topics: [
        'Design a High-Throughput URL Shortener (Base62 + Cache-Aside)',
        'Design Video Streaming (Chunked Transcoding DAGs + CDN)',
        'Design Real-Time Chat (WebSocket Connection Managers)',
        'Design Distributed Payment Ledger (Two-Phase Commit + Idempotency)'
      ]
    },
    {
      id: 'phase-6',
      step: '06',
      title: 'Advanced Architecture',
      subtitle: 'Multi-Region Active-Active Systems & Distributed Consensus',
      difficulty: 'Advanced',
      status: 'queued',
      prereq: 'Phase 05: System Design Stories',
      topics: [
        'Distributed Consensus: Paxos & Raft Leader Election',
        'CQRS (Command Query Responsibility Segregation)',
        'Event Sourcing & Append-Only Event Stores',
        'Multi-Region Active-Active Latency Routing'
      ]
    }
  ];

  const active = phases.find((p) => p.id === selectedPhase) || phases[0];

  return (
    <div className="w-full rounded-xl border border-border-strong bg-surface glow-card overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-border-subtle bg-surface-elevated/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-brand uppercase tracking-wider mb-1">
            <Network className="w-3.5 h-3.5" />
            <span>LEARNING PATH DEPENDENCY GRAPH</span>
          </div>
          <h3 className="font-technical text-base font-bold text-text-primary">
            Curriculum Flow & Prerequisites
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
          <span>Click any phase to inspect topics & dependencies</span>
        </div>
      </div>

      {/* Interactive Phase Flow Map */}
      <div className="p-4 sm:p-6 bg-tech-grid">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative">
          {phases.map((phase, idx) => {
            const isSelected = selectedPhase === phase.id;

            return (
              <div
                key={phase.id}
                onClick={() => setSelectedPhase(phase.id)}
                className={`p-4 rounded-lg border text-left cursor-pointer transition-all relative ${
                  isSelected
                    ? 'border-brand bg-brand-subtle ring-2 ring-brand/30 shadow-md scale-[1.02]'
                    : 'border-border-subtle bg-surface hover:border-border-strong hover:bg-surface-elevated'
                }`}
              >
                {/* Step Badge & Status */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-surface-elevated border border-border-subtle text-text-primary">
                    PHASE {phase.step}
                  </span>

                  {phase.status === 'active' ? (
                    <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
                      READY TO LEARN
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] text-text-muted bg-surface-elevated px-2 py-0.5 rounded border border-border-subtle">
                      {phase.difficulty.toUpperCase()}
                    </span>
                  )}
                </div>

                <h4 className="font-technical text-sm font-bold text-text-primary mb-1 line-clamp-1">
                  {phase.title}
                </h4>

                <p className="text-xs text-text-secondary line-clamp-2 mb-3 leading-relaxed">
                  {phase.subtitle}
                </p>

                {phase.prereq && (
                  <div className="font-mono text-[10px] text-text-muted border-t border-border-subtle pt-2 truncate">
                    Requires: <span className="text-text-secondary">{phase.prereq.split(':')[0]}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Phase Detail Drawer */}
      <div className="p-5 border-t border-border-strong bg-surface-elevated/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="font-mono text-xs text-brand font-semibold mb-1">
              SELECTED PHASE {active.step}
            </div>
            <h4 className="font-editorial text-xl font-bold text-text-primary">
              {active.title}
            </h4>
            <p className="text-xs text-text-secondary mt-1">
              {active.subtitle}
            </p>
          </div>

          {active.courseUrl && (
            <a
              href={active.courseUrl}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-brand text-white hover:bg-brand-hover text-xs font-semibold transition-colors self-start sm:self-center whitespace-nowrap shadow-sm"
            >
              <span>Explore Phase Guides</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Topics Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-border-subtle">
          {active.topics.map((topic, tIdx) => (
            <div key={tIdx} className="flex items-start gap-2 p-2 rounded bg-surface border border-border-subtle text-xs text-text-secondary font-technical">
              <span className="text-brand font-bold mt-0.5">✓</span>
              <span>{topic}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
