import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Cpu, Server, Activity, ArrowRight, Info, CheckCircle2 } from 'lucide-react';

interface SimulatedPod {
  id: number;
  name: string;
  ip: string;
  requestCount: number;
}

export default function TrafficSimulator() {
  const [numPods, setNumPods] = useState<number>(3);
  const [serviceType, setServiceType] = useState<'ClusterIP' | 'NodePort' | 'LoadBalancer'>('ClusterIP');
  const [selectedNode, setSelectedNode] = useState<string>('Node 1');
  const [totalRequests, setTotalRequests] = useState<number>(10);
  const [sentCount, setSentCount] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [lastTargetPod, setLastTargetPod] = useState<string | null>(null);

  // Initialize pods based on count
  const [podStats, setPodStats] = useState<SimulatedPod[]>([
    { id: 1, name: 'api-pod-1', ip: '10.244.1.15', requestCount: 0 },
    { id: 2, name: 'api-pod-2', ip: '10.244.2.32', requestCount: 0 },
    { id: 3, name: 'api-pod-3', ip: '10.244.3.48', requestCount: 0 },
  ]);

  // Adjust pods when numPods changes
  useEffect(() => {
    setPodStats((prev) => {
      const newPods: SimulatedPod[] = [];
      for (let i = 1; i <= numPods; i++) {
        const existing = prev.find((p) => p.id === i);
        if (existing) {
          newPods.push(existing);
        } else {
          newPods.push({
            id: i,
            name: `api-pod-${i}`,
            ip: `10.244.${i}.${Math.floor(Math.random() * 80) + 10}`,
            requestCount: 0,
          });
        }
      }
      return newPods;
    });
  }, [numPods]);

  // Simulation execution loop
  useEffect(() => {
    if (!isSimulating) return;

    if (sentCount >= totalRequests) {
      setIsSimulating(false);
      return;
    }

    const timer = setTimeout(() => {
      // Illustrative routing: round-robin selection with small probabilistic jitter
      const targetIndex = sentCount % numPods;
      const target = podStats[targetIndex];

      if (target) {
        setPodStats((prev) =>
          prev.map((p) =>
            p.id === target.id ? { ...p, requestCount: p.requestCount + 1 } : p
          )
        );
        setLastTargetPod(target.name);
        setSentCount((prev) => prev + 1);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [isSimulating, sentCount, totalRequests, numPods, podStats]);

  const handleStart = () => {
    if (sentCount >= totalRequests) {
      // reset counts first
      setSentCount(0);
      setPodStats((prev) => prev.map((p) => ({ ...p, requestCount: 0 })));
    }
    setIsSimulating(true);
  };

  const handleReset = () => {
    setIsSimulating(false);
    setSentCount(0);
    setLastTargetPod(null);
    setPodStats((prev) => prev.map((p) => ({ ...p, requestCount: 0 })));
  };

  return (
    <div className="w-full my-8 rounded-xl border border-border-strong bg-surface glow-card overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-border-subtle bg-surface-elevated/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="font-mono text-xs font-bold text-brand uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span>KUBERNETES SERVICE TRAFFIC SIMULATOR</span>
          </div>
          <h4 className="font-editorial text-lg font-bold text-text-primary">
            Backend Endpoint Request Distribution
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={isSimulating ? () => setIsSimulating(false) : handleStart}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-brand text-white text-xs font-mono font-semibold hover:bg-brand-hover shadow-sm transition-all"
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isSimulating ? 'Pause' : 'Dispatch Requests'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded border border-border-subtle text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors"
            title="Reset simulator"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Control Inputs */}
      <div className="p-5 border-b border-border-subtle bg-surface/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-technical">
        {/* Service Type */}
        <div className="space-y-1.5">
          <label className="font-mono text-[10px] text-text-muted uppercase tracking-wider block">
            Service Type
          </label>
          <select
            value={serviceType}
            disabled={isSimulating}
            onChange={(e) => setServiceType(e.target.value as any)}
            className="w-full px-3 py-1.5 rounded bg-surface border border-border-subtle text-text-primary font-mono text-xs focus:outline-none focus:border-brand"
          >
            <option value="ClusterIP">ClusterIP (Internal)</option>
            <option value="NodePort">NodePort (Host Ports)</option>
            <option value="LoadBalancer">LoadBalancer (Cloud LB)</option>
          </select>
        </div>

        {/* Node selector for NodePort */}
        {serviceType === 'NodePort' ? (
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] text-text-muted uppercase tracking-wider block">
              Target Ingress Node
            </label>
            <select
              value={selectedNode}
              disabled={isSimulating}
              onChange={(e) => setSelectedNode(e.target.value)}
              className="w-full px-3 py-1.5 rounded bg-surface border border-border-subtle text-text-primary font-mono text-xs focus:outline-none focus:border-brand"
            >
              <option value="Node 1">Node 1 (192.168.1.101:30080)</option>
              <option value="Node 2">Node 2 (192.168.1.102:30080)</option>
              <option value="Node 3">Node 3 (192.168.1.103:30080)</option>
            </select>
          </div>
        ) : (
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] text-text-muted uppercase tracking-wider block">
              Request Batch Volume
            </label>
            <select
              value={totalRequests}
              disabled={isSimulating}
              onChange={(e) => setTotalRequests(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded bg-surface border border-border-subtle text-text-primary font-mono text-xs focus:outline-none focus:border-brand"
            >
              <option value={10}>10 Requests</option>
              <option value={20}>20 Requests</option>
              <option value={50}>50 Requests</option>
            </select>
          </div>
        )}

        {/* Number of Pods */}
        <div className="space-y-1.5">
          <label className="font-mono text-[10px] text-text-muted uppercase tracking-wider block">
            Backend Pods ({numPods})
          </label>
          <input
            type="range"
            min={1}
            max={5}
            value={numPods}
            disabled={isSimulating}
            onChange={(e) => setNumPods(Number(e.target.value))}
            className="w-full accent-brand cursor-pointer"
          />
        </div>

        {/* Progress Stats */}
        <div className="space-y-1.5">
          <label className="font-mono text-[10px] text-text-muted uppercase tracking-wider block">
            Progress
          </label>
          <div className="font-mono text-xs font-semibold text-text-primary py-1.5">
            {sentCount} of {totalRequests} sent{' '}
            <span className="text-brand font-normal">
              ({Math.round((sentCount / totalRequests) * 100)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Visual Distribution Canvas */}
      <div className="p-6 bg-tech-grid">
        <div className="space-y-4 max-w-2xl mx-auto">
          {podStats.map((pod) => {
            const percentage = sentCount > 0 ? Math.round((pod.requestCount / sentCount) * 100) : 0;
            const isReceiving = lastTargetPod === pod.name && isSimulating;

            return (
              <div
                key={pod.id}
                className={`p-4 rounded-lg border transition-all ${
                  isReceiving
                    ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30 shadow'
                    : 'border-border-subtle bg-surface'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-text-primary">
                      {pod.name}
                    </span>
                    <span className="font-mono text-[11px] text-text-muted">
                      ({pod.ip}:8080)
                    </span>
                  </div>

                  <div className="font-mono text-xs font-semibold text-text-primary">
                    {pod.requestCount} reqs{' '}
                    <span className="text-text-muted font-normal">({percentage}%)</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-surface-muted h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-brand h-full rounded-full transition-all duration-200"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assumptions & Educational Disclaimer Banner (Section 8 Requirement) */}
      <div className="p-4 border-t border-border-subtle bg-surface-elevated/90 flex items-start gap-3 text-xs text-text-secondary font-technical">
        <Info className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-text-primary">Educational Model Note:</strong> This simulation illustrates the conceptual load distribution pattern across Kubernetes Endpoint instances. In production, kube-proxy iptables mode uses random probability weights (<code className="font-mono">--mode random</code>), IPVS mode supports least-connections or weighted round-robin, and eBPF/Cilium implementations optimize socket bypasses. Distribution in small request batches is probabilistic, not strictly static round-robin.
        </p>
      </div>
    </div>
  );
}
