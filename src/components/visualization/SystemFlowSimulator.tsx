import React, { useState } from 'react';
import { Zap, Server, Database, Globe, Shield, RefreshCw } from 'lucide-react';

type TrafficMode = 'normal' | 'surge' | 'cache-failure';

interface NodeMetrics {
  qps: number;
  latencyMs: number;
  cacheHitPct: number;
  dbSaturationPct: number;
  activeSockets: number;
}

export default function SystemFlowSimulator() {
  const [mode, setMode] = useState<TrafficMode>('normal');
  const [selectedNode, setSelectedNode] = useState<string | null>('gateway');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Dynamic metrics based on mode
  const metrics: Record<TrafficMode, NodeMetrics> = {
    normal: {
      qps: 12500,
      latencyMs: 14,
      cacheHitPct: 94.2,
      dbSaturationPct: 22,
      activeSockets: 340
    },
    surge: {
      qps: 85000,
      latencyMs: 68,
      cacheHitPct: 91.5,
      dbSaturationPct: 78,
      activeSockets: 2150
    },
    'cache-failure': {
      qps: 12500,
      latencyMs: 195,
      cacheHitPct: 0.0,
      dbSaturationPct: 99,
      activeSockets: 4800
    }
  };

  const current = metrics[mode];

  const nodeDetails: Record<string, { title: string; role: string; details: string; status: 'healthy' | 'warning' | 'danger' }> = {
    client: {
      title: 'Client Layer (Web & Mobile)',
      role: 'Traffic Ingress Origin',
      details: `Originating ${current.qps.toLocaleString()} requests/second across global clients. Ephemeral ports multiplexed over HTTP/2.`,
      status: 'healthy'
    },
    dns: {
      title: 'Anycast DNS & Edge CDN',
      role: 'Edge Demarcation',
      details: 'Resolves IP via Geo-DNS within 4ms. Edge CDN absorbs static assets and provides DDoS protection.',
      status: 'healthy'
    },
    gateway: {
      title: 'Nginx L7 Reverse Proxy',
      role: 'Load Balancing & SSL Termination',
      details: `Terminates TLS 1.3, manages ${current.activeSockets.toLocaleString()} open socket file descriptors. Round-robin forwarding to backend workers.`,
      status: mode === 'surge' ? 'warning' : 'healthy'
    },
    backend: {
      title: 'Application Service Cluster',
      role: 'Business Logic & Concurrency',
      details: `Stateless worker processes. Average execution time ${current.latencyMs}ms. Queries Redis cache before falling back to Postgres.`,
      status: mode === 'cache-failure' ? 'danger' : (mode === 'surge' ? 'warning' : 'healthy')
    },
    redis: {
      title: 'Redis In-Memory Cluster',
      role: 'Sub-millisecond Key-Value Cache',
      details: mode === 'cache-failure'
        ? 'OUTAGE: Redis instance unresponsive! 100% of read traffic falling through to relational database (Thundering Herd).'
        : `Operating at ${current.cacheHitPct}% cache hit ratio. Average read latency: 0.8ms.`,
      status: mode === 'cache-failure' ? 'danger' : 'healthy'
    },
    database: {
      title: 'PostgreSQL (Primary + Replicas)',
      role: 'ACID Relational Storage',
      details: mode === 'cache-failure'
        ? 'CRITICAL SATURATION: Connection pool exhausted (99% capacity). Disk I/O queue backed up.'
        : `Database load at ${current.dbSaturationPct}% capacity. Connection pool: 24 active sockets.`,
      status: mode === 'cache-failure' ? 'danger' : (mode === 'surge' ? 'warning' : 'healthy')
    }
  };

  const activeInfo = selectedNode ? nodeDetails[selectedNode] : nodeDetails.gateway;

  return (
    <div className="w-full rounded-xl border border-border-strong bg-surface glow-card overflow-hidden">
      {/* Controls & Metrics Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-border-subtle bg-surface-elevated/70 gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              mode === 'normal' ? 'bg-emerald-400' : (mode === 'surge' ? 'bg-amber-400' : 'bg-red-400')
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              mode === 'normal' ? 'bg-emerald-500' : (mode === 'surge' ? 'bg-amber-500' : 'bg-red-500')
            }`}></span>
          </span>
          <span className="font-mono text-xs font-bold text-text-primary tracking-wider uppercase">
            LIVE ARCHITECTURE SIMULATOR
          </span>
          <span className="text-[11px] font-mono text-text-muted hidden md:inline">
            • Real-time packet flow & bottleneck model
          </span>
        </div>

        {/* Mode Selector Buttons */}
        <div className="flex items-center gap-1.5 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setMode('normal')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
              mode === 'normal'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'text-text-muted hover:text-text-primary bg-surface border border-border-subtle'
            }`}
          >
            Normal (12.5k QPS)
          </button>
          <button
            type="button"
            onClick={() => setMode('surge')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
              mode === 'surge'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold'
                : 'text-text-muted hover:text-text-primary bg-surface border border-border-subtle'
            }`}
          >
            Traffic Surge (85k)
          </button>
          <button
            type="button"
            onClick={() => setMode('cache-failure')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
              mode === 'cache-failure'
                ? 'bg-red-500/10 text-red-400 border border-red-500/30 font-semibold'
                : 'text-text-muted hover:text-text-primary bg-surface border border-border-subtle'
            }`}
          >
            Cache Outage
          </button>
        </div>
      </div>

      {/* Main Interactive Diagram Canvas */}
      <div className="p-6 sm:p-8 relative bg-tech-grid min-h-[340px] flex flex-col justify-between">
        {/* Nodes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 relative z-10">
          {/* Node 1: Client */}
          <button
            type="button"
            onClick={() => setSelectedNode('client')}
            className={`p-3 rounded-lg border text-left transition-all ${
              selectedNode === 'client'
                ? 'border-brand bg-brand-subtle ring-2 ring-brand/30 shadow-md'
                : 'border-border-subtle bg-surface hover:border-border-strong hover:bg-surface-elevated'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Globe className="w-4 h-4 text-brand" />
              <span className="font-mono text-[9px] text-text-muted">PORT: 5421</span>
            </div>
            <div className="font-technical text-xs font-bold text-text-primary truncate">Clients</div>
            <div className="font-mono text-[10px] text-text-muted mt-1">{current.qps.toLocaleString()} req/s</div>
          </button>

          {/* Node 2: DNS / CDN */}
          <button
            type="button"
            onClick={() => setSelectedNode('dns')}
            className={`p-3 rounded-lg border text-left transition-all ${
              selectedNode === 'dns'
                ? 'border-brand bg-brand-subtle ring-2 ring-brand/30 shadow-md'
                : 'border-border-subtle bg-surface hover:border-border-strong hover:bg-surface-elevated'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-4 h-4 text-purple-400" />
              <span className="font-mono text-[9px] text-emerald-400">DNS: 4ms</span>
            </div>
            <div className="font-technical text-xs font-bold text-text-primary truncate">Edge Anycast</div>
            <div className="font-mono text-[10px] text-text-muted mt-1">Cloudflare / BGP</div>
          </button>

          {/* Node 3: Reverse Proxy / LB */}
          <button
            type="button"
            onClick={() => setSelectedNode('gateway')}
            className={`p-3 rounded-lg border text-left transition-all ${
              selectedNode === 'gateway'
                ? 'border-brand bg-brand-subtle ring-2 ring-brand/30 shadow-md'
                : 'border-border-subtle bg-surface hover:border-border-strong hover:bg-surface-elevated'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-[9px] text-text-muted">PORT: 443</span>
            </div>
            <div className="font-technical text-xs font-bold text-text-primary truncate">Nginx Proxy</div>
            <div className="font-mono text-[10px] text-text-muted mt-1">{current.activeSockets} sockets</div>
          </button>

          {/* Node 4: Backend Cluster */}
          <button
            type="button"
            onClick={() => setSelectedNode('backend')}
            className={`p-3 rounded-lg border text-left transition-all ${
              selectedNode === 'backend'
                ? 'border-brand bg-brand-subtle ring-2 ring-brand/30 shadow-md'
                : 'border-border-subtle bg-surface hover:border-border-strong hover:bg-surface-elevated'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-[9px] text-text-muted">RPC</span>
            </div>
            <div className="font-technical text-xs font-bold text-text-primary truncate">App Cluster</div>
            <div className="font-mono text-[10px] text-text-muted mt-1">{current.latencyMs}ms p99</div>
          </button>

          {/* Node 5: Redis */}
          <button
            type="button"
            onClick={() => setSelectedNode('redis')}
            className={`p-3 rounded-lg border text-left transition-all ${
              selectedNode === 'redis'
                ? 'border-brand bg-brand-subtle ring-2 ring-brand/30 shadow-md'
                : (mode === 'cache-failure' ? 'border-red-500/50 bg-red-500/5' : 'border-border-subtle bg-surface hover:border-border-strong')
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <RefreshCw className={`w-4 h-4 ${mode === 'cache-failure' ? 'text-red-400' : 'text-emerald-400'}`} />
              <span className={`font-mono text-[9px] ${mode === 'cache-failure' ? 'text-red-400 font-bold' : 'text-emerald-400'}`}>
                {mode === 'cache-failure' ? 'OFFLINE' : `${current.cacheHitPct}%`}
              </span>
            </div>
            <div className="font-technical text-xs font-bold text-text-primary truncate">Redis Cache</div>
            <div className="font-mono text-[10px] text-text-muted mt-1">In-Memory</div>
          </button>

          {/* Node 6: PostgreSQL */}
          <button
            type="button"
            onClick={() => setSelectedNode('database')}
            className={`p-3 rounded-lg border text-left transition-all ${
              selectedNode === 'database'
                ? 'border-brand bg-brand-subtle ring-2 ring-brand/30 shadow-md'
                : (mode === 'cache-failure' ? 'border-red-500/50 bg-red-500/5' : 'border-border-subtle bg-surface hover:border-border-strong')
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Database className="w-4 h-4 text-blue-400" />
              <span className={`font-mono text-[9px] ${current.dbSaturationPct > 70 ? 'text-red-400 font-bold' : 'text-text-muted'}`}>
                {current.dbSaturationPct}% LOAD
              </span>
            </div>
            <div className="font-technical text-xs font-bold text-text-primary truncate">PostgreSQL</div>
            <div className="font-mono text-[10px] text-text-muted mt-1">Primary + Replica</div>
          </button>
        </div>

        {/* Animated Connection Pipeline Indicator */}
        <div className="my-6 hidden sm:flex items-center justify-between px-6 py-2 rounded-lg bg-surface-elevated/80 border border-border-subtle font-mono text-[11px] text-text-muted">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand"></span>
            <span>TCP Handshake</span>
          </div>
          <span>──────►</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span>TLS 1.3 Key Exchange</span>
          </div>
          <span>──────►</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>HTTP/2 Stream Multiplex</span>
          </div>
          <span>──────►</span>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${mode === 'cache-failure' ? 'bg-red-400 animate-ping' : 'bg-emerald-400'}`}></span>
            <span>{mode === 'cache-failure' ? 'Cache Miss Fallback' : 'Cache-Aside Read'}</span>
          </div>
        </div>

        {/* Live Node Inspector Drawer */}
        <div className="p-4 rounded-lg bg-surface-elevated/90 border border-border-strong">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="font-technical text-sm font-bold text-text-primary">
                {activeInfo.title}
              </span>
              <span className="font-mono text-[10px] text-text-muted bg-surface px-1.5 py-0.5 rounded border border-border-subtle">
                {activeInfo.role}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-text-muted">Throughput: <strong className="text-text-primary">{current.qps.toLocaleString()} QPS</strong></span>
              <span className="text-text-muted">• Latency: <strong className={current.latencyMs > 50 ? 'text-amber-400' : 'text-emerald-400'}>{current.latencyMs}ms</strong></span>
            </div>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed font-technical">
            {activeInfo.details}
          </p>
        </div>
      </div>
    </div>
  );
}
