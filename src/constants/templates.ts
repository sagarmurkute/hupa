import type { UPGProject, UPGGraph, UPGNode, UPGEdge, UPGGroup } from '../types/graph';

export interface ProjectTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  domain: string;
  createData: (projectId: string) => {
    project: UPGProject;
    graphs: Record<string, UPGGraph>;
    nodes: Record<string, UPGNode>;
    edges: Record<string, UPGEdge>;
    groups: Record<string, UPGGroup>;
  };
}

export const UNIVERSAL_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Project',
    category: 'General',
    description: 'Clean, empty canvas to design your architecture from scratch.',
    domain: 'Custom Architecture',
    createData: (projectId: string) => {
      const rootGraphId = `graph-root-${projectId}`;
      const project: UPGProject = {
        id: projectId,
        name: 'New Architecture',
        description: 'Universal visual project architecture graph.',
        type: 'Custom Architecture',
        domain: 'Systems & Software',
        version: '0.1.0',
        rootGraphId,
        customNodeTypes: [],
        customRelationshipTypes: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const rootGraph: UPGGraph = {
        id: rootGraphId,
        projectId,
        name: 'System Root',
        description: 'Root system canvas',
        nodeIds: [],
        edgeIds: [],
        groupIds: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      return { project, graphs: { [rootGraphId]: rootGraph }, nodes: {}, edges: {}, groups: {} };
    },
  },
  {
    id: 'fullstack-web',
    name: 'Modern Fullstack Web Application',
    category: 'Web & Cloud',
    description: 'Frontend client, REST/GraphQL API Gateway, Auth, Postgres DB, Redis Cache, and CDN.',
    domain: 'Web Application',
    createData: (projectId: string) => {
      const rootGraphId = `graph-root-${projectId}`;
      const project: UPGProject = {
        id: projectId,
        name: 'Fullstack Web Platform',
        description: 'Production web application architecture with decoupled frontend, API, and storage tiers.',
        type: 'Web Application',
        domain: 'Web & Cloud',
        version: '1.0.0',
        rootGraphId,
        customNodeTypes: [],
        customRelationshipTypes: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const nodes: Record<string, UPGNode> = {};
      const edges: Record<string, UPGEdge> = {};
      const groups: Record<string, UPGGroup> = {};

      const grpClient: UPGGroup = {
        id: `grp-client-${projectId}`,
        projectId,
        graphId: rootGraphId,
        name: 'Client & Edge Layer',
        category: 'product',
        color: '#09090b',
        position: { x: 50, y: 80 },
        size: { width: 520, height: 320 },
        nodeIds: [`node-cdn-${projectId}`, `node-web-${projectId}`],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const grpBackend: UPGGroup = {
        id: `grp-backend-${projectId}`,
        projectId,
        graphId: rootGraphId,
        name: 'Application Services',
        category: 'architecture',
        color: '#18181b',
        position: { x: 620, y: 80 },
        size: { width: 520, height: 320 },
        nodeIds: [`node-api-${projectId}`, `node-auth-${projectId}`],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const grpData: UPGGroup = {
        id: `grp-data-${projectId}`,
        projectId,
        graphId: rootGraphId,
        name: 'Persistence & Cache Tier',
        category: 'database',
        color: '#27272a',
        position: { x: 1190, y: 80 },
        size: { width: 520, height: 320 },
        nodeIds: [`node-db-${projectId}`, `node-cache-${projectId}`],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      groups[grpClient.id] = grpClient;
      groups[grpBackend.id] = grpBackend;
      groups[grpData.id] = grpData;

      const nCdn: UPGNode = {
        id: `node-cdn-${projectId}`,
        projectId,
        graphId: rootGraphId,
        type: 'domain',
        name: 'Global CDN / Edge DNS',
        description: 'Cloudflare / CloudFront edge routing, DDoS mitigation, and TLS termination.',
        status: 'active',
        priority: 'high',
        position: { x: 90, y: 160 },
        size: { width: 200, height: 110 },
        groupId: grpClient.id,
        properties: { provider: 'Edge CDN', ssl: 'Strict TLS 1.3' },
        tags: ['edge', 'cdn', 'dns'],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const nWeb: UPGNode = {
        id: `node-web-${projectId}`,
        projectId,
        graphId: rootGraphId,
        type: 'page',
        name: 'Frontend Web Client',
        description: 'React / Next.js single-page application with responsive UI components.',
        status: 'active',
        priority: 'critical',
        position: { x: 330, y: 160 },
        size: { width: 200, height: 110 },
        groupId: grpClient.id,
        properties: { framework: 'React / TypeScript', rendering: 'SSR + Client Hydration' },
        tags: ['frontend', 'ui', 'react'],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const nApi: UPGNode = {
        id: `node-api-${projectId}`,
        projectId,
        graphId: rootGraphId,
        type: 'api',
        name: 'REST / GraphQL API Gateway',
        description: 'Core backend application server handling requests, routing, and rate limiting.',
        status: 'active',
        priority: 'critical',
        position: { x: 660, y: 160 },
        size: { width: 210, height: 110 },
        groupId: grpBackend.id,
        properties: { runtime: 'Node.js / Go', protocol: 'HTTP/2 JSON-RPC' },
        tags: ['backend', 'api', 'gateway'],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const nAuth: UPGNode = {
        id: `node-auth-${projectId}`,
        projectId,
        graphId: rootGraphId,
        type: 'service',
        name: 'Authentication Service',
        description: 'JWT token issuance, OAuth2 providers, session validation, and RBAC.',
        status: 'active',
        priority: 'high',
        position: { x: 900, y: 160 },
        size: { width: 200, height: 110 },
        groupId: grpBackend.id,
        properties: { strategy: 'JWT + Refresh Token', mfa: 'TOTP / WebAuthn' },
        tags: ['auth', 'security', 'identity'],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const nDb: UPGNode = {
        id: `node-db-${projectId}`,
        projectId,
        graphId: rootGraphId,
        type: 'database',
        name: 'Primary Relational Database',
        description: 'PostgreSQL database cluster with automated replication and ACID consistency.',
        status: 'active',
        priority: 'critical',
        position: { x: 1230, y: 160 },
        size: { width: 210, height: 110 },
        groupId: grpData.id,
        properties: { engine: 'PostgreSQL 16', poolSize: 50 },
        tags: ['database', 'postgres', 'sql'],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const nCache: UPGNode = {
        id: `node-cache-${projectId}`,
        projectId,
        graphId: rootGraphId,
        type: 'database',
        name: 'Redis In-Memory Cache',
        description: 'Low-latency key-value store for session state, query caching, and pub/sub.',
        status: 'active',
        priority: 'medium',
        position: { x: 1470, y: 160 },
        size: { width: 200, height: 110 },
        groupId: grpData.id,
        properties: { engine: 'Redis 7', eviction: 'volatile-lru' },
        tags: ['cache', 'redis', 'memory'],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      [nCdn, nWeb, nApi, nAuth, nDb, nCache].forEach((n) => {
        nodes[n.id] = n;
      });

      const addE = (src: string, tgt: string, type: string, label: string) => {
        const id = `edge-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        edges[id] = {
          id,
          projectId,
          graphId: rootGraphId,
          sourceNodeId: src,
          targetNodeId: tgt,
          type,
          label,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
      };

      addE(nCdn.id, nWeb.id, 'deploys-to', 'serves assets');
      addE(nWeb.id, nApi.id, 'calls', 'API requests');
      addE(nApi.id, nAuth.id, 'authenticates', 'validates token');
      addE(nApi.id, nDb.id, 'stores', 'reads/writes data');
      addE(nApi.id, nCache.id, 'uses', 'session cache');

      const rootGraph: UPGGraph = {
        id: rootGraphId,
        projectId,
        name: 'System Architecture',
        description: 'Fullstack application topology',
        nodeIds: Object.keys(nodes),
        edgeIds: Object.keys(edges),
        groupIds: Object.keys(groups),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      return { project, graphs: { [rootGraphId]: rootGraph }, nodes, edges, groups };
    },
  },
  {
    id: 'microservices',
    name: 'Distributed Cloud Microservices',
    category: 'Backend & Cloud',
    description: 'API Gateway, User Service, Billing Service, Notification Service, Kafka Event Bus, and Kubernetes cluster.',
    domain: 'Backend Platform',
    createData: (projectId: string) => {
      const rootGraphId = `graph-root-${projectId}`;
      const project: UPGProject = {
        id: projectId,
        name: 'Microservices Cloud Platform',
        description: 'Distributed microservice cluster communicating over asynchronous event bus and gRPC.',
        type: 'Microservices Platform',
        domain: 'Cloud & Infrastructure',
        version: '1.0.0',
        rootGraphId,
        customNodeTypes: [],
        customRelationshipTypes: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const nodes: Record<string, UPGNode> = {};
      const edges: Record<string, UPGEdge> = {};
      const groups: Record<string, UPGGroup> = {};

      const nGw: UPGNode = {
        id: `node-gw-${projectId}`,
        projectId,
        graphId: rootGraphId,
        type: 'api',
        name: 'API Gateway & Ingress',
        description: 'Traefik / Kong ingress controller routing client requests to target microservices.',
        status: 'active',
        priority: 'critical',
        position: { x: 100, y: 220 },
        size: { width: 210, height: 110 },
        tags: ['gateway', 'ingress', 'routing'],
        properties: { protocol: 'HTTP/3 + gRPC' },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const nUser: UPGNode = {
        id: `node-user-${projectId}`,
        projectId,
        graphId: rootGraphId,
        type: 'service',
        name: 'User & Identity Service',
        description: 'User profile management, tenancy segregation, and credentials storage.',
        status: 'active',
        priority: 'high',
        position: { x: 420, y: 100 },
        size: { width: 210, height: 110 },
        tags: ['user', 'auth', 'microservice'],
        properties: { framework: 'Go / gRPC' },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const nBill: UPGNode = {
        id: `node-bill-${projectId}`,
        projectId,
        graphId: rootGraphId,
        type: 'service',
        name: 'Billing & Payments Service',
        description: 'Stripe integration, subscription billing cycles, and invoice generation.',
        status: 'active',
        priority: 'critical',
        position: { x: 420, y: 240 },
        size: { width: 210, height: 110 },
        tags: ['billing', 'payments', 'stripe'],
        properties: { compliance: 'PCI-DSS' },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const nNotify: UPGNode = {
        id: `node-notify-${projectId}`,
        projectId,
        graphId: rootGraphId,
        type: 'service',
        name: 'Notification Worker',
        description: 'Asynchronous transactional emails, SMS alerts, and WebSocket push notifications.',
        status: 'active',
        priority: 'medium',
        position: { x: 420, y: 380 },
        size: { width: 210, height: 110 },
        tags: ['notifications', 'email', 'push'],
        properties: { channels: ['Email', 'SMS', 'WebPush'] },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const nKafka: UPGNode = {
        id: `node-kafka-${projectId}`,
        projectId,
        graphId: rootGraphId,
        type: 'event',
        name: 'Apache Kafka Event Bus',
        description: 'Distributed event log streaming domain events between decoupled services.',
        status: 'active',
        priority: 'critical',
        position: { x: 740, y: 240 },
        size: { width: 210, height: 110 },
        tags: ['kafka', 'events', 'pubsub'],
        properties: { partitions: 12, retention: '7 days' },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const nK8s: UPGNode = {
        id: `node-k8s-${projectId}`,
        projectId,
        graphId: rootGraphId,
        type: 'server',
        name: 'Kubernetes Cluster',
        description: 'Managed container cluster with automated horizontal pod autoscaling (HPA).',
        status: 'active',
        priority: 'critical',
        position: { x: 1040, y: 240 },
        size: { width: 210, height: 110 },
        tags: ['k8s', 'infra', 'containers'],
        properties: { nodes: 6, autoscaling: true },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      [nGw, nUser, nBill, nNotify, nKafka, nK8s].forEach((n) => {
        nodes[n.id] = n;
      });

      const addE = (src: string, tgt: string, type: string, label: string) => {
        const id = `edge-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        edges[id] = {
          id,
          projectId,
          graphId: rootGraphId,
          sourceNodeId: src,
          targetNodeId: tgt,
          type,
          label,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
      };

      addE(nGw.id, nUser.id, 'calls', 'routes auth/user');
      addE(nGw.id, nBill.id, 'calls', 'routes checkout');
      addE(nBill.id, nKafka.id, 'triggers', 'publishes PaymentSucceeded');
      addE(nKafka.id, nNotify.id, 'consumes', 'subscribes to send receipt');
      addE(nK8s.id, nGw.id, 'deploys-to', 'hosts containers');

      const rootGraph: UPGGraph = {
        id: rootGraphId,
        projectId,
        name: 'Microservices Topology',
        description: 'Distributed services cluster graph',
        nodeIds: Object.keys(nodes),
        edgeIds: Object.keys(edges),
        groupIds: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      return { project, graphs: { [rootGraphId]: rootGraph }, nodes, edges, groups };
    },
  },
  {
    id: 'ai-agents',
    name: 'Autonomous AI Agent Platform',
    category: 'AI & Intelligence',
    description: 'LLM Prompt Router, Multi-Agent Swarm, Vector Associative Memory, and Sandboxed MCP Tools.',
    domain: 'AI Systems',
    createData: (projectId: string) => {
      const rootGraphId = `graph-root-${projectId}`;
      const project: UPGProject = {
        id: projectId,
        name: 'AI Agent Swarm Architecture',
        description: 'Multi-agent cognitive orchestration pipeline with long-term memory and tool calling.',
        type: 'AI System',
        domain: 'AI & Autonomous Systems',
        version: '1.0.0',
        rootGraphId,
        customNodeTypes: [],
        customRelationshipTypes: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const nodes: Record<string, UPGNode> = {};
      const edges: Record<string, UPGEdge> = {};

      const nRouter: UPGNode = {
        id: `node-router-${projectId}`,
        projectId,
        graphId: rootGraphId,
        type: 'service',
        name: 'Semantic Intent Router',
        description: 'Classifies incoming user objectives and delegates to specialized agents.',
        status: 'active',
        priority: 'critical',
        position: { x: 100, y: 220 },
        size: { width: 210, height: 110 },
        tags: ['router', 'intent', 'classifier'],
        properties: { routingSpeed: '2.4ms' },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const nCoder: UPGNode = {
        id: `node-coder-${projectId}`,
        projectId,
        graphId: rootGraphId,
        type: 'ai-agent',
        name: 'Code Generation Agent',
        description: 'Specialized reasoning agent writing syntax-correct implementations.',
        status: 'active',
        priority: 'high',
        position: { x: 420, y: 120 },
        size: { width: 210, height: 110 },
        tags: ['agent', 'coder', 'llm'],
        properties: { contextTokens: '1M' },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const nReview: UPGNode = {
        id: `node-review-${projectId}`,
        projectId,
        graphId: rootGraphId,
        type: 'ai-agent',
        name: 'Code Review & QA Agent',
        description: 'Inspects AST, identifies bugs, and runs validation test suites.',
        status: 'active',
        priority: 'high',
        position: { x: 420, y: 300 },
        size: { width: 210, height: 110 },
        tags: ['agent', 'reviewer', 'qa'],
        properties: { staticAnalysis: true },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const nVector: UPGNode = {
        id: `node-vector-${projectId}`,
        projectId,
        graphId: rootGraphId,
        type: 'database',
        name: 'Vector Episodic Memory',
        description: 'Pinecone / Qdrant HNSW vector index storing long-term context and past solutions.',
        status: 'active',
        priority: 'critical',
        position: { x: 740, y: 120 },
        size: { width: 210, height: 110 },
        tags: ['vector-db', 'rag', 'memory'],
        properties: { dimensions: 1536, metric: 'cosine' },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const nMcp: UPGNode = {
        id: `node-mcp-${projectId}`,
        projectId,
        graphId: rootGraphId,
        type: 'ai-tool',
        name: 'MCP Sandboxed Tools',
        description: 'Model Context Protocol server with terminal, filesystem, and browser tools.',
        status: 'active',
        priority: 'critical',
        position: { x: 740, y: 300 },
        size: { width: 210, height: 110 },
        tags: ['mcp', 'tools', 'sandbox'],
        properties: { securityLevel: 'Sandboxed gVisor' },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      [nRouter, nCoder, nReview, nVector, nMcp].forEach((n) => {
        nodes[n.id] = n;
      });

      const addE = (src: string, tgt: string, type: string, label: string) => {
        const id = `edge-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        edges[id] = {
          id,
          projectId,
          graphId: rootGraphId,
          sourceNodeId: src,
          targetNodeId: tgt,
          type,
          label,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
      };

      addE(nRouter.id, nCoder.id, 'triggers', 'delegates coding task');
      addE(nCoder.id, nReview.id, 'calls', 'submits for review');
      addE(nCoder.id, nVector.id, 'reads', 'retrieves RAG memory');
      addE(nCoder.id, nMcp.id, 'uses', 'executes tool in sandbox');

      const rootGraph: UPGGraph = {
        id: rootGraphId,
        projectId,
        name: 'Cognitive Pipeline',
        description: 'AI Swarm architecture',
        nodeIds: Object.keys(nodes),
        edgeIds: Object.keys(edges),
        groupIds: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      return { project, graphs: { [rootGraphId]: rootGraph }, nodes, edges, groups: {} };
    },
  },
];
