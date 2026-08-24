import type { UPGProject, UPGGraph, UPGNode, UPGEdge, UPGGroup, UPGDocument } from '@hupa/core';

export function createDemoSagarEcosystem(): {
  project: UPGProject;
  graphs: Record<string, UPGGraph>;
  nodes: Record<string, UPGNode>;
  edges: Record<string, UPGEdge>;
  groups: Record<string, UPGGroup>;
  documents: Record<string, UPGDocument>;
} {
  const projectId = 'proj-sagar-ecosystem';
  const rootGraphId = 'graph-root-sagar';
  const snevaGraphId = 'graph-sneva';
  const langServerGraphId = 'graph-sneva-langserver';
  const sgrGraphId = 'graph-sgr-compiler';
  const oceanAIGraphId = 'graph-oceanai';
  const baasGraphId = 'graph-sagar-baas';

  const project: UPGProject = {
    id: projectId,
    name: 'Sagar Ecosystem',
    description:
      'Universal Next-Generation Software, AI, Language, and Cloud Infrastructure Ecosystem.',
    type: 'Software Ecosystem',
    domain: 'Systems & Developer Platforms',
    version: '2.4.0',
    rootGraphId,
    customNodeTypes: [],
    customRelationshipTypes: [],
    createdAt: Date.now() - 30 * 86400000,
    updatedAt: Date.now(),
    metadata: {
      team: 'Sagar Core Architecture Team',
      license: 'MIT / Proprietary Enterprise',
    },
  };

  const nodes: Record<string, UPGNode> = {};
  const edges: Record<string, UPGEdge> = {};
  const groups: Record<string, UPGGroup> = {};
  const graphs: Record<string, UPGGraph> = {};
  const documents: Record<string, UPGDocument> = {};

  // Helper to add node
  const addNode = (node: UPGNode) => {
    nodes[node.id] = node;
  };

  // Helper to add edge
  const addEdge = (
    id: string,
    graphId: string,
    sourceNodeId: string,
    targetNodeId: string,
    type: string,
    label?: string,
    notes?: string
  ) => {
    edges[id] = {
      id,
      projectId,
      graphId,
      sourceNodeId,
      targetNodeId,
      type,
      label: label || type,
      notes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  };

  // ==========================================
  // ROOT GRAPH NODES (SAGAR ECOSYSTEM)
  // ==========================================
  const rootGroupFoundations: UPGGroup = {
    id: 'grp-foundations',
    projectId,
    graphId: rootGraphId,
    name: 'Core Engine & Toolchain',
    category: 'architecture',
    color: '#09090b',
    position: { x: 50, y: 50 },
    size: { width: 750, height: 420 },
    nodeIds: ['node-ocean', 'node-sgr', 'node-sagar-server'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const rootGroupAI: UPGGroup = {
    id: 'grp-ai-platform',
    projectId,
    graphId: rootGraphId,
    name: 'AI Intelligence & Agentic Suite',
    category: 'ai',
    color: '#18181b',
    position: { x: 860, y: 50 },
    size: { width: 750, height: 420 },
    nodeIds: ['node-oceanai', 'node-shaggyai', 'node-seven-ai'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const rootGroupDevTools: UPGGroup = {
    id: 'grp-devtools',
    projectId,
    graphId: rootGraphId,
    name: 'Developer Experience & IDE',
    category: 'code',
    color: '#27272a',
    position: { x: 50, y: 520 },
    size: { width: 750, height: 420 },
    nodeIds: ['node-sneva', 'node-sagarui', 'node-sagarui-cli'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const rootGroupCloud: UPGGroup = {
    id: 'grp-cloud-backend',
    projectId,
    graphId: rootGraphId,
    name: 'Cloud Infrastructure & BaaS',
    category: 'infrastructure',
    color: '#3f3f46',
    position: { x: 860, y: 520 },
    size: { width: 750, height: 420 },
    nodeIds: ['node-sagar-cloud', 'node-sagar-baas', 'node-sagar-auth', 'node-sagar-db'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  groups[rootGroupFoundations.id] = rootGroupFoundations;
  groups[rootGroupAI.id] = rootGroupAI;
  groups[rootGroupDevTools.id] = rootGroupDevTools;
  groups[rootGroupCloud.id] = rootGroupCloud;

  // Nodes in Root Graph
  addNode({
    id: 'node-ocean',
    projectId,
    graphId: rootGraphId,
    type: 'framework',
    name: 'Ocean',
    description: 'High-performance core runtime engine and native asynchronous event loop.',
    status: 'active',
    priority: 'critical',
    version: '3.1.0',
    position: { x: 100, y: 140 },
    size: { width: 200, height: 110 },
    groupId: rootGroupFoundations.id,
    properties: {
      runtime: 'Native C++ / Rust',
      concurrency: 'Lock-free Work Stealing',
      throughput: '1.8M ops/sec',
    },
    tags: ['core', 'runtime', 'engine'],
    owner: 'Sagar Core',
    inputs: ['System IO', 'Network Stream'],
    outputs: ['Native Execution', 'Event Stream'],
    documentation:
      '# Ocean Engine\n\nOcean is the foundational runtime of the entire Sagar Ecosystem, providing high-throughput concurrency, zero-copy memory buffers, and hardware-accelerated computation primitives.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addNode({
    id: 'node-sgr',
    projectId,
    graphId: rootGraphId,
    subGraphId: sgrGraphId,
    type: 'module',
    name: '.sgr Language',
    description:
      'Type-safe, ultra-expressive systems programming language with built-in agentic contracts.',
    status: 'active',
    priority: 'critical',
    version: '1.2.4',
    position: { x: 340, y: 140 },
    size: { width: 200, height: 110 },
    groupId: rootGroupFoundations.id,
    properties: {
      paradigm: 'Multi-paradigm Systems',
      typeSystem: 'Dependent Static Typing',
      target: 'LLVM / WASM / Native',
    },
    tags: ['language', 'compiler', 'sgr'],
    owner: 'Language Guild',
    documentation:
      '# .sgr Language\n\nA modern programming language designed from the ground up for high-assurance systems, distributed graphs, and seamless AI agent interoperability.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addNode({
    id: 'node-sagar-server',
    projectId,
    graphId: rootGraphId,
    type: 'server',
    name: 'Sagar Server',
    description: 'Ultra-low-latency microservices host and HTTP/3 / gRPC gateway.',
    status: 'active',
    priority: 'high',
    version: '2.0.1',
    position: { x: 570, y: 140 },
    size: { width: 200, height: 110 },
    groupId: rootGroupFoundations.id,
    properties: {
      protocols: ['HTTP/3', 'gRPC', 'WebSockets', 'WebTransport'],
      p99Latency: '0.42ms',
    },
    tags: ['server', 'gateway', 'microservices'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addNode({
    id: 'node-oceanai',
    projectId,
    graphId: rootGraphId,
    subGraphId: oceanAIGraphId,
    type: 'ai-model',
    name: 'OceanAI',
    description: 'Distributed reasoning architecture & multimodal foundation intelligence.',
    status: 'active',
    priority: 'critical',
    version: '4.0-preview',
    position: { x: 910, y: 140 },
    size: { width: 200, height: 110 },
    groupId: rootGroupAI.id,
    properties: {
      contextWindow: '2M tokens',
      modalities: ['Code', 'Graph', 'Vision', 'Audio'],
      latency: 'Instantaneous stream',
    },
    tags: ['ai', 'foundation-model', 'reasoning'],
    owner: 'AI Lab',
    documentation:
      '# OceanAI Architecture\n\nOceanAI orchestrates deep tree-of-thought search, vector associative memory, and real-time tool orchestration.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addNode({
    id: 'node-shaggyai',
    projectId,
    graphId: rootGraphId,
    type: 'ai-agent',
    name: 'ShaggyAI',
    description: 'Autonomous software engineering agent capable of end-to-end development.',
    status: 'in-progress',
    priority: 'critical',
    version: '2.1.0',
    position: { x: 1140, y: 140 },
    size: { width: 200, height: 110 },
    groupId: rootGroupAI.id,
    properties: {
      autonomyLevel: 'Level 4 Autonomous Coder',
      toolAccess: ['Terminal', 'Compiler', 'Git', 'Debugger'],
    },
    tags: ['agent', 'coding-ai', 'automation'],
    owner: 'AI Lab',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addNode({
    id: 'node-seven-ai',
    projectId,
    graphId: rootGraphId,
    type: 'organization',
    name: 'The Seven AI Team',
    description: 'Autonomous multi-agent collective handling architecture, QA, docs, & security.',
    status: 'active',
    priority: 'high',
    version: '1.0.0',
    position: { x: 1370, y: 140 },
    size: { width: 200, height: 110 },
    groupId: rootGroupAI.id,
    properties: {
      agentsCount: 7,
      roles: ['Architect', 'Coder', 'Reviewer', 'Tester', 'SecOps', 'Docs', 'DevOps'],
    },
    tags: ['multi-agent', 'swarm', 'team'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addNode({
    id: 'node-sneva',
    projectId,
    graphId: rootGraphId,
    subGraphId: snevaGraphId,
    type: 'product',
    name: 'SNEVA IDE',
    description: 'Next-generation intelligent IDE built for frictionless graph-driven engineering.',
    status: 'active',
    priority: 'critical',
    version: '2.5.0',
    position: { x: 100, y: 610 },
    size: { width: 200, height: 110 },
    groupId: rootGroupDevTools.id,
    properties: {
      platform: 'Cross-platform Desktop / Web',
      rendering: 'Hardware GPU Accelerated',
    },
    tags: ['ide', 'editor', 'flagship'],
    owner: 'Tools Guild',
    documentation:
      '# SNEVA IDE\n\nSNEVA integrates code editing, visual architecture graphs, AI agent pair-programming, and terminal workspaces seamlessly.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addNode({
    id: 'node-sagarui',
    projectId,
    graphId: rootGraphId,
    type: 'component',
    name: 'SagarUI',
    description: 'Ultra-refined visual design system and component architecture.',
    status: 'active',
    priority: 'high',
    version: '3.0.4',
    position: { x: 340, y: 610 },
    size: { width: 200, height: 110 },
    groupId: rootGroupDevTools.id,
    properties: {
      componentsCount: 140,
      theming: 'Dynamic light/dark CSS variables',
      accessibility: 'WCAG AAA Compliant',
    },
    tags: ['ui', 'design-system', 'frontend'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addNode({
    id: 'node-sagarui-cli',
    projectId,
    graphId: rootGraphId,
    type: 'package',
    name: 'SagarUI CLI',
    description: 'Developer command line interface for scaffolding, component sync, and builds.',
    status: 'active',
    priority: 'medium',
    version: '1.4.2',
    position: { x: 570, y: 610 },
    size: { width: 200, height: 110 },
    groupId: rootGroupDevTools.id,
    properties: {
      bin: 'sagar-cli',
      speed: 'Sub-millisecond cold start',
    },
    tags: ['cli', 'tool', 'npm'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addNode({
    id: 'node-sagar-cloud',
    projectId,
    graphId: rootGraphId,
    type: 'environment',
    name: 'Sagar Cloud',
    description: 'Distributed global edge compute, orchestration, and zero-config deployment.',
    status: 'active',
    priority: 'critical',
    version: '2.0.0',
    position: { x: 910, y: 610 },
    size: { width: 200, height: 110 },
    groupId: rootGroupCloud.id,
    properties: {
      regions: '42 global edge locations',
      coldStart: '0ms',
    },
    tags: ['cloud', 'infrastructure', 'edge'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addNode({
    id: 'node-sagar-baas',
    projectId,
    graphId: rootGraphId,
    subGraphId: baasGraphId,
    type: 'service',
    name: 'Sagar BaaS',
    description: 'Complete backend-as-a-service with auth, realtime database, & file storage.',
    status: 'active',
    priority: 'critical',
    version: '1.8.0',
    position: { x: 1140, y: 610 },
    size: { width: 200, height: 110 },
    groupId: rootGroupCloud.id,
    properties: {
      uptime: '99.999%',
      multiTenant: true,
    },
    tags: ['baas', 'backend', 'api'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addNode({
    id: 'node-sagar-auth',
    projectId,
    graphId: rootGraphId,
    type: 'service',
    name: 'Sagar Auth',
    description: 'Zero-trust enterprise authentication, Passkeys, OAuth2, and RBAC.',
    status: 'active',
    priority: 'critical',
    version: '2.1.0',
    position: { x: 1370, y: 570 },
    size: { width: 190, height: 95 },
    groupId: rootGroupCloud.id,
    properties: {
      mfa: 'WebAuthn / Passkeys / TOTP',
      protocols: ['OIDC', 'OAuth 2.1', 'SAML'],
    },
    tags: ['auth', 'security', 'identity'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addNode({
    id: 'node-sagar-db',
    projectId,
    graphId: rootGraphId,
    type: 'database',
    name: 'Sagar Database',
    description: 'Distributed graph and vector database with ACID consistency and sub-ms reads.',
    status: 'active',
    priority: 'critical',
    version: '3.0.0',
    position: { x: 1370, y: 690 },
    size: { width: 190, height: 95 },
    groupId: rootGroupCloud.id,
    properties: {
      storageEngine: 'LSM Tree + HNSW Vector Graph',
      consistency: 'Strict Serializability',
    },
    tags: ['database', 'graph-db', 'vector-db'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  // Root Graph Relationships / Edges
  addEdge('e1', rootGraphId, 'node-ocean', 'node-oceanai', 'uses', 'powers');
  addEdge('e2', rootGraphId, 'node-ocean', 'node-sneva', 'uses', 'powers');
  addEdge('e3', rootGraphId, 'node-ocean', 'node-sgr', 'uses', 'powers');
  addEdge('e4', rootGraphId, 'node-sagarui', 'node-sneva', 'integrates-with', 'integrates with');
  addEdge('e5', rootGraphId, 'node-oceanai', 'node-shaggyai', 'uses', 'powers');
  addEdge('e6', rootGraphId, 'node-oceanai', 'node-seven-ai', 'communicates-with', 'orchestrates');
  addEdge('e7', rootGraphId, 'node-sagar-baas', 'node-sagar-auth', 'contains', 'provides');
  addEdge('e8', rootGraphId, 'node-sagar-baas', 'node-sagar-db', 'contains', 'provides');
  addEdge('e9', rootGraphId, 'node-sagar-cloud', 'node-sneva', 'deploys-to', 'deploys');
  addEdge('e10', rootGraphId, 'node-sagar-cloud', 'node-shaggyai', 'deploys-to', 'deploys');
  addEdge('e11', rootGraphId, 'node-sagarui-cli', 'node-sagarui', 'imports', 'manages');
  addEdge('e12', rootGraphId, 'node-sgr', 'node-sneva', 'communicates-with', 'language support');
  addEdge('e13', rootGraphId, 'node-sagar-server', 'node-sagar-baas', 'uses', 'powers');

  graphs[rootGraphId] = {
    id: rootGraphId,
    projectId,
    name: 'Sagar Ecosystem Root',
    description: 'Top-level architecture graph of the Sagar Ecosystem',
    nodeIds: Object.keys(nodes).filter((id) => nodes[id].graphId === rootGraphId),
    edgeIds: Object.keys(edges).filter((id) => edges[id].graphId === rootGraphId),
    groupIds: [
      rootGroupFoundations.id,
      rootGroupAI.id,
      rootGroupDevTools.id,
      rootGroupCloud.id,
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  // ==========================================
  // NESTED GRAPH 1: SNEVA IDE SUB-GRAPH
  // ==========================================
  addNode({
    id: 'node-sneva-editor',
    projectId,
    graphId: snevaGraphId,
    type: 'module',
    name: 'Editor Core',
    description: 'Hardware accelerated code canvas with Monaco & custom text-buffer shaders.',
    status: 'active',
    priority: 'critical',
    version: '2.5.0',
    position: { x: 100, y: 150 },
    size: { width: 210, height: 110 },
    properties: { buffer: 'Piece Table with SIMD', fps: 120 },
    tags: ['editor', 'core', 'rendering'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addNode({
    id: 'node-sneva-langserver',
    projectId,
    graphId: snevaGraphId,
    subGraphId: langServerGraphId,
    type: 'service',
    name: 'Language Server Engine',
    description: 'Multi-language LSP multiplexer with real-time semantic caching.',
    status: 'active',
    priority: 'critical',
    version: '2.1.0',
    position: { x: 380, y: 150 },
    size: { width: 220, height: 110 },
    properties: { lspVersion: '3.17', protocol: 'JSON-RPC' },
    tags: ['lsp', 'service', 'diagnostics'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addNode({
    id: 'node-sneva-terminal',
    projectId,
    graphId: snevaGraphId,
    type: 'component',
    name: 'Terminal Engine',
    description: 'Integrated PTY emulator with GPU font glyph cache and multiplexing.',
    status: 'active',
    priority: 'high',
    version: '1.9.0',
    position: { x: 670, y: 150 },
    size: { width: 200, height: 110 },
    properties: { shell: 'Zsh / Bash / PowerShell', renderer: 'WebGL' },
    tags: ['terminal', 'pty', 'shell'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addNode({
    id: 'node-sneva-git',
    projectId,
    graphId: snevaGraphId,
    type: 'module',
    name: 'Git Version Control',
    description: 'Visual 3-way merge, interactive rebase, blame annotations, & stashes.',
    status: 'active',
    priority: 'medium',
    version: '1.5.0',
    position: { x: 100, y: 340 },
    size: { width: 210, height: 110 },
    properties: { libgit2: true, asyncIndexing: true },
    tags: ['git', 'vcs', 'merge'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addNode({
    id: 'node-sneva-ai',
    projectId,
    graphId: snevaGraphId,
    type: 'ai-agent',
    name: 'AI Inline Assistant',
    description: 'Real-time next-token completions and architectural ghost edits.',
    status: 'active',
    priority: 'critical',
    version: '2.0.0',
    position: { x: 380, y: 340 },
    size: { width: 220, height: 110 },
    properties: { model: 'OceanAI Code Pro', latency: '40ms' },
    tags: ['ai-inline', 'copilot', 'assistant'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addNode({
    id: 'node-sneva-extensions',
    projectId,
    graphId: snevaGraphId,
    type: 'package',
    name: 'Extension Marketplace',
    description: 'Sandboxed WASM runtime for extensions, themes, and tool plugins.',
    status: 'active',
    priority: 'medium',
    version: '1.2.0',
    position: { x: 670, y: 340 },
    size: { width: 200, height: 110 },
    properties: { sandbox: 'Wasmtime Micro-VM' },
    tags: ['extensions', 'wasm', 'plugins'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addEdge('sneva-e1', snevaGraphId, 'node-sneva-editor', 'node-sneva-langserver', 'calls', 'requests diagnostics');
  addEdge('sneva-e2', snevaGraphId, 'node-sneva-editor', 'node-sneva-ai', 'uses', 'inline completions');
  addEdge('sneva-e3', snevaGraphId, 'node-sneva-editor', 'node-sneva-git', 'reads', 'git status & diffs');
  addEdge('sneva-e4', snevaGraphId, 'node-sneva-extensions', 'node-sneva-editor', 'extends', 'augments editor');

  graphs[snevaGraphId] = {
    id: snevaGraphId,
    projectId,
    name: 'SNEVA IDE Subsystem',
    description: 'Detailed modular breakdown of SNEVA IDE internal subsystems',
    parentNodeId: 'node-sneva',
    parentGraphId: rootGraphId,
    nodeIds: Object.keys(nodes).filter((id) => nodes[id].graphId === snevaGraphId),
    edgeIds: Object.keys(edges).filter((id) => edges[id].graphId === snevaGraphId),
    groupIds: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  // ==========================================
  // NESTED GRAPH 2: LANGUAGE SERVER SUB-GRAPH (Deep nesting)
  // ==========================================
  addNode({
    id: 'node-ls-parser',
    projectId,
    graphId: langServerGraphId,
    type: 'function',
    name: 'Incremental AST Parser',
    description: 'Tree-sitter based incremental concrete syntax tree builder.',
    status: 'active',
    priority: 'critical',
    version: '1.4.0',
    position: { x: 80, y: 140 },
    size: { width: 210, height: 100 },
    properties: { speed: '12μs incremental re-parse' },
    tags: ['ast', 'parser', 'tree-sitter'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addNode({
    id: 'node-ls-typecheck',
    projectId,
    graphId: langServerGraphId,
    type: 'function',
    name: 'Bi-directional Type Checker',
    description: 'Hindley-Milner type inference engine with trait constraint solver.',
    status: 'active',
    priority: 'critical',
    version: '2.0.1',
    position: { x: 360, y: 140 },
    size: { width: 220, height: 100 },
    properties: { solver: 'Constraint graph' },
    tags: ['type-checker', 'types', 'inference'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addNode({
    id: 'node-ls-diagnostics',
    projectId,
    graphId: langServerGraphId,
    type: 'endpoint',
    name: 'Diagnostics Publisher',
    description: 'Dispatches errors, warnings, and code-action quickfixes to IDE client.',
    status: 'active',
    priority: 'high',
    version: '1.0.0',
    position: { x: 650, y: 140 },
    size: { width: 210, height: 100 },
    properties: { debouncing: '15ms' },
    tags: ['diagnostics', 'lint', 'errors'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addNode({
    id: 'node-ls-completions',
    projectId,
    graphId: langServerGraphId,
    type: 'function',
    name: 'Fuzzy Completion Engine',
    description: 'Context-aware symbol resolution with ranking and scope traversal.',
    status: 'active',
    priority: 'high',
    version: '1.2.0',
    position: { x: 220, y: 320 },
    size: { width: 220, height: 100 },
    properties: { indexSize: '450k symbols cached' },
    tags: ['completions', 'intellisense', 'symbols'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addEdge('ls-e1', langServerGraphId, 'node-ls-parser', 'node-ls-typecheck', 'produces', 'provides AST');
  addEdge('ls-e2', langServerGraphId, 'node-ls-typecheck', 'node-ls-diagnostics', 'produces', 'reports type errors');
  addEdge('ls-e3', langServerGraphId, 'node-ls-typecheck', 'node-ls-completions', 'reads', 'supplies scoped types');

  graphs[langServerGraphId] = {
    id: langServerGraphId,
    projectId,
    name: 'Language Server Pipeline',
    description: 'Fine-grained parser, type checker, diagnostics, and completions pipeline',
    parentNodeId: 'node-sneva-langserver',
    parentGraphId: snevaGraphId,
    nodeIds: Object.keys(nodes).filter((id) => nodes[id].graphId === langServerGraphId),
    edgeIds: Object.keys(edges).filter((id) => edges[id].graphId === langServerGraphId),
    groupIds: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  // ==========================================
  // NESTED GRAPH 3: .SGR COMPILER
  // ==========================================
  addNode({
    id: 'node-sgr-lexer',
    projectId,
    graphId: sgrGraphId,
    type: 'function',
    name: 'SIMD Lexer',
    description: 'Vectorized tokenization with zero memory allocation.',
    status: 'completed',
    priority: 'critical',
    position: { x: 80, y: 150 },
    size: { width: 190, height: 100 },
    properties: { speed: '3.2 GB/s' },
    tags: ['lexer', 'simd', 'compiler'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addNode({
    id: 'node-sgr-parser',
    projectId,
    graphId: sgrGraphId,
    type: 'function',
    name: 'Recursive Descent Parser',
    description: 'Generates strongly-typed AST with rich error-recovery tokens.',
    status: 'completed',
    priority: 'critical',
    position: { x: 330, y: 150 },
    size: { width: 210, height: 100 },
    properties: { grammar: 'LL(k) predictive' },
    tags: ['parser', 'ast'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addNode({
    id: 'node-sgr-ir',
    projectId,
    graphId: sgrGraphId,
    type: 'module',
    name: 'SSA Intermediate Rep (IR)',
    description: 'Static Single Assignment intermediate representation optimizer.',
    status: 'active',
    priority: 'high',
    position: { x: 600, y: 150 },
    size: { width: 210, height: 100 },
    properties: { passes: ['Dead Code Elimination', 'Inlining', 'Loop Vectorization'] },
    tags: ['ssa', 'ir', 'optimizer'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addNode({
    id: 'node-sgr-codegen',
    projectId,
    graphId: sgrGraphId,
    type: 'module',
    name: 'LLVM / WASM Codegen',
    description: 'Emits optimized machine bytecode, LLVM IR, and WebAssembly bundles.',
    status: 'in-progress',
    priority: 'critical',
    position: { x: 870, y: 150 },
    size: { width: 210, height: 100 },
    properties: { backends: ['x86_64', 'AArch64', 'WASM32'] },
    tags: ['codegen', 'llvm', 'wasm'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addEdge('sgr-e1', sgrGraphId, 'node-sgr-lexer', 'node-sgr-parser', 'produces', 'tokens');
  addEdge('sgr-e2', sgrGraphId, 'node-sgr-parser', 'node-sgr-ir', 'produces', 'AST to IR');
  addEdge('sgr-e3', sgrGraphId, 'node-sgr-ir', 'node-sgr-codegen', 'produces', 'Optimized IR to Machine Code');

  graphs[sgrGraphId] = {
    id: sgrGraphId,
    projectId,
    name: '.sgr Compiler Toolchain',
    description: 'End-to-end lexer, parser, SSA optimizer, and backend code generator',
    parentNodeId: 'node-sgr',
    parentGraphId: rootGraphId,
    nodeIds: Object.keys(nodes).filter((id) => nodes[id].graphId === sgrGraphId),
    edgeIds: Object.keys(edges).filter((id) => edges[id].graphId === sgrGraphId),
    groupIds: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  // ==========================================
  // NESTED GRAPH 4: SAGAR BAAS
  // ==========================================
  addNode({
    id: 'node-baas-gateway',
    projectId,
    graphId: baasGraphId,
    type: 'api',
    name: 'Edge API Gateway',
    description: 'Globally distributed GraphQL & REST gateway with automated rate limiting.',
    status: 'active',
    priority: 'critical',
    position: { x: 100, y: 140 },
    size: { width: 210, height: 100 },
    properties: { protocols: ['GraphQL', 'REST', 'gRPC-web'] },
    tags: ['api-gateway', 'graphql'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addNode({
    id: 'node-baas-realtime',
    projectId,
    graphId: baasGraphId,
    type: 'service',
    name: 'Realtime Sync Engine',
    description: 'WebSocket pub/sub cluster for live document sync with CRDT conflict resolution.',
    status: 'active',
    priority: 'high',
    position: { x: 380, y: 140 },
    size: { width: 220, height: 100 },
    properties: { algorithm: 'Yjs CRDT over WebSockets' },
    tags: ['realtime', 'websockets', 'crdt'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addNode({
    id: 'node-baas-storage',
    projectId,
    graphId: baasGraphId,
    type: 'database',
    name: 'Object & Blob Storage',
    description: 'S3-compatible distributed object storage with edge image optimization.',
    status: 'active',
    priority: 'medium',
    position: { x: 670, y: 140 },
    size: { width: 210, height: 100 },
    properties: { durability: '99.999999999%' },
    tags: ['storage', 's3', 'media'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addEdge('baas-e1', baasGraphId, 'node-baas-gateway', 'node-baas-realtime', 'calls', 'routes live streams');
  addEdge('baas-e2', baasGraphId, 'node-baas-gateway', 'node-baas-storage', 'authenticates', 'signs upload URLs');

  graphs[baasGraphId] = {
    id: baasGraphId,
    projectId,
    name: 'Sagar BaaS Architecture',
    description: 'Internal components of Sagar Backend-as-a-Service',
    parentNodeId: 'node-sagar-baas',
    parentGraphId: rootGraphId,
    nodeIds: Object.keys(nodes).filter((id) => nodes[id].graphId === baasGraphId),
    edgeIds: Object.keys(edges).filter((id) => edges[id].graphId === baasGraphId),
    groupIds: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  // ==========================================
  // NESTED GRAPH 5: OCEAN AI
  // ==========================================
  addNode({
    id: 'node-oai-router',
    projectId,
    graphId: oceanAIGraphId,
    type: 'service',
    name: 'Intent & Prompt Router',
    description: 'Dynamic semantic routing to specialized mixture-of-experts subnetworks.',
    status: 'active',
    priority: 'critical',
    position: { x: 100, y: 140 },
    size: { width: 210, height: 100 },
    properties: { routingSpeed: '2.4ms' },
    tags: ['router', 'moe', 'routing'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addNode({
    id: 'node-oai-mem',
    projectId,
    graphId: oceanAIGraphId,
    type: 'database',
    name: 'Associative Graph Memory',
    description: 'Long-term vector episodic memory & architectural graph index.',
    status: 'active',
    priority: 'critical',
    position: { x: 380, y: 140 },
    size: { width: 220, height: 100 },
    properties: { embeddings: 'Ocean-Vector-v2', dims: 1536 },
    tags: ['memory', 'vectors', 'rag'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addNode({
    id: 'node-oai-tools',
    projectId,
    graphId: oceanAIGraphId,
    type: 'ai-tool',
    name: 'MCP Tool Orchestrator',
    description: 'Protocol bridge executing model context protocol actions securely in sandboxes.',
    status: 'active',
    priority: 'critical',
    position: { x: 670, y: 140 },
    size: { width: 210, height: 100 },
    properties: { mcpProtocol: '2024-11-05' },
    tags: ['mcp', 'tools', 'sandbox'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  addEdge('oai-e1', oceanAIGraphId, 'node-oai-router', 'node-oai-mem', 'reads', 'queries memory');
  addEdge('oai-e2', oceanAIGraphId, 'node-oai-router', 'node-oai-tools', 'calls', 'executes tools');

  graphs[oceanAIGraphId] = {
    id: oceanAIGraphId,
    projectId,
    name: 'OceanAI Cognitive Pipeline',
    description: 'Internal routing, associative memory, and tool execution orchestration',
    parentNodeId: 'node-oceanai',
    parentGraphId: rootGraphId,
    nodeIds: Object.keys(nodes).filter((id) => nodes[id].graphId === oceanAIGraphId),
    edgeIds: Object.keys(edges).filter((id) => edges[id].graphId === oceanAIGraphId),
    groupIds: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  // Demo Documents
  documents['doc-1'] = {
    id: 'doc-1',
    projectId,
    title: 'Sagar Ecosystem Master Architecture Specification',
    content: `# Sagar Ecosystem Master Architecture Specification

## Overview
The Sagar Ecosystem represents a unified, vertically integrated technology stack spanning language compilation (.sgr), runtime execution (Ocean), developer environments (SNEVA IDE), design systems (SagarUI), and autonomous intelligence (OceanAI, ShaggyAI, The Seven AI Team).

## Architectural Pillars
1. **Zero Compromise Performance**: Sub-millisecond latency across all compute layers.
2. **First-class Graph Primitives**: Everything is modeled as an interconnected graph.
3. **Autonomous Agent Integration**: Every component exposes formal MCP interfaces for agent interaction.

## Graph Hierarchy
* Sagar Ecosystem
  * SNEVA IDE
    * Language Server Engine (nested parser, type checker, diagnostics)
  * .sgr Compiler
  * OceanAI Reasoning System
  * Sagar BaaS Cloud Platform
`,
    tags: ['architecture', 'spec', 'rfc'],
    linkedNodeIds: ['node-ocean', 'node-sgr', 'node-sneva', 'node-oceanai'],
    createdAt: Date.now() - 10 * 86400000,
    updatedAt: Date.now(),
  };

  documents['doc-2'] = {
    id: 'doc-2',
    projectId,
    title: '.sgr Type System & Concurrency RFC',
    content: `# .sgr Type System & Concurrency RFC

## Summary
Specification for dependent types, algebraic effects, and linear memory capabilities in .sgr.

## Linear Types
Linear types ensure memory buffers are consumed exactly once, eliminating garbage collection overhead while maintaining total memory safety.
`,
    tags: ['sgr', 'compiler', 'spec'],
    linkedNodeIds: ['node-sgr', 'node-sgr-ir'],
    createdAt: Date.now() - 5 * 86400000,
    updatedAt: Date.now(),
  };

  return { project, graphs, nodes, edges, groups, documents };
}
