import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Server,
  Layers,
  ShieldCheck,
  Globe,
  Radio,
  Network,
  Cpu,
  Info,
  CheckCircle2,
  XCircle,
  ArrowRight
} from 'lucide-react';

export type ServiceMode = 'clusterip' | 'nodeport' | 'loadbalancer';

interface InspectorDetails {
  title: string;
  type: string;
  ip: string;
  port: string;
  role: string;
  internals: string;
}

export default function ServiceArchitectureDiagram() {
  const [mode, setMode] = useState<ServiceMode>('clusterip');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-1');
  const [loadBalancerPath, setLoadBalancerPath] = useState<'nodeport-route' | 'direct-pod'>('nodeport-route');
  const [inspectedComponent, setInspectedComponent] = useState<InspectorDetails | null>(null);

  // Steps configuration per mode
  const modeSteps: Record<ServiceMode, string[]> = {
    clusterip: [
      'Internal Client Pod (10.244.0.8) initiates connection to Service VIP: 10.96.0.10:80',
      'Kernel netfilter/iptables or IPVS on host intercepts packet and rewrites destination to eligible Pod Endpoint (DNAT)',
      'Packet arrives at targeted Pod container (10.244.1.14:8080) through virtual ethernet veth pair',
      'Target Pod processes request and returns HTTP 200 response back to client via conntrack state table'
    ],
    nodeport: [
      'External client transmits TCP handshake to Node IP at static port 30080 (e.g. 192.168.1.101:30080)',
      'Node 1 kube-proxy receives packet on port 30080 and evaluates Service Endpoint list',
      'Packet is routed across cluster overlay network (CNI) to eligible backend Pod (can be on any node)',
      'Target Pod receives request, processes it, and returns response back through routing table'
    ],
    loadbalancer: [
      'Internet client requests public domain resolving to cloud provider External Load Balancer (203.0.113.50:80)',
      'Cloud Load Balancer performs health checks and distributes request to healthy cluster nodes or direct pods',
      'Traffic enters cluster at NodePort or Direct CNI interface, and kube-proxy applies DNAT translation',
      'Eligible Pod processes request and returns response back through the cloud load balancer to internet client'
    ]
  };

  const currentSteps = modeSteps[mode];

  // Auto-play interval
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % currentSteps.length);
    }, 2400);

    return () => clearInterval(interval);
  }, [isPlaying, currentSteps.length]);

  const handleModeChange = (newMode: ServiceMode) => {
    setMode(newMode);
    setActiveStep(0);
    setIsPlaying(false);
    setInspectedComponent(null);
  };

  const handleStepNext = () => {
    setIsPlaying(false);
    setActiveStep((prev) => (prev + 1) % currentSteps.length);
  };

  const handleStepPrev = () => {
    setIsPlaying(false);
    setActiveStep((prev) => (prev - 1 + currentSteps.length) % currentSteps.length);
  };

  const handleReset = () => {
    setActiveStep(0);
    setIsPlaying(false);
    setInspectedComponent(null);
  };

  return (
    <div className="w-full my-8 rounded-xl border border-border-strong bg-surface glow-card overflow-hidden">
      {/* Mode Switcher Tabs */}
      <div className="p-4 sm:p-5 border-b border-border-subtle bg-surface-elevated/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="font-mono text-xs font-bold text-brand uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>INTERACTIVE KUBERNETES SERVICE EXPLORER</span>
          </div>
          <h3 className="font-editorial text-xl font-bold text-text-primary">
            Architecture & Request Flow: ClusterIP vs NodePort vs LoadBalancer
          </h3>
        </div>

        {/* Segmented Control */}
        <div className="inline-flex rounded-lg border border-border-strong bg-surface p-1 shadow-sm">
          <button
            type="button"
            onClick={() => handleModeChange('clusterip')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-mono font-semibold transition-all ${
              mode === 'clusterip'
                ? 'bg-brand text-white shadow'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            ClusterIP
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('nodeport')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-mono font-semibold transition-all ${
              mode === 'nodeport'
                ? 'bg-brand text-white shadow'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            NodePort
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('loadbalancer')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-mono font-semibold transition-all ${
              mode === 'loadbalancer'
                ? 'bg-brand text-white shadow'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            LoadBalancer
          </button>
        </div>
      </div>

      {/* Mode Metadata & Parameters Banner */}
      <div className="px-6 py-3 border-b border-border-subtle bg-surface/60 flex flex-wrap items-center justify-between gap-4 text-xs font-technical">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <span className="font-mono text-[10px] text-text-muted uppercase mr-1.5">Exposure Scope:</span>
            <span className="font-mono font-semibold text-text-primary">
              {mode === 'clusterip' && 'Internal Cluster Only'}
              {mode === 'nodeport' && 'Every Node IP : NodePort'}
              {mode === 'loadbalancer' && 'Public Internet (Cloud LB)'}
            </span>
          </div>
          <span className="text-border-strong hidden sm:inline">•</span>
          <div>
            <span className="font-mono text-[10px] text-text-muted uppercase mr-1.5">Target Address:</span>
            <span className="font-mono font-semibold text-brand">
              {mode === 'clusterip' && '10.96.0.10:80 (Cluster VIP)'}
              {mode === 'nodeport' && '<NodeIP>:30080 (Range: 30000-32767)'}
              {mode === 'loadbalancer' && '203.0.113.50:80 (Cloud Provider LB)'}
            </span>
          </div>
        </div>

        {/* LoadBalancer path option */}
        {mode === 'loadbalancer' && (
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-text-muted">Datapath:</span>
            <button
              type="button"
              onClick={() => setLoadBalancerPath('nodeport-route')}
              className={`px-2 py-0.5 rounded border ${
                loadBalancerPath === 'nodeport-route'
                  ? 'bg-surface-elevated text-brand border-brand'
                  : 'border-border-subtle text-text-muted'
              }`}
            >
              NodePort Routing
            </button>
            <button
              type="button"
              onClick={() => setLoadBalancerPath('direct-pod')}
              className={`px-2 py-0.5 rounded border ${
                loadBalancerPath === 'direct-pod'
                  ? 'bg-surface-elevated text-brand border-brand'
                  : 'border-border-subtle text-text-muted'
              }`}
            >
              Direct Pod (CNI / NEG)
            </button>
          </div>
        )}

        {/* NodePort selector */}
        {mode === 'nodeport' && (
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-text-muted">Target Node:</span>
            {['node-1', 'node-2', 'node-3'].map((nId, idx) => (
              <button
                key={nId}
                type="button"
                onClick={() => setSelectedNodeId(nId)}
                className={`px-2 py-0.5 rounded border ${
                  selectedNodeId === nId
                    ? 'bg-brand text-white border-brand'
                    : 'border-border-subtle text-text-muted'
                }`}
              >
                Node {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SVG Interactive Architecture Visualization Canvas */}
      <div className="p-6 bg-tech-grid overflow-x-auto select-none">
        <div className="min-w-[860px] max-w-[960px] mx-auto relative py-6">
          {/* External World Boundary */}
          <div className="mb-8 p-4 rounded-xl border border-dashed border-border-strong bg-surface/50 relative">
            <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-surface rounded border border-border-subtle font-mono text-[10px] text-text-muted uppercase">
              External Network (Internet / Client Network)
            </span>

            <div className="flex items-center justify-around gap-6">
              {/* Outside User / Internet Client */}
              <div
                onClick={() =>
                  setInspectedComponent({
                    title: 'Outside User (External Client)',
                    type: 'External Client Device',
                    ip: '198.51.100.24',
                    port: 'Ephemeral (e.g. 52418)',
                    role: 'Public internet client requesting the application.',
                    internals:
                      mode === 'clusterip'
                        ? 'Blocked: Cannot reach ClusterIP (10.96.0.10) directly because it is a non-routable private overlay IP.'
                        : mode === 'nodeport'
                        ? `Sending request to Node IP: 192.168.1.10${selectedNodeId.slice(-1)}:30080.`
                        : 'Sending request to Cloud Load Balancer (203.0.113.50:80).'
                  })
                }
                className={`p-4 rounded-lg border text-center cursor-pointer transition-all w-48 ${
                  inspectedComponent?.title.startsWith('Outside')
                    ? 'border-brand bg-brand-subtle ring-2 ring-brand/40 shadow-md'
                    : 'border-border-subtle bg-surface hover:border-border-strong hover:bg-surface-elevated'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Globe className="w-4 h-4 text-text-muted" />
                  <span className="font-mono text-[10px] text-text-muted uppercase">Public Client</span>
                </div>
                <h5 className="font-technical text-sm font-bold text-text-primary">Outside User</h5>
                <span className="font-mono text-[11px] text-text-secondary block">198.51.100.24</span>

                {mode === 'clusterip' && (
                  <div className="mt-2 text-[10px] font-mono text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 flex items-center justify-center gap-1">
                    <XCircle className="w-3 h-3" /> Cannot Reach ClusterIP
                  </div>
                )}
                {mode === 'nodeport' && (
                  <div className="mt-2 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Targets NodePort :30080
                  </div>
                )}
                {mode === 'loadbalancer' && (
                  <div className="mt-2 text-[10px] font-mono text-brand bg-brand-subtle px-2 py-0.5 rounded border border-brand/20">
                    Targets Cloud LB :80
                  </div>
                )}
              </div>

              {/* Cloud Load Balancer (Only active in LoadBalancer mode) */}
              {mode === 'loadbalancer' && (
                <div
                  onClick={() =>
                    setInspectedComponent({
                      title: 'External Cloud Load Balancer',
                      type: 'Infrastructure Load Balancer (AWS NLB / GCP Cloud LB / MetalLB)',
                      ip: '203.0.113.50',
                      port: '80 / 443',
                      role: 'Provides a single stable public IP and distributes external traffic across cluster nodes.',
                      internals:
                        'Probes cluster nodes for health. Performs layer 4 or layer 7 traffic distribution. In direct-pod mode (e.g. AWS VPC CNI with Target Groups), routes directly to Pod IPs.'
                    })
                  }
                  className={`p-4 rounded-lg border text-center cursor-pointer transition-all w-56 ${
                    activeStep === 1
                      ? 'border-brand bg-brand-subtle ring-2 ring-brand/40 shadow-lg scale-105'
                      : inspectedComponent?.title.startsWith('External Cloud')
                      ? 'border-brand bg-brand-subtle'
                      : 'border-brand/40 bg-surface hover:border-brand'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Radio className="w-4 h-4 text-brand" />
                    <span className="font-mono text-[10px] text-brand font-bold uppercase">Cloud Load Balancer</span>
                  </div>
                  <h5 className="font-editorial text-sm font-bold text-text-primary">AWS / GCP / MetalLB</h5>
                  <span className="font-mono text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 block mt-1">
                    Public IP: 203.0.113.50:80
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Kubernetes Cluster Boundary */}
          <div className="p-6 rounded-xl border border-border-strong bg-surface/90 relative">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-border-subtle">
              <span className="font-mono text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                <Server className="w-4 h-4 text-brand" />
                Kubernetes Cluster Network Boundary
              </span>

              <span className="font-mono text-[11px] text-text-muted">
                Cluster CIDR: 10.244.0.0/16 • Service VIP Range: 10.96.0.0/12
              </span>
            </div>

            {/* In-Cluster Workload (Client Pod in ClusterIP mode) */}
            {mode === 'clusterip' && (
              <div className="mb-6 p-4 rounded-lg border border-border-subtle bg-surface flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-surface-elevated border border-border-subtle">
                    <Cpu className="w-4 h-4 text-brand" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-text-muted uppercase">Internal Consumer</span>
                    <h5 className="font-technical text-sm font-bold text-text-primary">
                      Frontend Service Pod (App Client)
                    </h5>
                    <span className="font-mono text-xs text-text-secondary">IP: 10.244.0.8</span>
                  </div>
                </div>

                <div className="font-mono text-xs text-brand bg-brand-subtle px-3 py-1.5 rounded border border-brand/20">
                  Requests internal DNS: <span className="font-bold">http://backend-service:80</span>
                </div>
              </div>
            )}

            {/* Kubernetes Service VIP Component (The Control Plane Abstraction) */}
            <div
              onClick={() =>
                setInspectedComponent({
                  title: 'Kubernetes Service Abstraction',
                  type: `Service (Type: ${mode.toUpperCase()})`,
                  ip: '10.96.0.10 (ClusterIP Virtual IP)',
                  port: 'Port 80 -> TargetPort 8080',
                  role: 'Directs incoming connections across healthy matching Pod endpoints.',
                  internals:
                    'Implemented via kube-proxy manipulating Linux kernel packet filtering (iptables or IPVS) or Cilium eBPF sockops. Service VIP is non-routable on physical networks.'
                })
              }
              className={`p-4 rounded-lg border text-center cursor-pointer transition-all mb-8 ${
                (mode === 'clusterip' && activeStep === 1) ||
                (mode === 'nodeport' && activeStep === 2) ||
                (mode === 'loadbalancer' && activeStep === 2)
                  ? 'border-brand bg-brand-subtle ring-2 ring-brand/40 shadow-lg scale-[1.01]'
                  : 'border-border-subtle bg-surface hover:border-border-strong'
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-brand" />
                <span className="font-mono text-xs font-bold text-brand uppercase">
                  Service Invariant: my-service ({mode})
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
                <span className="text-text-primary font-semibold">ClusterIP VIP: 10.96.0.10:80</span>
                <span className="text-border-strong">•</span>
                <span className="text-text-secondary">Selector: app=backend</span>
                <span className="text-border-strong">•</span>
                <span className="text-text-secondary">targetPort: 8080</span>
              </div>
            </div>

            {/* Kubernetes Nodes & Pods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'node-1', name: 'Node 1', ip: '192.168.1.101', podName: 'backend-pod-a', podIp: '10.244.1.14' },
                { id: 'node-2', name: 'Node 2', ip: '192.168.1.102', podName: 'backend-pod-b', podIp: '10.244.2.29' },
                { id: 'node-3', name: 'Node 3', ip: '192.168.1.103', podName: 'backend-pod-c', podIp: '10.244.3.42' }
              ].map((node, nIdx) => {
                const isSelectedNode = selectedNodeId === node.id;
                const isNodeActive =
                  (mode === 'nodeport' && isSelectedNode && activeStep === 1) ||
                  (mode === 'loadbalancer' && activeStep === 2);

                return (
                  <div
                    key={node.id}
                    onClick={() =>
                      setInspectedComponent({
                        title: `Kubernetes Worker ${node.name}`,
                        type: 'Kubernetes Node (Physical / VM Instance)',
                        ip: node.ip,
                        port: mode === 'nodeport' || mode === 'loadbalancer' ? 'NodePort 30080' : 'Standard Host Ports',
                        role: 'Runs containers and kube-proxy daemon.',
                        internals:
                          mode === 'nodeport'
                            ? `Listens on port 30080. If traffic hits Node ${nIdx + 1}, kube-proxy can DNAT to any eligible Pod (even on another node!).`
                            : 'Host running Linux kernel networking and container runtime.'
                      })
                    }
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isNodeActive
                        ? 'border-brand bg-surface-elevated ring-2 ring-brand/30 shadow-md'
                        : 'border-border-subtle bg-surface hover:border-border-strong'
                    }`}
                  >
                    {/* Node Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-border-subtle mb-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Server className="w-3.5 h-3.5 text-text-muted" />
                          <h6 className="font-technical text-xs font-bold text-text-primary">{node.name}</h6>
                        </div>
                        <span className="font-mono text-[10px] text-text-secondary">{node.ip}</span>
                      </div>

                      {/* NodePort indicator badge on node */}
                      {(mode === 'nodeport' || mode === 'loadbalancer') && (
                        <div className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-surface-elevated border border-border-strong text-brand">
                          :30080
                        </div>
                      )}
                    </div>

                    {/* Backend Pod Container inside Node */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectedComponent({
                          title: `Backend Pod (${node.podName})`,
                          type: 'Application Container Endpoint',
                          ip: node.podIp,
                          port: '8080 (targetPort)',
                          role: 'Executes actual application server process (Go, Node, Java, Python).',
                          internals:
                            'Has its own network namespace (netns) allocated by CNI plugin (Calico, Cilium, Flannel). Receives traffic via DNAT.'
                        })
                      }}
                      className={`p-3 rounded-lg border transition-all ${
                        activeStep === currentSteps.length - 1 && nIdx === 0
                          ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/40 shadow'
                          : 'border-border-subtle bg-surface-elevated/70 hover:border-brand/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-technical text-xs font-bold text-text-primary">
                          {node.podName}
                        </span>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      </div>
                      <div className="flex items-center justify-between font-mono text-[10px] text-text-muted">
                        <span>{node.podIp}</span>
                        <span className="text-text-primary font-semibold">:8080</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stepper Controls & Current Step Explanation */}
      <div className="p-4 sm:p-5 border-t border-border-strong bg-surface-elevated/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Playback & Step Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-brand text-white text-xs font-mono font-semibold hover:bg-brand-hover shadow-sm transition-all"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Play Flow'}</span>
          </button>

          <button
            type="button"
            onClick={handleStepPrev}
            className="p-1.5 rounded border border-border-subtle text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
            title="Previous step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleStepNext}
            className="p-1.5 rounded border border-border-subtle text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
            title="Next step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded border border-border-subtle text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
            title="Reset flow"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <span className="font-mono text-xs text-text-muted ml-2">
            Step {activeStep + 1} of {currentSteps.length}
          </span>
        </div>

        {/* Current Lifecycle Step Description */}
        <div className="text-xs font-mono text-text-primary bg-surface p-2.5 rounded-lg border border-border-subtle flex-1 md:max-w-xl">
          <span className="text-brand font-bold mr-1.5">&gt;</span>
          {currentSteps[activeStep]}
        </div>
      </div>

      {/* Interactive Component Inspector Drawer (Section 7) */}
      {inspectedComponent && (
        <div className="p-4 sm:p-5 border-t border-brand/30 bg-brand-subtle/30 animate-in fade-in duration-200">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase font-bold text-brand px-2 py-0.5 rounded bg-brand-subtle border border-brand/20">
                  {inspectedComponent.type}
                </span>
                <span className="font-mono text-xs font-semibold text-text-primary">
                  IP: {inspectedComponent.ip} • Port: {inspectedComponent.port}
                </span>
              </div>
              <h5 className="font-editorial text-base font-bold text-text-primary">
                {inspectedComponent.title}
              </h5>
              <p className="text-xs text-text-secondary font-technical">
                {inspectedComponent.role}
              </p>
              <div className="pt-2 text-xs font-mono text-text-secondary">
                <span className="text-text-primary font-bold">Kernel / Datapath Mechanics: </span>
                {inspectedComponent.internals}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setInspectedComponent(null)}
              className="text-xs font-mono text-text-muted hover:text-text-primary px-2 py-1 rounded bg-surface border border-border-subtle"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
