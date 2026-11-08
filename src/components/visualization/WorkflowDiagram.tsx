import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

interface WorkflowStep {
  step: number;
  title: string;
  stage: string;
  sender: string;
  receiver: string;
  protocol: string;
  description: string;
  kernelDetails: string;
}

export default function WorkflowDiagram() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const steps: WorkflowStep[] = [
    {
      step: 1,
      title: 'DNS Resolution',
      stage: 'Name Resolution',
      sender: 'Client Browser',
      receiver: 'Recursive Resolver',
      protocol: 'UDP Port 53',
      description: 'Host domain "api.complexity.io" is translated into machine routable IP address "198.51.100.24".',
      kernelDetails: 'Checks OS /etc/hosts cache and invokes getaddrinfo() POSIX syscall.'
    },
    {
      step: 2,
      title: 'TCP 3-Way Handshake',
      stage: 'Transport Layer Session',
      sender: 'Client OS Kernel',
      receiver: 'Nginx Socket Listener',
      protocol: 'TCP (SYN, SYN-ACK, ACK)',
      description: 'Synchronizes sequence numbers and establishes a reliable, bidirectional byte stream over port 443.',
      kernelDetails: 'Client kernel allocates ephemeral port 54321. Server socket leaves SYN_RCVD and enters ESTABLISHED state.'
    },
    {
      step: 3,
      title: 'TLS 1.3 Encryption Handshake',
      stage: 'Cryptographic Security',
      sender: 'Client',
      receiver: 'API Gateway',
      protocol: 'TLS 1.3 / Diffie-Hellman',
      description: 'Single round-trip key exchange derives symmetric encryption keys for all subsequent application payloads.',
      kernelDetails: 'ClientHello with supported cipher suites; server returns certificate and completes 1-RTT key derivation.'
    },
    {
      step: 4,
      title: 'HTTP/2 Request Dispatch',
      stage: 'Application Ingress',
      sender: 'Client Browser',
      receiver: 'Nginx Reverse Proxy',
      protocol: 'HTTP/2 (Binary Framing)',
      description: 'Multiplexed stream sends GET /cart request headers and JWT authorization cookie.',
      kernelDetails: 'Kernel places bytes in socket rmem buffer. epoll_wait() wakes worker thread to read request.'
    },
    {
      step: 5,
      title: 'Cache Inspection (Cache-Aside)',
      stage: 'Service Concurrency',
      sender: 'Application Worker',
      receiver: 'Redis Cluster',
      protocol: 'RESP3 (Redis Protocol)',
      description: 'Service checks in-memory hash for user cart state before attempting a slow relational query.',
      kernelDetails: 'Sub-millisecond socket write over internal private VPC subnet.'
    },
    {
      step: 6,
      title: 'Egress Response Delivery',
      stage: 'Payload Acknowledgment',
      sender: 'Nginx Proxy',
      receiver: 'Client Browser',
      protocol: 'HTTP/2 200 OK',
      description: 'Gzip compressed JSON payload delivered to client. Connection preserved for subsequent requests.',
      kernelDetails: 'TCP ACK packet sent back; connection maintained in keep-alive pool.'
    }
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => (prev >= steps.length ? 1 : prev + 1));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  const active = steps[currentStep - 1];

  return (
    <div className="w-full my-8 rounded-xl border border-border-strong bg-surface glow-card overflow-hidden">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-border-subtle bg-surface-elevated/70 gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-brand uppercase tracking-wider">
            STEP {active.step} OF {steps.length}:
          </span>
          <span className="font-technical text-sm font-bold text-text-primary">
            {active.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="p-1.5 rounded border border-border-subtle bg-surface hover:bg-surface-elevated text-text-secondary disabled:opacity-40"
            aria-label="Previous step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded border border-brand bg-brand text-white hover:bg-brand-hover shadow-sm"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentStep((prev) => Math.min(steps.length, prev + 1))}
            disabled={currentStep === steps.length}
            className="p-1.5 rounded border border-border-subtle bg-surface hover:bg-surface-elevated text-text-secondary disabled:opacity-40"
            aria-label="Next step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => { setCurrentStep(1); setIsPlaying(false); }}
            className="p-1.5 rounded border border-border-subtle bg-surface hover:bg-surface-elevated text-text-muted"
            title="Reset to step 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Dots Track */}
      <div className="px-6 py-3 border-b border-border-subtle bg-surface flex items-center justify-between">
        {steps.map((s) => {
          const isPassed = s.step <= currentStep;
          const isCurrent = s.step === currentStep;

          return (
            <button
              key={s.step}
              type="button"
              onClick={() => setCurrentStep(s.step)}
              className="flex items-center gap-2 group focus:outline-none"
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                isCurrent
                  ? 'bg-brand text-white ring-4 ring-brand/20 scale-110'
                  : (isPassed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-surface-elevated text-text-muted border border-border-subtle')
              }`}>
                {s.step}
              </span>
              <span className="text-xs font-technical font-medium text-text-muted hidden md:inline truncate max-w-[120px]">
                {s.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Flow Visual Stage */}
      <div className="p-6 sm:p-8 bg-tech-grid">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 max-w-xl mx-auto my-4">
          {/* Sender Node */}
          <div className="w-full sm:w-44 p-4 rounded-lg border border-border-strong bg-surface text-center shadow-sm">
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider block mb-1">
              ORIGIN SENDER
            </span>
            <div className="font-technical text-sm font-bold text-text-primary">
              {active.sender}
            </div>
          </div>

          {/* Animated Transfer Pipe */}
          <div className="flex flex-col items-center justify-center text-center">
            <span className="font-mono text-xs font-semibold text-brand px-2.5 py-0.5 rounded bg-brand-subtle border border-brand-border mb-1">
              {active.protocol}
            </span>
            <div className="flex items-center gap-1 text-brand">
              <span className="w-16 sm:w-28 h-0.5 bg-brand animate-pulse"></span>
              <span className="font-mono text-sm">►</span>
            </div>
            <span className="font-mono text-[10px] text-text-muted mt-1">
              {active.stage}
            </span>
          </div>

          {/* Receiver Node */}
          <div className="w-full sm:w-44 p-4 rounded-lg border border-border-strong bg-surface text-center shadow-sm">
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider block mb-1">
              TARGET RECEIVER
            </span>
            <div className="font-technical text-sm font-bold text-text-primary">
              {active.receiver}
            </div>
          </div>
        </div>
      </div>

      {/* Operating System & Protocol Explanation Drawer */}
      <div className="p-5 border-t border-border-subtle bg-surface-elevated">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-brand font-semibold mb-1">
              What Is Happening
            </div>
            <p className="text-text-secondary leading-relaxed font-technical">
              {active.description}
            </p>
          </div>

          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-text-muted font-semibold mb-1">
              Operating System & Socket Level Invariants
            </div>
            <p className="text-text-muted leading-relaxed font-mono text-[11px] bg-surface p-2.5 rounded border border-border-subtle">
              {active.kernelDetails}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
