import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Shuffle, Layers, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface PodInfo {
  id: string;
  name: string;
  ip: string;
  status: 'Running' | 'Recreating';
  requestsReceived: number;
}

export default function ServiceIntroDiagram() {
  const [pods, setPods] = useState<PodInfo[]>([
    { id: 'pod-1', name: 'web-pod-7d4f9', ip: '10.244.1.14', status: 'Running', requestsReceived: 0 },
    { id: 'pod-2', name: 'web-pod-8c2a1', ip: '10.244.2.29', status: 'Running', requestsReceived: 0 },
    { id: 'pod-3', name: 'web-pod-3b9e4', ip: '10.244.3.42', status: 'Running', requestsReceived: 0 },
  ]);

  const [selectedPodId, setSelectedPodId] = useState<string>('pod-1');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [requestLog, setRequestLog] = useState<string>(
    'Client initiates request to stable Service VIP (10.96.0.10:80)'
  );

  // Auto-play steps:
  // 0: Client idle -> 1: Request in flight to Service -> 2: Service resolves Endpoints -> 3: Pod receives request -> 4: Response returned
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setActiveStep((prev) => {
        const next = (prev + 1) % 4;

        if (next === 0) {
          setRequestLog('Client dispatches HTTP request to Service VIP: 10.96.0.10:80');
        } else if (next === 1) {
          setRequestLog('Request arrives at Kubernetes Service abstraction (kube-proxy / iptables)');
        } else if (next === 2) {
          const target = pods.find((p) => p.id === selectedPodId) || pods[0];
          setRequestLog(`Service routes packet to Endpoint: ${target.name} (${target.ip}:8080)`);
          setPods((currentPods) =>
            currentPods.map((p) =>
              p.id === target.id
                ? { ...p, requestsReceived: p.requestsReceived + 1 }
                : p
            )
          );
        } else if (next === 3) {
          setRequestLog('Pod processes request and returns HTTP 200 OK via connection tracking');
        }

        return next;
      });
    }, 1800);

    return () => clearInterval(timer);
  }, [isAutoPlaying, selectedPodId, pods]);

  const handleSimulatePodFailure = () => {
    // Recreate a pod with a new ephemeral IP address to show why direct Pod IPs fail
    const targetIdx = 1; // Pod 2
    const newRandomHex = Math.random().toString(16).substring(2, 7);
    const newRandomOctet = Math.floor(Math.random() * 200) + 50;

    setPods((current) =>
      current.map((p, idx) =>
        idx === targetIdx
          ? {
              ...p,
              name: `web-pod-${newRandomHex}`,
              ip: `10.244.2.${newRandomOctet}`,
              status: 'Running',
              requestsReceived: 0,
            }
          : p
      )
    );
    setRequestLog(
      `Pod rescheduled! Replaced with new ephemeral IP: 10.244.2.${newRandomOctet}. Notice: Service VIP remains completely unchanged at 10.96.0.10!`
    );
  };

  const handleReset = () => {
    setActiveStep(0);
    setPods([
      { id: 'pod-1', name: 'web-pod-7d4f9', ip: '10.244.1.14', status: 'Running', requestsReceived: 0 },
      { id: 'pod-2', name: 'web-pod-8c2a1', ip: '10.244.2.29', status: 'Running', requestsReceived: 0 },
      { id: 'pod-3', name: 'web-pod-3b9e4', ip: '10.244.3.42', status: 'Running', requestsReceived: 0 },
    ]);
    setSelectedPodId('pod-1');
    setRequestLog('Client initiates request to stable Service VIP (10.96.0.10:80)');
  };

  return (
    <div className="w-full my-8 rounded-xl border border-border-strong bg-surface glow-card overflow-hidden">
      {/* Control Header */}
      <div className="p-4 sm:p-5 border-b border-border-subtle bg-surface-elevated/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="font-mono text-xs font-bold text-brand uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>KUBERNETES SERVICE ABSTRACTION IN ACTION</span>
          </div>
          <h4 className="font-editorial text-lg font-bold text-text-primary">
            Stable Service Virtual IP vs Dynamic Ephemeral Pods
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface border border-border-subtle text-xs font-mono text-text-secondary hover:text-text-primary hover:border-brand transition-colors"
          >
            {isAutoPlaying ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
            <span>{isAutoPlaying ? 'Pause' : 'Play Flow'}</span>
          </button>

          <button
            type="button"
            onClick={handleSimulatePodFailure}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-brand-subtle border border-brand/30 text-xs font-mono text-brand font-semibold hover:bg-brand hover:text-white transition-all shadow-sm"
            title="Simulate a Pod being terminated and rescheduled with a new IP"
          >
            <Shuffle className="w-3 h-3" />
            <span>Reschedule Pod (New IP)</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded border border-border-subtle text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors"
            title="Reset simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Architecture Diagram Canvas */}
      <div className="p-6 bg-tech-grid overflow-x-auto">
        <div className="min-w-[680px] max-w-[800px] mx-auto py-4">
          <div className="grid grid-cols-3 gap-6 items-center relative">
            {/* 1. Client Node */}
            <div className="flex flex-col items-center">
              <div
                className={`w-full max-w-[190px] p-4 rounded-lg border text-center transition-all ${
                  activeStep === 0
                    ? 'border-brand bg-brand-subtle ring-2 ring-brand/40 shadow-lg scale-105'
                    : 'border-border-subtle bg-surface'
                }`}
              >
                <span className="font-mono text-[10px] text-text-muted uppercase block mb-1">
                  Consumer
                </span>
                <h5 className="font-technical text-sm font-bold text-text-primary mb-1">
                  Client Workload
                </h5>
                <span className="font-mono text-[11px] text-text-secondary block">
                  10.244.0.8
                </span>
                <span className="mt-2 inline-block font-mono text-[10px] text-brand bg-surface px-2 py-0.5 rounded border border-border-subtle">
                  GET http://web-service
                </span>
              </div>
            </div>

            {/* 2. Kubernetes Service Box (The Stable Invariant) */}
            <div className="flex flex-col items-center">
              <div
                className={`w-full max-w-[210px] p-4 rounded-lg border text-center transition-all relative ${
                  activeStep === 1
                    ? 'border-brand bg-brand-subtle ring-2 ring-brand/40 shadow-lg scale-105'
                    : 'border-brand/40 bg-surface'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand" />
                  <span className="font-mono text-[10px] text-brand font-bold uppercase">
                    STABLE ABSTRACTION
                  </span>
                </div>
                <h5 className="font-editorial text-base font-bold text-text-primary">
                  web-service
                </h5>
                <div className="mt-1 font-mono text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block">
                  VIP: 10.96.0.10:80
                </div>
                <p className="mt-2 text-[10px] text-text-secondary leading-snug font-technical">
                  Selector: <code className="text-text-primary font-mono">app=web</code>
                  <br />
                  Endpoints: 3 Healthy
                </p>
              </div>
            </div>

            {/* 3. Dynamic Backend Pods */}
            <div className="space-y-2.5">
              <div className="font-mono text-[10px] text-text-muted uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Backend Pod Endpoints</span>
                <span className="text-[9px] text-text-secondary">Click to target</span>
              </div>

              {pods.map((pod) => {
                const isTarget = pod.id === selectedPodId;
                const isReceiving = isTarget && (activeStep === 2 || activeStep === 3);

                return (
                  <div
                    key={pod.id}
                    onClick={() => setSelectedPodId(pod.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isReceiving
                        ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/40 shadow-md scale-105'
                        : isTarget
                        ? 'border-brand bg-brand-subtle'
                        : 'border-border-subtle bg-surface hover:border-border-strong hover:bg-surface-elevated'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-technical text-xs font-bold text-text-primary truncate">
                        {pod.name}
                      </span>
                      <span className="font-mono text-[10px] text-text-muted">
                        Req: {pod.requestsReceived}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-text-secondary">{pod.ip}:8080</span>
                      <span className="text-emerald-400 font-semibold text-[9px] flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Ready
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Live Event Log & Insight Banner */}
      <div className="p-4 border-t border-border-subtle bg-surface-elevated/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
          <span className="text-text-primary font-semibold">Active Datapath:</span>
          <span className="text-text-secondary">{requestLog}</span>
        </div>

        <div className="text-[11px] text-text-muted whitespace-nowrap">
          Step {activeStep + 1} of 4
        </div>
      </div>
    </div>
  );
}
