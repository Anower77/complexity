import React from 'react';
import { ShieldCheck, Server, Globe, Check, X, AlertCircle } from 'lucide-react';

export default function KubernetesServiceComparison() {
  const comparisonData = [
    {
      feature: 'Normal Access Scope',
      clusterip: 'Internal to cluster only (Pod & Node network)',
      nodeport: 'Every Node IP at designated high-range port',
      loadbalancer: 'Public Internet / External corporate VPC network'
    },
    {
      feature: 'Stable Address Abstraction',
      clusterip: 'ClusterIP Virtual IP (e.g. 10.96.0.10)',
      nodeport: '<Node-IP>:<NodePort> on every cluster node',
      loadbalancer: 'Single public IP or DNS name provisioned by Cloud LB'
    },
    {
      feature: 'External Traffic Accessibility',
      clusterip: 'No (Requires Ingress, Gateway API, or Port-Forward)',
      nodeport: 'Yes (Direct to any Node IP)',
      loadbalancer: 'Yes (Direct through Cloud Load Balancer)'
    },
    {
      feature: 'Node-Level Port Exposed',
      clusterip: 'No (Allocates virtual ClusterIP only)',
      nodeport: 'Yes (Static port in 30000–32767 range on all nodes)',
      loadbalancer: 'Implementation-dependent (Often allocates NodePort under the hood)'
    },
    {
      feature: 'Cloud Load Balancer Required',
      clusterip: 'No',
      nodeport: 'No (User can configure upstream LB manually)',
      loadbalancer: 'Yes (Requests cloud controller / MetalLB automation)'
    },
    {
      feature: 'Typical Production Use Cases',
      clusterip: 'Databases, internal caching tiers, microservice-to-microservice APIs',
      nodeport: 'Local development, minikube/kind, edge bare-metal nodes, internal testing',
      loadbalancer: 'Public-facing web applications, mobile APIs, production customer ingress'
    },
    {
      feature: 'Operational Trade-offs',
      clusterip: 'Lowest overhead, zero external exposure, fastest packet routing',
      nodeport: 'Requires opening firewall ports 30000-32767, non-standard HTTP ports, no automated DNS',
      loadbalancer: 'Incurs cloud provider hourly/bandwidth costs, provisioning delay on creation'
    }
  ];

  return (
    <div className="my-8 rounded-xl border border-border-strong bg-surface glow-card overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-border-subtle bg-surface-elevated/70">
        <h4 className="font-editorial text-lg font-bold text-text-primary">
          Architectural Feature & Trade-off Matrix
        </h4>
        <p className="text-xs text-text-secondary mt-0.5 font-technical">
          Comparing the three core Kubernetes Service abstractions across operational boundaries.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-technical">
          <thead>
            <tr className="border-b border-border-subtle bg-surface-elevated/50 font-mono text-[11px] text-text-muted">
              <th className="p-4 w-1/4">Evaluation Criterion</th>
              <th className="p-4 w-1/4 text-brand font-bold">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> ClusterIP (Default)
                </span>
              </th>
              <th className="p-4 w-1/4 text-emerald-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5" /> NodePort
                </span>
              </th>
              <th className="p-4 w-1/4 text-sky-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> LoadBalancer
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {comparisonData.map((row, idx) => (
              <tr key={idx} className="hover:bg-surface-elevated/40 transition-colors">
                <td className="p-4 font-mono font-semibold text-text-primary bg-surface/40">
                  {row.feature}
                </td>
                <td className="p-4 text-text-secondary leading-relaxed">
                  {row.clusterip}
                </td>
                <td className="p-4 text-text-secondary leading-relaxed">
                  {row.nodeport}
                </td>
                <td className="p-4 text-text-secondary leading-relaxed">
                  {row.loadbalancer}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-border-subtle bg-surface-elevated/60 text-xs text-text-muted font-mono flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
        <span>
          Note: In modern Kubernetes clusters, Ingress controllers and the Gateway API (HTTPRoute) are built on top of ClusterIP or NodePort Services for layer-7 host/path routing and SSL termination.
        </span>
      </div>
    </div>
  );
}
