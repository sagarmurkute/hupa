export type NodeCategory =
  | 'product'
  | 'architecture'
  | 'code'
  | 'infrastructure'
  | 'database'
  | 'ai'
  | 'management'
  | 'organization'
  | 'custom';

export type NodeStatus =
  | 'concept'
  | 'planned'
  | 'in-progress'
  | 'active'
  | 'review'
  | 'completed'
  | 'deprecated'
  | 'blocked';

export type NodePriority = 'low' | 'medium' | 'high' | 'critical';

export type BuiltinNodeType =
  | 'project'
  | 'product'
  | 'feature'
  | 'requirement'
  | 'module'
  | 'service'
  | 'component'
  | 'page'
  | 'ui-element'
  | 'api'
  | 'endpoint'
  | 'database'
  | 'table'
  | 'field'
  | 'function'
  | 'file'
  | 'package'
  | 'library'
  | 'framework'
  | 'server'
  | 'environment'
  | 'domain'
  | 'deployment'
  | 'ai-agent'
  | 'ai-model'
  | 'ai-tool'
  | 'integration'
  | 'event'
  | 'task'
  | 'bug'
  | 'test'
  | 'release'
  | 'document'
  | 'person'
  | 'organization'
  | 'custom';

export type RelationshipType =
  | 'contains'
  | 'depends-on'
  | 'uses'
  | 'calls'
  | 'imports'
  | 'extends'
  | 'implements'
  | 'stores'
  | 'reads'
  | 'writes'
  | 'authenticates'
  | 'deploys-to'
  | 'triggers'
  | 'produces'
  | 'consumes'
  | 'belongs-to'
  | 'replaces'
  | 'blocks'
  | 'related-to'
  | 'connects-to'
  | 'references'
  | 'inherits'
  | 'communicates-with'
  | 'custom';

export interface NodeTypeDefinition {
  type: string;
  label: string;
  category: NodeCategory;
  description: string;
  icon: string;
  color: string;
  badgeBg: string;
  borderColor: string;
  defaultProperties?: Record<string, any>;
  allowedRelationships?: RelationshipType[];
}

export interface RelationshipTypeDefinition {
  type: RelationshipType | string;
  label: string;
  description: string;
  color: string;
  lineStyle: 'solid' | 'dashed' | 'dotted';
  animated?: boolean;
  bidirectional?: boolean;
}

export interface NodePosition {
  x: number;
  y: number;
}

export interface NodeSize {
  width: number;
  height: number;
}

export interface UPGNode {
  id: string;
  projectId: string;
  graphId: string; // The graph or sub-graph this node lives in
  subGraphId?: string; // If this node contains a nested sub-graph, points to that sub-graph ID
  type: BuiltinNodeType | string;
  name: string;
  description: string;
  status: NodeStatus;
  priority: NodePriority;
  version?: string;
  position: NodePosition;
  size: NodeSize;
  groupId?: string;
  properties: Record<string, any>;
  tags: string[];
  owner?: string;
  inputs?: string[];
  outputs?: string[];
  documentation?: string;
  links?: { title: string; url: string }[];
  createdAt: number;
  updatedAt: number;
  metadata?: Record<string, any>;
}

export interface UPGEdge {
  id: string;
  projectId: string;
  graphId: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourceHandle?: 'top' | 'right' | 'bottom' | 'left';
  targetHandle?: 'top' | 'right' | 'bottom' | 'left';
  type: RelationshipType | string;
  label?: string;
  notes?: string;
  color?: string;
  lineStyle?: 'solid' | 'dashed' | 'dotted';
  animated?: boolean;
  metadata?: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

export interface UPGGroup {
  id: string;
  projectId: string;
  graphId: string;
  name: string;
  description?: string;
  category?: NodeCategory;
  color: string;
  position: NodePosition;
  size: NodeSize;
  isCollapsed?: boolean;
  nodeIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface UPGGraph {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  parentNodeId?: string; // If this is a nested sub-graph inside a node
  parentGraphId?: string; // Hierarchy
  nodeIds: string[];
  edgeIds: string[];
  groupIds: string[];
  createdAt: number;
  updatedAt: number;
}

export type ViewPerspective =
  | 'all'
  | 'architecture'
  | 'dependency'
  | 'product'
  | 'ui'
  | 'infrastructure'
  | 'security'
  | 'development'
  | 'ai'
  | 'database';

export interface UPGView {
  id: string;
  projectId: string;
  name: string;
  perspective: ViewPerspective;
  description: string;
  icon: string;
  filterNodeTypes?: string[];
  filterCategories?: NodeCategory[];
  filterStatuses?: NodeStatus[];
  filterRelationshipTypes?: string[];
  isCustom?: boolean;
}

export interface UPGDocument {
  id: string;
  projectId: string;
  title: string;
  content: string;
  tags: string[];
  linkedNodeIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface UPGProject {
  id: string;
  name: string;
  description: string;
  type: string;
  domain: string;
  version: string;
  rootGraphId: string;
  customNodeTypes: NodeTypeDefinition[];
  customRelationshipTypes: RelationshipTypeDefinition[];
  createdAt: number;
  updatedAt: number;
  isCloud?: boolean;
  cloudProjectId?: string;
  syncStatus?: 'local' | 'synced' | 'pending' | 'conflict' | 'error';
  lastSyncedAt?: number;
  metadata?: Record<string, any>;
}

export interface CanvasTransform {
  x: number;
  y: number;
  zoom: number;
}

export type CanvasTool = 'select' | 'pan' | 'connect' | 'group' | 'marquee';

export interface SelectionState {
  nodeIds: string[];
  edgeIds: string[];
  groupIds: string[];
}

export interface PendingConnection {
  sourceNodeId: string;
  sourceHandle: 'top' | 'right' | 'bottom' | 'left';
  currentX: number;
  currentY: number;
}

export interface GraphStats {
  totalNodes: number;
  totalEdges: number;
  totalGroups: number;
  totalGraphs: number;
  dependenciesCount: number;
  unresolvedCount: number;
  orphanCount: number;
  circularDependencyCycles: string[][];
  avgConnectivity: number;
}
