# Interactive Diagram Engine: Complexity (v1.0.4)

## 1. Engine Objective

The Interactive Diagram Engine provides a reusable component architecture for authoring and rendering architecture, network, and request-flow visualizations directly inside technical articles and documentation.

Content authors must not build ad-hoc SVG code for every new diagram. Instead, diagrams are declared using typed data structures and composed using standardized visual primitives.

---

## 2. Visual Primitives

The engine provides standardized React components representing architecture nodes and connectors:

### 2.1 Node Primitives
- `ClientNode`: Represents user devices, browsers, mobile clients, CLI tools.
- `GatewayNode`: Represents API gateways, reverse proxies (Nginx, Envoy, Traefik).
- `LoadBalancerNode`: Represents L4/L7 load balancers, cloud NLB/ALB, HAProxy.
- `ServerNode`: Represents application runtimes, monolithic services, backend workers.
- `MicroserviceNode`: Represents isolated microservices with communication ports.
- `DatabaseNode`: Represents relational/NoSQL datastores (PostgreSQL, MySQL, Cassandra).
- `CacheNode`: Represents in-memory caching layers (Redis, Memcached).
- `QueueNode`: Represents distributed message brokers (Kafka, RabbitMQ, SQS).
- `ContainerNode`: Represents Docker containers with PID/mount namespace boundaries.
- `PodNode`: Represents Kubernetes Pods wrapping multiple containers and sharing localhost.
- `NetworkBoundary`: Dotted or shaded boundary denoting VPCs, subnets, or cluster perimeters.

### 2.2 Connection Primitives
- `ConnectionLine`: Solid, dashed, or dotted vector paths with direction indicators.
- `DirectionalArrow`: Bezier curve or orthogonal polyline connecting node anchor ports.
- `Annotation`: Contextual technical notes (port number, protocol, TLS cipher).

---

## 3. Data Specification Schema

```typescript
export interface DiagramNode {
  id: string;
  type: 'client' | 'gateway' | 'loadbalancer' | 'server' | 'database' | 'cache' | 'queue' | 'container' | 'pod';
  title: string;
  subtitle?: string;
  metrics?: { label: string; value: string }[];
  status?: 'healthy' | 'degraded' | 'failing' | 'idle';
  position: { x: number; y: number };
}

export interface DiagramEdge {
  id: string;
  source: string;
  target: string;
  protocol?: string; // e.g. "HTTPS:443", "gRPC:50051", "TCP:5432"
  style?: 'solid' | 'dashed';
  animated?: boolean;
}

export interface FlowStep {
  step: number;
  title: string;
  whatIsMoving: string;
  sourceNodeId: string;
  targetNodeId: string;
  whyItMoves: string;
  stateChanges: string;
  latencyEstimate?: string;
}

export interface InteractiveDiagramSpec {
  id: string;
  title: string;
  description: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  flowSteps?: FlowStep[];
}
```

---

## 4. Animation & Stepper Lifecycle

Animations communicate state transitions, not decorative movement:
1. **Play / Pause**: Controls automated progression through workflow steps.
2. **Next / Prev Step**: Allows precise manual stepping for technical study.
3. **Speed Selector**: 0.5x, 1x, 2x speeds.
4. **Step Inspection Drawer**: Dynamically displays:
   - What is moving (packet, frame, query, message).
   - Origin and Destination nodes.
   - Engineering reason for this hop.
   - System state change upon arrival (e.g. socket state changed to `ESTABLISHED`, cache miss triggers DB read).
5. **Reduced Motion**: When `prefers-reduced-motion` is detected, animated moving dots are replaced with static directional highlight indicators.
