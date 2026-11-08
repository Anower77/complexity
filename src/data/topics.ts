export type TopicCategory =
  | 'foundations'
  | 'runtime'
  | 'storage'
  | 'distributed'
  | 'reliability'
  | 'case-studies';

export type RelationshipType =
  | 'prerequisite'
  | 'builds-on'
  | 'related-to'
  | 'alternative-to'
  | 'commonly-used-with';

export type TopicDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface TopicNode {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  category: TopicCategory;
  categoryLabel: string;
  difficulty: TopicDifficulty;
  prerequisites: string[]; // topic IDs
  relatedTopics: string[]; // topic IDs
  nextTopics: string[]; // topic IDs
  articleUrl?: string;
  status: 'published' | 'in-progress' | 'planned';
  // Layout coordinates for SVG graph positioning
  x: number;
  y: number;
}

export interface TopicEdge {
  id: string;
  source: string;
  target: string;
  relationshipType: RelationshipType;
  label?: string;
  description: string;
  order: number;
}

export interface CategoryMetadata {
  id: TopicCategory;
  label: string;
  description: string;
  color: string;
}

export const CATEGORIES: CategoryMetadata[] = [
  {
    id: 'foundations',
    label: 'Foundations & Networking',
    description: 'Physical wire invariants, TCP/UDP sockets, DNS resolution, and the client-server paradigm.',
    color: '#315e8a'
  },
  {
    id: 'runtime',
    label: 'Linux & OS Runtime',
    description: 'Kernel event loops (epoll), file descriptors, memory pages, cgroups, and container virtualization.',
    color: '#397c78'
  },
  {
    id: 'storage',
    label: 'Storage & Caching',
    description: 'In-memory data structures, cache eviction policies, write-ahead logs, and database connection pooling.',
    color: '#d97706'
  },
  {
    id: 'distributed',
    label: 'Distributed Systems & Messaging',
    description: 'Asynchronous message queues, distributed commit logs, consensus, and horizontal partitioning.',
    color: '#8b5cf6'
  },
  {
    id: 'reliability',
    label: 'Production & Reliability',
    description: 'Rate limiting algorithms, circuit breaker state machines, cascading failure mitigation, and SLOs.',
    color: '#ef4444'
  },
  {
    id: 'case-studies',
    label: 'System Design Case Studies',
    description: 'Real-world architectural blueprints deconstructing traffic estimation, data models, and bottlenecks.',
    color: '#06b6d4'
  }
];

export const TOPICS: TopicNode[] = [
  {
    id: 'networking-foundations',
    slug: 'networking-foundations',
    title: 'Computer Networking Invariants',
    shortDescription: 'How bytes traverse the wire, OSI boundaries, and network demarcation points.',
    detailedDescription: 'Before software architecture exists, packets must traverse physical routers, switches, and network interfaces. Understanding MTU, packet fragmentation, and latency boundaries is the baseline for all distributed systems.',
    category: 'foundations',
    categoryLabel: 'Foundations & Networking',
    difficulty: 'Beginner',
    prerequisites: [],
    relatedTopics: ['client-server', 'dns-resolution'],
    nextTopics: ['client-server', 'dns-resolution'],
    articleUrl: '/articles/client-server-architecture',
    status: 'published',
    x: 100,
    y: 80
  },
  {
    id: 'client-server',
    slug: 'client-server',
    title: 'Client-Server Architecture',
    shortDescription: 'The foundational request-response paradigm powering distributed internet systems.',
    detailedDescription: 'Deconstructs socket creation, state synchronization, client-side timeouts, and stateless service design. Examines why servers maintain connection tables and how client multiplexing scales.',
    category: 'foundations',
    categoryLabel: 'Foundations & Networking',
    difficulty: 'Beginner',
    prerequisites: ['networking-foundations'],
    relatedTopics: ['http-protocols', 'linux-epoll'],
    nextTopics: ['http-protocols', 'linux-epoll'],
    articleUrl: '/articles/client-server-architecture',
    status: 'published',
    x: 280,
    y: 80
  },
  {
    id: 'dns-resolution',
    slug: 'dns-resolution',
    title: 'DNS Resolution & Anycast',
    shortDescription: 'Hierarchical name resolution, root servers, recursive caching, and DNS failure modes.',
    detailedDescription: 'Traces the multi-step DNS resolution journey across root servers, TLD authorities, and local recursive resolvers. Examines how TTL expiration, negative caching, and Anycast BGP routing impact production availability.',
    category: 'foundations',
    categoryLabel: 'Foundations & Networking',
    difficulty: 'Beginner',
    prerequisites: ['networking-foundations'],
    relatedTopics: ['http-protocols'],
    nextTopics: ['http-protocols'],
    articleUrl: '/articles/dns-resolution-and-sockets',
    status: 'published',
    x: 100,
    y: 200
  },
  {
    id: 'http-protocols',
    slug: 'http-protocols',
    title: 'Request Lifecycle & Transport Protocols',
    shortDescription: 'TCP 3-way handshake, TLS 1.3 records, and HTTP/1.1 vs HTTP/2 multiplexing.',
    detailedDescription: 'Step through an end-to-end packet journey: TCP SYN-ACK, cryptographic TLS key exchange, ALPN negotiation, and binary HTTP/2 frame stream multiplexing across a single socket connection.',
    category: 'foundations',
    categoryLabel: 'Foundations & Networking',
    difficulty: 'Beginner',
    prerequisites: ['client-server', 'dns-resolution'],
    relatedTopics: ['linux-epoll', 'reverse-proxy'],
    nextTopics: ['linux-epoll', 'reverse-proxy'],
    articleUrl: '/articles/request-lifecycle-and-protocols',
    status: 'published',
    x: 280,
    y: 200
  },
  {
    id: 'linux-epoll',
    slug: 'linux-epoll',
    title: 'Linux Epoll & File Descriptors',
    shortDescription: 'Solving the C10K concurrency bottleneck with O(1) kernel event readiness.',
    detailedDescription: 'Why classic select() and poll() syscalls scaled with O(N) linear iteration overhead, and how the Linux kernel solved high concurrency through epoll red-black trees and ready-list interrupts.',
    category: 'runtime',
    categoryLabel: 'Linux & OS Runtime',
    difficulty: 'Intermediate',
    prerequisites: ['client-server'],
    relatedTopics: ['container-runtimes', 'reverse-proxy'],
    nextTopics: ['container-runtimes', 'redis-caching'],
    status: 'in-progress',
    x: 460,
    y: 80
  },
  {
    id: 'container-runtimes',
    slug: 'container-runtimes',
    title: 'Docker Internals: Namespaces & Cgroups',
    shortDescription: 'Creating process isolation using Linux kernel primitives and OverlayFS.',
    detailedDescription: 'Demystifies container engines: how Linux namespaces isolate PID/NET/MNT trees, how cgroups enforce memory/CPU limits, and how copy-on-write root filesystems enable lightweight ephemeral environments.',
    category: 'runtime',
    categoryLabel: 'Linux & OS Runtime',
    difficulty: 'Intermediate',
    prerequisites: ['linux-epoll'],
    relatedTopics: ['reverse-proxy', 'kubernetes-services'],
    nextTopics: ['kubernetes-services', 'reverse-proxy'],
    status: 'planned',
    x: 640,
    y: 80
  },
  {
    id: 'kubernetes-services',
    slug: 'kubernetes-services',
    title: 'Kubernetes Services Explained',
    shortDescription: 'Exposing Pods via ClusterIP, NodePort, and LoadBalancer abstractions.',
    detailedDescription: 'Understand how traffic reaches containerized applications, where each Service type is used, and how the Linux kernel routes requests across dynamic ephemeral Pods.',
    category: 'runtime',
    categoryLabel: 'Linux & OS Runtime',
    difficulty: 'Intermediate',
    prerequisites: ['container-runtimes', 'client-server'],
    relatedTopics: ['reverse-proxy', 'http-protocols'],
    nextTopics: ['reverse-proxy'],
    articleUrl: '/articles/kubernetes-services-clusterip-nodeport-loadbalancer',
    status: 'published',
    x: 820,
    y: 80
  },
  {
    id: 'reverse-proxy',
    slug: 'reverse-proxy',
    title: 'Reverse Proxies & Load Balancers',
    shortDescription: 'Nginx connection pooling, TLS termination, health probes, and round-robin routing.',
    detailedDescription: 'How reverse proxies protect backend application servers by buffering slow clients, pooling persistent HTTP keepalive connections, terminating SSL certificates, and shedding malformed requests.',
    category: 'runtime',
    categoryLabel: 'Linux & OS Runtime',
    difficulty: 'Intermediate',
    prerequisites: ['http-protocols', 'linux-epoll'],
    relatedTopics: ['redis-caching', 'rate-limiting'],
    nextTopics: ['redis-caching', 'async-queues', 'rate-limiting'],
    status: 'in-progress',
    x: 460,
    y: 200
  },
  {
    id: 'redis-caching',
    slug: 'redis-caching',
    title: 'Redis: In-Memory Caching & Eviction',
    shortDescription: 'Sub-millisecond latency, LRU/LFU memory eviction, and thundering herd mitigation.',
    detailedDescription: 'Deconstructs Redis single-threaded event loop, RESP protocol serialization, in-memory hash table re-hashing, and strategies to prevent cache stampedes, penetration, and thundering herds under traffic spikes.',
    category: 'storage',
    categoryLabel: 'Storage & Caching',
    difficulty: 'Intermediate',
    prerequisites: ['reverse-proxy'],
    relatedTopics: ['async-queues', 'rate-limiting'],
    nextTopics: ['async-queues', 'rate-limiting'],
    status: 'planned',
    x: 640,
    y: 200
  },
  {
    id: 'async-queues',
    slug: 'async-queues',
    title: 'Asynchronous Queues & Message Brokers',
    shortDescription: 'Decoupling peak traffic spikes from database writes with RabbitMQ and worker pools.',
    detailedDescription: 'Why synchronous REST APIs fail under burst traffic: how message queues decouple ingestion from processing, manage acknowledgment semantics, dead-letter exchanges, and consumer backpressure.',
    category: 'distributed',
    categoryLabel: 'Distributed Systems & Messaging',
    difficulty: 'Intermediate',
    prerequisites: ['reverse-proxy'],
    relatedTopics: ['kafka-commit-log'],
    nextTopics: ['kafka-commit-log', 'circuit-breakers'],
    status: 'planned',
    x: 460,
    y: 320
  },
  {
    id: 'kafka-commit-log',
    slug: 'kafka-commit-log',
    title: 'Kafka: Distributed Commit Logs & Partitions',
    shortDescription: 'Sequential disk append-only I/O, page cache exploitation, and consumer rebalancing.',
    detailedDescription: 'Examining why sequential disk access rivals RAM speeds: how Kafka leverages the OS page cache, zero-copy sendfile() syscalls, distributed partition offsets, and consumer group rebalancing.',
    category: 'distributed',
    categoryLabel: 'Distributed Systems & Messaging',
    difficulty: 'Advanced',
    prerequisites: ['async-queues'],
    relatedTopics: ['circuit-breakers'],
    nextTopics: ['circuit-breakers', 'case-url-shortener'],
    status: 'planned',
    x: 640,
    y: 320
  },
  {
    id: 'rate-limiting',
    slug: 'rate-limiting',
    title: 'Rate Limiting: Token Bucket vs Sliding Window',
    shortDescription: 'Algorithms and mathematical invariants for protecting APIs against resource exhaustion.',
    detailedDescription: 'Comparing the mechanics, memory footprint, and burst tolerances of Token Bucket, Leaky Bucket, Fixed Window, and Sliding Window Log algorithms across distributed Redis clusters.',
    category: 'reliability',
    categoryLabel: 'Production & Reliability',
    difficulty: 'Advanced',
    prerequisites: ['redis-caching'],
    relatedTopics: ['circuit-breakers'],
    nextTopics: ['circuit-breakers', 'case-url-shortener'],
    status: 'planned',
    x: 820,
    y: 200
  },
  {
    id: 'circuit-breakers',
    slug: 'circuit-breakers',
    title: 'Circuit Breakers & Cascading Outages',
    shortDescription: 'Three-state failure detection, timeout budgets, and half-open automated probes.',
    detailedDescription: 'Preventing catastrophic cascading failures when downstream microservices degrade: how Closed, Open, and Half-Open states isolate slow dependencies, shed load, and prevent retry storms.',
    category: 'reliability',
    categoryLabel: 'Production & Reliability',
    difficulty: 'Advanced',
    prerequisites: ['async-queues', 'rate-limiting'],
    relatedTopics: ['case-url-shortener'],
    nextTopics: ['case-url-shortener'],
    status: 'planned',
    x: 820,
    y: 320
  },
  {
    id: 'case-url-shortener',
    slug: 'case-url-shortener',
    title: 'System Design: High-Throughput URL Shortener',
    shortDescription: 'Base62 encoding, 100k QPS read-heavy caching, and B-Tree database indexing.',
    detailedDescription: 'End-to-end architectural case study: calculating storage bounds for 1 billion URLs, Base62 token generation with distributed counters, multi-tier Redis caching, and zero-collision guarantees.',
    category: 'case-studies',
    categoryLabel: 'System Design Case Studies',
    difficulty: 'Intermediate',
    prerequisites: ['redis-caching', 'rate-limiting'],
    relatedTopics: ['case-chat-system'],
    nextTopics: ['case-chat-system'],
    status: 'planned',
    x: 1000,
    y: 200
  },
  {
    id: 'case-chat-system',
    slug: 'case-chat-system',
    title: 'System Design: Real-Time Chat Architecture',
    shortDescription: 'Persistent WebSocket gateways, Redis Pub/Sub multiplexers, and message archives.',
    detailedDescription: 'Designing a Slack/Discord-scale messaging backbone: stateful WebSocket connection servers, ephemeral presence heartbeats, user-channel fan-out queues, and Cassandra wide-column storage for chat history.',
    category: 'case-studies',
    categoryLabel: 'System Design Case Studies',
    difficulty: 'Advanced',
    prerequisites: ['async-queues', 'circuit-breakers'],
    relatedTopics: ['case-url-shortener'],
    nextTopics: [],
    status: 'planned',
    x: 1000,
    y: 320
  }
];

export const TOPIC_EDGES: TopicEdge[] = [
  {
    id: 'edge-net-cs',
    source: 'networking-foundations',
    target: 'client-server',
    relationshipType: 'prerequisite',
    label: 'Prerequisite',
    description: 'Hardware sockets and transport demarcations are required before understanding application servers.',
    order: 1
  },
  {
    id: 'edge-net-dns',
    source: 'networking-foundations',
    target: 'dns-resolution',
    relationshipType: 'prerequisite',
    label: 'Prerequisite',
    description: 'IP addressing and UDP packets are the foundation of domain name tree resolution.',
    order: 2
  },
  {
    id: 'edge-cs-http',
    source: 'client-server',
    target: 'http-protocols',
    relationshipType: 'builds-on',
    label: 'Builds On',
    description: 'HTTP request-response semantics build directly upon established client-server socket channels.',
    order: 3
  },
  {
    id: 'edge-dns-http',
    source: 'dns-resolution',
    target: 'http-protocols',
    relationshipType: 'prerequisite',
    label: 'Prerequisite',
    description: 'A domain name must resolve to an IP before an HTTP TCP connection can be established.',
    order: 4
  },
  {
    id: 'edge-cs-epoll',
    source: 'client-server',
    target: 'linux-epoll',
    relationshipType: 'builds-on',
    label: 'Builds On',
    description: 'Understanding socket concurrency limitations leads into Linux kernel event polling.',
    order: 5
  },
  {
    id: 'edge-epoll-containers',
    source: 'linux-epoll',
    target: 'container-runtimes',
    relationshipType: 'related-to',
    label: 'Related To',
    description: 'Both epoll and containers rely on low-level Linux kernel subsystem isolation.',
    order: 6
  },
  {
    id: 'edge-containers-k8s',
    source: 'container-runtimes',
    target: 'kubernetes-services',
    relationshipType: 'builds-on',
    label: 'Builds On',
    description: 'Kubernetes Services orchestrate network packet routing across containerized Pods.',
    order: 7
  },
  {
    id: 'edge-http-proxy',
    source: 'http-protocols',
    target: 'reverse-proxy',
    relationshipType: 'builds-on',
    label: 'Builds On',
    description: 'Reverse proxies inspect and manipulate HTTP streams and terminate TLS.',
    order: 7
  },
  {
    id: 'edge-epoll-proxy',
    source: 'linux-epoll',
    target: 'reverse-proxy',
    relationshipType: 'builds-on',
    label: 'Builds On',
    description: 'High-performance proxies like Nginx use epoll event loops for client connection multiplexing.',
    order: 8
  },
  {
    id: 'edge-proxy-redis',
    source: 'reverse-proxy',
    target: 'redis-caching',
    relationshipType: 'commonly-used-with',
    label: 'Used With',
    description: 'Proxies cache static and dynamic query responses using in-memory key-value stores.',
    order: 9
  },
  {
    id: 'edge-proxy-queues',
    source: 'reverse-proxy',
    target: 'async-queues',
    relationshipType: 'commonly-used-with',
    label: 'Used With',
    description: 'Proxies buffer write-heavy HTTP requests into asynchronous background worker queues.',
    order: 10
  },
  {
    id: 'edge-queues-kafka',
    source: 'async-queues',
    target: 'kafka-commit-log',
    relationshipType: 'builds-on',
    label: 'Builds On',
    description: 'Kafka extends traditional queue message-passing into durable, distributed commit logs.',
    order: 11
  },
  {
    id: 'edge-redis-ratelimit',
    source: 'redis-caching',
    target: 'rate-limiting',
    relationshipType: 'commonly-used-with',
    label: 'Used With',
    description: 'Distributed rate limiting algorithms store token counters and timestamps in Redis.',
    order: 12
  },
  {
    id: 'edge-queues-circuit',
    source: 'async-queues',
    target: 'circuit-breakers',
    relationshipType: 'related-to',
    label: 'Related To',
    description: 'Both patterns prevent cascading service collapse under extreme upstream failure.',
    order: 13
  },
  {
    id: 'edge-ratelimit-case',
    source: 'rate-limiting',
    target: 'case-url-shortener',
    relationshipType: 'builds-on',
    label: 'Applied In',
    description: 'The URL Shortener architecture relies on rate limiters to prevent bot abuse and scraping.',
    order: 14
  },
  {
    id: 'edge-circuit-chat',
    source: 'circuit-breakers',
    target: 'case-chat-system',
    relationshipType: 'builds-on',
    label: 'Applied In',
    description: 'Chat connection gateways use circuit breakers to survive message broker outages.',
    order: 15
  }
];

export function getTopicById(id: string): TopicNode | undefined {
  return TOPICS.find((t) => t.id === id || t.slug === id);
}

export function getTopicsByCategory(category: TopicCategory): TopicNode[] {
  return TOPICS.filter((t) => t.category === category);
}

export function getPrerequisiteTopics(topicId: string): TopicNode[] {
  const topic = getTopicById(topicId);
  if (!topic) return [];
  return topic.prerequisites.map((id) => getTopicById(id)).filter(Boolean) as TopicNode[];
}

export function getNextTopics(topicId: string): TopicNode[] {
  const topic = getTopicById(topicId);
  if (!topic) return [];
  return topic.nextTopics.map((id) => getTopicById(id)).filter(Boolean) as TopicNode[];
}

export function getIncomingEdges(topicId: string): TopicEdge[] {
  return TOPIC_EDGES.filter((e) => e.target === topicId);
}

export function getOutgoingEdges(topicId: string): TopicEdge[] {
  return TOPIC_EDGES.filter((e) => e.source === topicId);
}
