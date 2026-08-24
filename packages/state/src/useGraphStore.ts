import { create } from 'zustand';
import type {
  UPGProject,
  UPGGraph,
  UPGNode,
  UPGEdge,
  UPGGroup,
  UPGView,
  UPGDocument,
  CanvasTransform,
  CanvasTool,
  PendingConnection,
  NodeTypeDefinition,
  RelationshipTypeDefinition,
  NodePosition,
  BuiltinNodeType,
  RelationshipType,
} from '@hupa/core';
import { DEFAULT_VIEWS } from '@hupa/shared';
import { BUILTIN_NODE_TYPES } from '@hupa/shared';
import { BUILTIN_RELATIONSHIP_TYPES } from '@hupa/shared';
import { UNIVERSAL_TEMPLATES } from '@hupa/shared';
import { localDb } from '@hupa/storage';
import { syncEngine } from '@hupa/sync';

export interface BreadcrumbItem {
  graphId: string;
  name: string;
  nodeId?: string;
}

interface GraphSnapshot {
  nodes: Record<string, UPGNode>;
  edges: Record<string, UPGEdge>;
  groups: Record<string, UPGGroup>;
  graphs: Record<string, UPGGraph>;
}

export interface GraphStoreState {
  // Projects
  projects: Record<string, UPGProject>;
  activeProjectId: string;

  // Graphs & Navigation
  graphs: Record<string, UPGGraph>;
  activeGraphId: string;
  breadcrumbs: BreadcrumbItem[];

  // Entities
  nodes: Record<string, UPGNode>;
  edges: Record<string, UPGEdge>;
  groups: Record<string, UPGGroup>;
  documents: Record<string, UPGDocument>;

  // Views & Filtering
  views: UPGView[];
  activeViewId: string;
  searchQuery: string;

  // Canvas State
  transform: CanvasTransform;
  selectedNodeIds: string[];
  selectedEdgeIds: string[];
  selectedGroupIds: string[];
  activeTool: CanvasTool;
  isGridVisible: boolean;
  isSnapToGrid: boolean;
  pendingConnection: PendingConnection | null;

  // UI State
  isSidebarOpen: boolean;
  isInspectorOpen: boolean;
  inspectorTab: 'overview' | 'properties' | 'relations' | 'docs' | 'activity';
  isCommandPaletteOpen: boolean;
  isNewProjectModalOpen: boolean;
  isNewNodeModalOpen: boolean;
  isRelationshipPickerOpen: boolean;
  relationshipPickerContext: {
    sourceNodeId: string;
    targetNodeId: string;
    sourceHandle?: 'top' | 'right' | 'bottom' | 'left';
    targetHandle?: 'top' | 'right' | 'bottom' | 'left';
  } | null;
  isCustomTypeModalOpen: boolean;
  isExportModalOpen: boolean;
  isStatsModalOpen: boolean;
  isShortcutsModalOpen: boolean;
  activeSidebarTab: 'overview' | 'nodes' | 'views' | 'documents' | 'groups';

  // History
  undoStack: GraphSnapshot[];
  redoStack: GraphSnapshot[];

  // Custom definitions
  customNodeTypes: Record<string, NodeTypeDefinition>;
  customRelationshipTypes: Record<string, RelationshipTypeDefinition>;

  // Actions
  initialize: () => Promise<void>;
  saveToStorage: () => void;
  resetToTemplate: (templateId?: string) => void;
  exportProjectJson: () => string;
  importProjectJson: (jsonStr: string) => boolean;

  // Project Actions
  setActiveProject: (projectId: string) => void;
  createProject: (name: string, description: string, domain: string, templateId?: string, isCloud?: boolean) => void;
  updateProject: (projectId: string, updates: Partial<UPGProject>) => void;
  deleteProject: (projectId: string) => void;
  uploadProjectToCloud: (projectId: string) => Promise<boolean>;
  openCloudProject: (cloudProjectId: string) => Promise<boolean>;

  // Navigation / Nested Graphs
  navigateToGraph: (graphId: string, pushBreadcrumb?: boolean) => void;
  drillIntoNode: (nodeId: string) => void;
  navigateBreadcrumb: (index: number) => void;

  // View Actions
  setActiveView: (viewId: string) => void;
  setSearchQuery: (query: string) => void;

  // Canvas Actions
  setTransform: (transform: Partial<CanvasTransform> | ((prev: CanvasTransform) => CanvasTransform)) => void;
  resetZoom: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomToFit: () => void;
  setActiveTool: (tool: CanvasTool) => void;
  toggleGrid: () => void;
  toggleSnapToGrid: () => void;

  // Selection Actions
  selectNode: (nodeId: string, multi?: boolean) => void;
  selectEdge: (edgeId: string, multi?: boolean) => void;
  selectGroup: (groupId: string, multi?: boolean) => void;
  clearSelection: () => void;
  selectAll: () => void;

  // Node CRUD
  addNode: (node: Partial<UPGNode> & { name: string; type: BuiltinNodeType | string; position: NodePosition }) => string;
  updateNode: (nodeId: string, updates: Partial<UPGNode>) => void;
  updateNodePosition: (nodeId: string, position: NodePosition) => void;
  updateMultipleNodePositions: (positions: Record<string, NodePosition>) => void;
  updateNodeSize: (nodeId: string, size: { width: number; height: number }) => void;
  deleteNode: (nodeId: string) => void;
  duplicateSelectedNodes: () => void;

  // Edge CRUD
  startConnection: (sourceNodeId: string, sourceHandle: 'top' | 'right' | 'bottom' | 'left', x: number, y: number) => void;
  updatePendingConnection: (x: number, y: number) => void;
  cancelPendingConnection: () => void;
  completeConnection: (
    targetNodeId: string,
    targetHandle?: 'top' | 'right' | 'bottom' | 'left',
    type?: RelationshipType | string,
    label?: string
  ) => void;
  openRelationshipPicker: (
    sourceNodeId: string,
    targetNodeId: string,
    sourceHandle?: 'top' | 'right' | 'bottom' | 'left',
    targetHandle?: 'top' | 'right' | 'bottom' | 'left'
  ) => void;
  closeRelationshipPicker: () => void;
  addEdge: (
    sourceNodeId: string,
    targetNodeId: string,
    type: RelationshipType | string,
    label?: string,
    sourceHandle?: 'top' | 'right' | 'bottom' | 'left',
    targetHandle?: 'top' | 'right' | 'bottom' | 'left'
  ) => string;
  updateEdge: (edgeId: string, updates: Partial<UPGEdge>) => void;
  deleteEdge: (edgeId: string) => void;

  // Group CRUD
  addGroup: (name: string, nodeIds: string[], color?: string) => string;
  groupSelectedNodes: (name?: string) => string | null;
  updateGroup: (groupId: string, updates: Partial<UPGGroup>) => void;
  deleteGroup: (groupId: string) => void;

  // Document CRUD
  addDocument: (title: string, content: string, linkedNodeIds?: string[]) => string;
  updateDocument: (docId: string, updates: Partial<UPGDocument>) => void;
  deleteDocument: (docId: string) => void;

  // Custom Types
  addCustomNodeType: (typeDef: NodeTypeDefinition) => void;
  addCustomRelationshipType: (relDef: RelationshipTypeDefinition) => void;

  // UI Modals & Panels
  setSidebarOpen: (open: boolean) => void;
  setInspectorOpen: (open: boolean) => void;
  setInspectorTab: (tab: 'overview' | 'properties' | 'relations' | 'docs' | 'activity') => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setNewProjectModalOpen: (open: boolean) => void;
  setNewNodeModalOpen: (open: boolean) => void;
  setCustomTypeModalOpen: (open: boolean) => void;
  setExportModalOpen: (open: boolean) => void;
  setStatsModalOpen: (open: boolean) => void;
  setShortcutsModalOpen: (open: boolean) => void;
  setActiveSidebarTab: (tab: 'overview' | 'nodes' | 'views' | 'documents' | 'groups') => void;

  // History Actions
  pushHistorySnapshot: () => void;
  undo: () => void;
  redo: () => void;
}

// Generate initial synchronous state so canvas never starts empty/null
const initialTemplate = UNIVERSAL_TEMPLATES[1].createData('proj-default');
const initialProjectId = initialTemplate.project.id;
const initialRootGraphId = initialTemplate.project.rootGraphId;
const initialViews = DEFAULT_VIEWS.map((v) => ({ ...v, projectId: initialProjectId }));

export const useGraphStore = create<GraphStoreState>((set, get) => ({
  projects: { [initialProjectId]: initialTemplate.project },
  activeProjectId: initialProjectId,
  graphs: initialTemplate.graphs,
  activeGraphId: initialRootGraphId,
  breadcrumbs: [
    {
      graphId: initialRootGraphId,
      name: initialTemplate.graphs[initialRootGraphId]?.name || 'System Architecture',
    },
  ],
  nodes: initialTemplate.nodes,
  edges: initialTemplate.edges,
  groups: initialTemplate.groups,
  documents: {},
  views: initialViews,
  activeViewId: 'view-all',
  searchQuery: '',

  transform: { x: 280, y: 140, zoom: 0.8 },
  selectedNodeIds: Object.keys(initialTemplate.nodes).slice(0, 1),
  selectedEdgeIds: [],
  selectedGroupIds: [],
  activeTool: 'select',
  isGridVisible: true,
  isSnapToGrid: true,
  pendingConnection: null,

  isSidebarOpen: true,
  isInspectorOpen: true,
  inspectorTab: 'overview',
  isCommandPaletteOpen: false,
  isNewProjectModalOpen: false,
  isNewNodeModalOpen: false,
  isRelationshipPickerOpen: false,
  relationshipPickerContext: null,
  isCustomTypeModalOpen: false,
  isExportModalOpen: false,
  isStatsModalOpen: false,
  isShortcutsModalOpen: false,
  activeSidebarTab: 'overview',

  undoStack: [],
  redoStack: [],

  customNodeTypes: {},
  customRelationshipTypes: {},

  initialize: async () => {
    try {
      // 1. Check & Migrate legacy localStorage into IndexedDB
      await localDb.checkAndMigrateLocalStorage();

      // 2. Load from IndexedDB
      const loaded = await localDb.loadCompleteWorkspace();
      const projKeys = Object.keys(loaded.projects);

      if (projKeys.length > 0) {
        const activePid = loaded.activeProjectId && loaded.projects[loaded.activeProjectId] ? loaded.activeProjectId : projKeys[0];
        const activeProj = loaded.projects[activePid];
        const activeGId = loaded.activeGraphId && loaded.graphs[loaded.activeGraphId] ? loaded.activeGraphId : activeProj.rootGraphId;
        const rootGraph = loaded.graphs[activeGId] || loaded.graphs[activeProj.rootGraphId];

        set({
          projects: loaded.projects,
          activeProjectId: activePid,
          graphs: loaded.graphs,
          activeGraphId: activeGId,
          nodes: loaded.nodes,
          edges: loaded.edges,
          groups: loaded.groups,
          documents: loaded.documents,
          views: loaded.views && loaded.views.length > 0 ? loaded.views : DEFAULT_VIEWS.map((v) => ({ ...v, projectId: activePid })),
          customNodeTypes: loaded.customNodeTypes || {},
          customRelationshipTypes: loaded.customRelationshipTypes || {},
          breadcrumbs: loaded.breadcrumbs && loaded.breadcrumbs.length > 0 ? loaded.breadcrumbs : [
            {
              graphId: activeGId,
              name: rootGraph ? rootGraph.name : 'System Architecture',
            },
          ],
          transform: loaded.transform || { x: 280, y: 140, zoom: 0.8 },
        });

        // Initialize sync engine
        syncEngine.init();
        return;
      }
    } catch (err) {
      console.warn('Failed to load from IndexedDB, using starter template', err);
    }

    // Save initial starter state to IndexedDB
    get().saveToStorage();
    syncEngine.init();
  },

  saveToStorage: () => {
    const state = get();
    localDb.saveCompleteWorkspace({
      projects: state.projects,
      activeProjectId: state.activeProjectId,
      graphs: state.graphs,
      activeGraphId: state.activeGraphId,
      nodes: state.nodes,
      edges: state.edges,
      groups: state.groups,
      documents: state.documents,
      views: state.views,
      customNodeTypes: state.customNodeTypes,
      customRelationshipTypes: state.customRelationshipTypes,
      breadcrumbs: state.breadcrumbs,
      transform: state.transform,
    }).catch((e) => {
      console.error('Failed to save to IndexedDB:', e);
    });
  },

  resetToTemplate: (templateId = 'fullstack-web') => {
    const template = UNIVERSAL_TEMPLATES.find((t) => t.id === templateId) || UNIVERSAL_TEMPLATES[1];
    const pid = `proj-${Date.now()}`;
    const data = template.createData(pid);
    const views = DEFAULT_VIEWS.map((v) => ({ ...v, projectId: data.project.id }));

    set({
      projects: { [data.project.id]: data.project },
      activeProjectId: data.project.id,
      graphs: data.graphs,
      activeGraphId: data.project.rootGraphId,
      breadcrumbs: [
        {
          graphId: data.project.rootGraphId,
          name: data.graphs[data.project.rootGraphId]?.name || 'System Architecture',
        },
      ],
      nodes: data.nodes,
      edges: data.edges,
      groups: data.groups,
      documents: {},
      views,
      activeViewId: 'view-all',
      selectedNodeIds: Object.keys(data.nodes).slice(0, 1),
      selectedEdgeIds: [],
      selectedGroupIds: [],
      transform: { x: 280, y: 140, zoom: 0.8 },
      undoStack: [],
      redoStack: [],
    });

    get().saveToStorage();
  },

  exportProjectJson: () => {
    const state = get();
    const activeProject = state.projects[state.activeProjectId];
    const projectGraphs = Object.values(state.graphs).filter((g) => g.projectId === state.activeProjectId);
    const projectNodes = Object.values(state.nodes).filter((n) => n.projectId === state.activeProjectId);
    const projectEdges = Object.values(state.edges).filter((e) => e.projectId === state.activeProjectId);
    const projectGroups = Object.values(state.groups).filter((g) => g.projectId === state.activeProjectId);
    const projectDocs = Object.values(state.documents).filter((d) => d.projectId === state.activeProjectId);

    const exportObj = {
      format: 'UniversalProjectGraph',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      project: activeProject,
      graphs: projectGraphs,
      nodes: projectNodes,
      edges: projectEdges,
      groups: projectGroups,
      views: state.views,
      documents: projectDocs,
      customNodeTypes: Object.values(state.customNodeTypes),
      customRelationshipTypes: Object.values(state.customRelationshipTypes),
    };

    return JSON.stringify(exportObj, null, 2);
  },

  importProjectJson: (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (!data.project || !data.project.id || !data.graphs) {
        return false;
      }

      get().pushHistorySnapshot();

      const newProjectId = data.project.id;
      const newGraphs: Record<string, UPGGraph> = { ...get().graphs };
      const newNodes: Record<string, UPGNode> = { ...get().nodes };
      const newEdges: Record<string, UPGEdge> = { ...get().edges };
      const newGroups: Record<string, UPGGroup> = { ...get().groups };
      const newDocs: Record<string, UPGDocument> = { ...get().documents };

      (data.graphs || []).forEach((g: UPGGraph) => {
        newGraphs[g.id] = g;
      });
      (data.nodes || []).forEach((n: UPGNode) => {
        newNodes[n.id] = n;
      });
      (data.edges || []).forEach((e: UPGEdge) => {
        newEdges[e.id] = e;
      });
      (data.groups || []).forEach((gr: UPGGroup) => {
        newGroups[gr.id] = gr;
      });
      (data.documents || []).forEach((d: UPGDocument) => {
        newDocs[d.id] = d;
      });

      const rootGraphId = data.project.rootGraphId || (data.graphs[0] ? data.graphs[0].id : '');

      set((state) => ({
        projects: { ...state.projects, [newProjectId]: data.project },
        activeProjectId: newProjectId,
        graphs: newGraphs,
        activeGraphId: rootGraphId,
        breadcrumbs: [
          {
            graphId: rootGraphId,
            name: newGraphs[rootGraphId]?.name || data.project.name,
          },
        ],
        nodes: newNodes,
        edges: newEdges,
        groups: newGroups,
        documents: newDocs,
        selectedNodeIds: [],
        selectedEdgeIds: [],
        selectedGroupIds: [],
      }));

      get().saveToStorage();
      return true;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  },

  // Navigation & Sub-graphs
  navigateToGraph: (graphId: string, pushBreadcrumb = true) => {
    const state = get();
    const targetGraph = state.graphs[graphId];
    if (!targetGraph) return;

    let newBreadcrumbs = [...state.breadcrumbs];
    if (pushBreadcrumb) {
      const existingIdx = newBreadcrumbs.findIndex((b) => b.graphId === graphId);
      if (existingIdx >= 0) {
        newBreadcrumbs = newBreadcrumbs.slice(0, existingIdx + 1);
      } else {
        newBreadcrumbs.push({
          graphId: targetGraph.id,
          name: targetGraph.name,
          nodeId: targetGraph.parentNodeId,
        });
      }
    }

    set({
      activeGraphId: graphId,
      breadcrumbs: newBreadcrumbs,
      selectedNodeIds: [],
      selectedEdgeIds: [],
      selectedGroupIds: [],
      transform: { x: 300, y: 180, zoom: 0.85 },
    });

    get().saveToStorage();
  },

  drillIntoNode: (nodeId: string) => {
    const state = get();
    const node = state.nodes[nodeId];
    if (!node) return;

    if (node.subGraphId && state.graphs[node.subGraphId]) {
      get().navigateToGraph(node.subGraphId, true);
    } else {
      const newSubGraphId = `graph-${node.id}-${Date.now()}`;
      const newSubGraph: UPGGraph = {
        id: newSubGraphId,
        projectId: state.activeProjectId,
        name: `${node.name} Subsystem`,
        description: `Detailed internal architecture for ${node.name}`,
        parentNodeId: node.id,
        parentGraphId: state.activeGraphId,
        nodeIds: [],
        edgeIds: [],
        groupIds: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      get().pushHistorySnapshot();

      const updatedNode = { ...node, subGraphId: newSubGraphId, updatedAt: Date.now() };

      set((s) => ({
        graphs: { ...s.graphs, [newSubGraphId]: newSubGraph },
        nodes: {
          ...s.nodes,
          [nodeId]: updatedNode,
        },
      }));

      get().saveToStorage();

      if (state.projects[state.activeProjectId]?.isCloud) {
        syncEngine.queueChange(state.activeProjectId, 'graph', newSubGraphId, 'CREATE', newSubGraph);
        syncEngine.queueChange(state.activeProjectId, 'node', nodeId, 'UPDATE', updatedNode);
      }

      get().navigateToGraph(newSubGraphId, true);
    }
  },

  navigateBreadcrumb: (index: number) => {
    const state = get();
    if (index >= 0 && index < state.breadcrumbs.length) {
      const target = state.breadcrumbs[index];
      const newBreadcrumbs = state.breadcrumbs.slice(0, index + 1);
      set({
        activeGraphId: target.graphId,
        breadcrumbs: newBreadcrumbs,
        selectedNodeIds: [],
        selectedEdgeIds: [],
        selectedGroupIds: [],
      });
      get().saveToStorage();
    }
  },

  // Project Actions
  setActiveProject: (projectId: string) => {
    const state = get();
    const project = state.projects[projectId];
    if (!project) return;
    const rootGraph = state.graphs[project.rootGraphId];

    set({
      activeProjectId: projectId,
      activeGraphId: project.rootGraphId,
      breadcrumbs: [
        {
          graphId: project.rootGraphId,
          name: rootGraph ? rootGraph.name : project.name,
        },
      ],
      selectedNodeIds: [],
      selectedEdgeIds: [],
      selectedGroupIds: [],
    });
    get().saveToStorage();
  },

  createProject: (name: string, description: string, domain: string, templateId = 'blank', isCloud = false) => {
    const projectId = `proj-${Date.now()}`;
    const template = UNIVERSAL_TEMPLATES.find((t) => t.id === templateId) || UNIVERSAL_TEMPLATES[0];
    const data = template.createData(projectId);

    data.project.name = name;
    if (description.trim()) data.project.description = description;
    if (domain.trim()) data.project.domain = domain;
    data.project.isCloud = isCloud;
    data.project.syncStatus = isCloud ? 'pending' : 'local';

    const views = DEFAULT_VIEWS.map((v) => ({ ...v, projectId }));

    set((s) => ({
      projects: { ...s.projects, [projectId]: data.project },
      graphs: { ...s.graphs, ...data.graphs },
      nodes: { ...s.nodes, ...data.nodes },
      edges: { ...s.edges, ...data.edges },
      groups: { ...s.groups, ...data.groups },
      views,
      activeProjectId: projectId,
      activeGraphId: data.project.rootGraphId,
      breadcrumbs: [{ graphId: data.project.rootGraphId, name: data.graphs[data.project.rootGraphId]?.name || name }],
      selectedNodeIds: Object.keys(data.nodes).slice(0, 1),
      selectedEdgeIds: [],
      selectedGroupIds: [],
      transform: { x: 300, y: 150, zoom: 0.85 },
    }));

    get().saveToStorage();

    if (isCloud) {
      syncEngine.uploadLocalProjectToCloud(projectId).catch((err) => {
        console.warn('Initial cloud upload deferred to sync queue:', err);
      });
    }
  },

  updateProject: (projectId: string, updates: Partial<UPGProject>) => {
    set((s) => {
      const p = s.projects[projectId];
      if (!p) return s;
      const updated = { ...p, ...updates, updatedAt: Date.now() };
      return {
        projects: {
          ...s.projects,
          [projectId]: updated,
        },
      };
    });

    get().saveToStorage();

    const state = get();
    if (state.projects[projectId]?.isCloud) {
      syncEngine.queueChange(projectId, 'project', projectId, 'UPDATE', state.projects[projectId]);
    }
  },

  deleteProject: (projectId: string) => {
    const state = get();
    get().pushHistorySnapshot();

    const isCloudProject = state.projects[projectId]?.isCloud;

    const remainingProjects = { ...state.projects };
    delete remainingProjects[projectId];

    const remainingGraphs: Record<string, UPGGraph> = {};
    Object.values(state.graphs).forEach((g) => {
      if (g.projectId !== projectId) remainingGraphs[g.id] = g;
    });

    const remainingNodes: Record<string, UPGNode> = {};
    Object.values(state.nodes).forEach((n) => {
      if (n.projectId !== projectId) remainingNodes[n.id] = n;
    });

    const remainingEdges: Record<string, UPGEdge> = {};
    Object.values(state.edges).forEach((e) => {
      if (e.projectId !== projectId) remainingEdges[e.id] = e;
    });

    const remainingGroups: Record<string, UPGGroup> = {};
    Object.values(state.groups).forEach((gr) => {
      if (gr.projectId !== projectId) remainingGroups[gr.id] = gr;
    });

    const remainingDocs: Record<string, UPGDocument> = {};
    Object.values(state.documents).forEach((d) => {
      if (d.projectId !== projectId) remainingDocs[d.id] = d;
    });

    const projectKeys = Object.keys(remainingProjects);
    if (projectKeys.length > 0) {
      const nextProjectId = projectKeys[0];
      const nextProject = remainingProjects[nextProjectId];
      set({
        projects: remainingProjects,
        graphs: remainingGraphs,
        nodes: remainingNodes,
        edges: remainingEdges,
        groups: remainingGroups,
        documents: remainingDocs,
        activeProjectId: nextProjectId,
        activeGraphId: nextProject.rootGraphId,
        breadcrumbs: [{ graphId: nextProject.rootGraphId, name: nextProject.name }],
        selectedNodeIds: [],
        selectedEdgeIds: [],
        selectedGroupIds: [],
      });
      get().saveToStorage();
    } else {
      get().resetToTemplate('blank');
    }

    if (isCloudProject) {
      syncEngine.queueChange(projectId, 'project', projectId, 'DELETE');
    }
  },

  uploadProjectToCloud: async (projectId: string) => {
    try {
      const res = await syncEngine.uploadLocalProjectToCloud(projectId);
      if (res.success) {
        set((s) => {
          const p = s.projects[projectId];
          if (!p) return s;
          return {
            projects: {
              ...s.projects,
              [projectId]: { ...p, isCloud: true, syncStatus: 'synced', lastSyncedAt: Date.now() },
            },
          };
        });
        get().saveToStorage();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  openCloudProject: async (cloudProjectId: string) => {
    try {
      const bundle = await syncEngine.downloadCloudProject(cloudProjectId);
      if (bundle && bundle.project) {
        const rootGraphId = bundle.project.rootGraphId || Object.keys(bundle.graphs || {})[0];
        const newProjects = { ...get().projects, [bundle.project.id]: bundle.project };
        const newGraphs = { ...get().graphs, ...bundle.graphs };
        const newNodes = { ...get().nodes, ...bundle.nodes };
        const newEdges = { ...get().edges, ...bundle.edges };
        const newGroups = { ...get().groups, ...bundle.groups };
        const newDocs = { ...get().documents, ...bundle.documents };

        set({
          projects: newProjects,
          graphs: newGraphs,
          nodes: newNodes,
          edges: newEdges,
          groups: newGroups,
          documents: newDocs,
          activeProjectId: bundle.project.id,
          activeGraphId: rootGraphId,
          breadcrumbs: [
            {
              graphId: rootGraphId,
              name: newGraphs[rootGraphId]?.name || bundle.project.name,
            },
          ],
          selectedNodeIds: [],
          selectedEdgeIds: [],
          selectedGroupIds: [],
          transform: { x: 280, y: 140, zoom: 0.8 },
        });

        get().saveToStorage();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  // Views & Search
  setActiveView: (viewId: string) => set({ activeViewId: viewId }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),

  // Canvas Actions
  setTransform: (transformUpdate) => {
    set((state) => {
      const nextTransform =
        typeof transformUpdate === 'function' ? transformUpdate(state.transform) : { ...state.transform, ...transformUpdate };
      nextTransform.zoom = Math.max(0.15, Math.min(3.0, nextTransform.zoom));
      return { transform: nextTransform };
    });
  },

  resetZoom: () => set((s) => ({ transform: { ...s.transform, zoom: 1.0 } })),
  zoomIn: () => set((s) => ({ transform: { ...s.transform, zoom: Math.min(3.0, s.transform.zoom * 1.2) } })),
  zoomOut: () => set((s) => ({ transform: { ...s.transform, zoom: Math.max(0.15, s.transform.zoom / 1.2) } })),
  zoomToFit: () => {
    const state = get();
    const currentGraphNodes = Object.values(state.nodes).filter((n) => n.graphId === state.activeGraphId);
    if (currentGraphNodes.length === 0) {
      set({ transform: { x: 300, y: 200, zoom: 1 } });
      return;
    }

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    currentGraphNodes.forEach((n) => {
      minX = Math.min(minX, n.position.x);
      minY = Math.min(minY, n.position.y);
      maxX = Math.max(maxX, n.position.x + (n.size?.width || 210));
      maxY = Math.max(maxY, n.position.y + (n.size?.height || 110));
    });

    const padding = 100;
    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;

    const viewportW = window.innerWidth - (state.isSidebarOpen ? 250 : 44) - (state.isInspectorOpen ? 350 : 0);
    const viewportH = window.innerHeight - 74;

    const zoom = Math.max(0.2, Math.min(1.2, Math.min(viewportW / width, viewportH / height)));
    const x = (viewportW - (maxX + minX) * zoom) / 2;
    const y = (viewportH - (maxY + minY) * zoom) / 2;

    set({ transform: { x, y, zoom } });
  },

  setActiveTool: (tool: CanvasTool) => set({ activeTool: tool }),
  toggleGrid: () => set((s) => ({ isGridVisible: !s.isGridVisible })),
  toggleSnapToGrid: () => set((s) => ({ isSnapToGrid: !s.isSnapToGrid })),

  // Selection
  selectNode: (nodeId: string, multi = false) => {
    set((s) => {
      if (multi) {
        const exists = s.selectedNodeIds.includes(nodeId);
        return {
          selectedNodeIds: exists ? s.selectedNodeIds.filter((id) => id !== nodeId) : [...s.selectedNodeIds, nodeId],
        };
      }
      return { selectedNodeIds: [nodeId], selectedEdgeIds: [], selectedGroupIds: [] };
    });
  },

  selectEdge: (edgeId: string, multi = false) => {
    set((s) => {
      if (multi) {
        const exists = s.selectedEdgeIds.includes(edgeId);
        return {
          selectedEdgeIds: exists ? s.selectedEdgeIds.filter((id) => id !== edgeId) : [...s.selectedEdgeIds, edgeId],
        };
      }
      return { selectedEdgeIds: [edgeId], selectedNodeIds: [], selectedGroupIds: [] };
    });
  },

  selectGroup: (groupId: string, multi = false) => {
    set((s) => {
      if (multi) {
        const exists = s.selectedGroupIds.includes(groupId);
        return {
          selectedGroupIds: exists ? s.selectedGroupIds.filter((id) => id !== groupId) : [...s.selectedGroupIds, groupId],
        };
      }
      return { selectedGroupIds: [groupId], selectedNodeIds: [], selectedEdgeIds: [] };
    });
  },

  clearSelection: () => set({ selectedNodeIds: [], selectedEdgeIds: [], selectedGroupIds: [] }),
  selectAll: () => {
    const state = get();
    const graphNodeIds = Object.values(state.nodes)
      .filter((n) => n.graphId === state.activeGraphId)
      .map((n) => n.id);
    set({ selectedNodeIds: graphNodeIds });
  },

  // Node CRUD
  addNode: (nodeData) => {
    const state = get();
    get().pushHistorySnapshot();

    const id = `node-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const typeDef = BUILTIN_NODE_TYPES[nodeData.type] || state.customNodeTypes[nodeData.type];

    const newNode: UPGNode = {
      id,
      projectId: state.activeProjectId,
      graphId: state.activeGraphId,
      type: nodeData.type,
      name: nodeData.name,
      description: nodeData.description || typeDef?.description || '',
      status: nodeData.status || 'planned',
      priority: nodeData.priority || 'medium',
      version: nodeData.version || '1.0.0',
      position: nodeData.position,
      size: nodeData.size || { width: 210, height: 110 },
      groupId: nodeData.groupId,
      properties: nodeData.properties || {},
      tags: nodeData.tags || [],
      owner: nodeData.owner,
      inputs: nodeData.inputs || [],
      outputs: nodeData.outputs || [],
      documentation: nodeData.documentation || '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    set((s) => {
      const activeGraph = s.graphs[s.activeGraphId];
      const updatedGraph = activeGraph
        ? { ...activeGraph, nodeIds: [...activeGraph.nodeIds, id], updatedAt: Date.now() }
        : activeGraph;

      return {
        nodes: { ...s.nodes, [id]: newNode },
        graphs: updatedGraph ? { ...s.graphs, [s.activeGraphId]: updatedGraph } : s.graphs,
        selectedNodeIds: [id],
        selectedEdgeIds: [],
        selectedGroupIds: [],
      };
    });

    get().saveToStorage();

    if (state.projects[state.activeProjectId]?.isCloud) {
      syncEngine.queueChange(state.activeProjectId, 'node', id, 'CREATE', newNode);
    }

    return id;
  },

  updateNode: (nodeId: string, updates: Partial<UPGNode>) => {
    set((s) => {
      const node = s.nodes[nodeId];
      if (!node) return s;
      return {
        nodes: {
          ...s.nodes,
          [nodeId]: { ...node, ...updates, updatedAt: Date.now() },
        },
      };
    });

    get().saveToStorage();

    const state = get();
    const updated = state.nodes[nodeId];
    if (updated && state.projects[state.activeProjectId]?.isCloud) {
      syncEngine.queueChange(state.activeProjectId, 'node', nodeId, 'UPDATE', updated);
    }
  },

  updateNodePosition: (nodeId: string, position: NodePosition) => {
    set((s) => {
      const node = s.nodes[nodeId];
      if (!node) return s;
      return {
        nodes: {
          ...s.nodes,
          [nodeId]: { ...node, position },
        },
      };
    });

    const state = get();
    const updated = state.nodes[nodeId];
    if (updated && state.projects[state.activeProjectId]?.isCloud) {
      syncEngine.queueChange(state.activeProjectId, 'node', nodeId, 'UPDATE', updated, 350);
    }
  },

  updateMultipleNodePositions: (positions: Record<string, NodePosition>) => {
    set((s) => {
      const updatedNodes = { ...s.nodes };
      Object.entries(positions).forEach(([id, pos]) => {
        if (updatedNodes[id]) {
          updatedNodes[id] = { ...updatedNodes[id], position: pos };
        }
      });
      return { nodes: updatedNodes };
    });

    const state = get();
    if (state.projects[state.activeProjectId]?.isCloud) {
      Object.entries(positions).forEach(([id]) => {
        const updated = state.nodes[id];
        if (updated) {
          syncEngine.queueChange(state.activeProjectId, 'node', id, 'UPDATE', updated, 350);
        }
      });
    }
  },

  updateNodeSize: (nodeId: string, size: { width: number; height: number }) => {
    set((s) => {
      const node = s.nodes[nodeId];
      if (!node) return s;
      return {
        nodes: {
          ...s.nodes,
          [nodeId]: { ...node, size: { width: Math.max(160, size.width), height: Math.max(80, size.height) } },
        },
      };
    });

    get().saveToStorage();

    const state = get();
    const updated = state.nodes[nodeId];
    if (updated && state.projects[state.activeProjectId]?.isCloud) {
      syncEngine.queueChange(state.activeProjectId, 'node', nodeId, 'UPDATE', updated, 300);
    }
  },

  deleteNode: (nodeId: string) => {
    const state = get();
    get().pushHistorySnapshot();

    const nodeToDelete = state.nodes[nodeId];
    const newNodes = { ...state.nodes };
    delete newNodes[nodeId];

    // Remove any connected edges
    const newEdges = { ...state.edges };
    const deletedEdgeIds: string[] = [];
    Object.keys(newEdges).forEach((edgeId) => {
      if (newEdges[edgeId].sourceNodeId === nodeId || newEdges[edgeId].targetNodeId === nodeId) {
        deletedEdgeIds.push(edgeId);
        delete newEdges[edgeId];
      }
    });

    // Remove from all groups
    const newGroups = { ...state.groups };
    Object.keys(newGroups).forEach((gId) => {
      if (newGroups[gId].nodeIds.includes(nodeId)) {
        newGroups[gId] = {
          ...newGroups[gId],
          nodeIds: newGroups[gId].nodeIds.filter((id) => id !== nodeId),
        };
      }
    });

    // Remove from active graph and clean sub-graphs if any
    const newGraphs = { ...state.graphs };
    const activeGraph = newGraphs[state.activeGraphId];
    if (activeGraph) {
      newGraphs[state.activeGraphId] = {
        ...activeGraph,
        nodeIds: activeGraph.nodeIds.filter((id) => id !== nodeId),
        edgeIds: activeGraph.edgeIds.filter((id) => newEdges[id] !== undefined),
        updatedAt: Date.now(),
      };
    }

    // Recursive sub-graph cleanup if node encapsulated a subsystem
    if (nodeToDelete?.subGraphId && newGraphs[nodeToDelete.subGraphId]) {
      const subGraph = newGraphs[nodeToDelete.subGraphId];
      subGraph.nodeIds.forEach((childNodeId) => {
        delete newNodes[childNodeId];
      });
      subGraph.edgeIds.forEach((childEdgeId) => {
        delete newEdges[childEdgeId];
      });
      delete newGraphs[nodeToDelete.subGraphId];
    }

    set({
      nodes: newNodes,
      edges: newEdges,
      groups: newGroups,
      graphs: newGraphs,
      selectedNodeIds: state.selectedNodeIds.filter((id) => id !== nodeId),
    });

    get().saveToStorage();

    if (state.projects[state.activeProjectId]?.isCloud) {
      syncEngine.queueChange(state.activeProjectId, 'node', nodeId, 'DELETE');
      deletedEdgeIds.forEach((eId) => {
        syncEngine.queueChange(state.activeProjectId, 'edge', eId, 'DELETE');
      });
    }
  },

  duplicateSelectedNodes: () => {
    const state = get();
    if (state.selectedNodeIds.length === 0) return;

    get().pushHistorySnapshot();

    const newNodes = { ...state.nodes };
    const newlyCreatedIds: string[] = [];

    state.selectedNodeIds.forEach((id) => {
      const src = state.nodes[id];
      if (!src) return;
      const newId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      newNodes[newId] = {
        ...src,
        id: newId,
        name: `${src.name} (Copy)`,
        position: { x: src.position.x + 40, y: src.position.y + 40 },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      newlyCreatedIds.push(newId);
    });

    const activeGraph = state.graphs[state.activeGraphId];
    const newGraphs = { ...state.graphs };
    if (activeGraph) {
      newGraphs[state.activeGraphId] = {
        ...activeGraph,
        nodeIds: [...activeGraph.nodeIds, ...newlyCreatedIds],
      };
    }

    set({
      nodes: newNodes,
      graphs: newGraphs,
      selectedNodeIds: newlyCreatedIds,
    });

    get().saveToStorage();

    if (state.projects[state.activeProjectId]?.isCloud) {
      newlyCreatedIds.forEach((nId) => {
        syncEngine.queueChange(state.activeProjectId, 'node', nId, 'CREATE', newNodes[nId]);
      });
    }
  },

  // Edge & Connection Handling
  startConnection: (sourceNodeId, sourceHandle, x, y) => {
    set({
      pendingConnection: {
        sourceNodeId,
        sourceHandle,
        currentX: x,
        currentY: y,
      },
    });
  },

  updatePendingConnection: (x, y) => {
    set((s) => {
      if (!s.pendingConnection) return s;
      return {
        pendingConnection: { ...s.pendingConnection, currentX: x, currentY: y },
      };
    });
  },

  cancelPendingConnection: () => set({ pendingConnection: null }),

  openRelationshipPicker: (sourceNodeId, targetNodeId, sourceHandle, targetHandle) => {
    set({
      isRelationshipPickerOpen: true,
      relationshipPickerContext: { sourceNodeId, targetNodeId, sourceHandle, targetHandle },
      pendingConnection: null,
    });
  },

  closeRelationshipPicker: () => {
    set({
      isRelationshipPickerOpen: false,
      relationshipPickerContext: null,
    });
  },

  completeConnection: (targetNodeId, targetHandle = 'left', type = 'uses', label) => {
    const state = get();
    if (!state.pendingConnection) return;
    const sourceNodeId = state.pendingConnection.sourceNodeId;
    const sourceHandle = state.pendingConnection.sourceHandle;

    if (sourceNodeId === targetNodeId) {
      set({ pendingConnection: null });
      return;
    }

    get().addEdge(sourceNodeId, targetNodeId, type, label, sourceHandle, targetHandle);
    set({ pendingConnection: null });
  },

  addEdge: (sourceNodeId, targetNodeId, type, label, sourceHandle = 'right', targetHandle = 'left') => {
    const state = get();
    get().pushHistorySnapshot();

    const id = `edge-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const relDef = BUILTIN_RELATIONSHIP_TYPES[type] || state.customRelationshipTypes[type];

    const newEdge: UPGEdge = {
      id,
      projectId: state.activeProjectId,
      graphId: state.activeGraphId,
      sourceNodeId,
      targetNodeId,
      sourceHandle,
      targetHandle,
      type,
      label: label || relDef?.label || type,
      color: relDef?.color || '#0f172a',
      lineStyle: relDef?.lineStyle || 'solid',
      animated: relDef?.animated || false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    set((s) => {
      const activeGraph = s.graphs[s.activeGraphId];
      const updatedGraph = activeGraph
        ? { ...activeGraph, edgeIds: [...activeGraph.edgeIds, id], updatedAt: Date.now() }
        : activeGraph;

      return {
        edges: { ...s.edges, [id]: newEdge },
        graphs: updatedGraph ? { ...s.graphs, [s.activeGraphId]: updatedGraph } : s.graphs,
        selectedEdgeIds: [id],
        selectedNodeIds: [],
        selectedGroupIds: [],
      };
    });

    get().saveToStorage();

    if (state.projects[state.activeProjectId]?.isCloud) {
      syncEngine.queueChange(state.activeProjectId, 'edge', id, 'CREATE', newEdge);
    }

    return id;
  },

  updateEdge: (edgeId: string, updates: Partial<UPGEdge>) => {
    set((s) => {
      const edge = s.edges[edgeId];
      if (!edge) return s;
      return {
        edges: {
          ...s.edges,
          [edgeId]: { ...edge, ...updates, updatedAt: Date.now() },
        },
      };
    });

    get().saveToStorage();

    const state = get();
    const updated = state.edges[edgeId];
    if (updated && state.projects[state.activeProjectId]?.isCloud) {
      syncEngine.queueChange(state.activeProjectId, 'edge', edgeId, 'UPDATE', updated);
    }
  },

  deleteEdge: (edgeId: string) => {
    const state = get();
    get().pushHistorySnapshot();

    const newEdges = { ...state.edges };
    delete newEdges[edgeId];

    const activeGraph = state.graphs[state.activeGraphId];
    const newGraphs = { ...state.graphs };
    if (activeGraph) {
      newGraphs[state.activeGraphId] = {
        ...activeGraph,
        edgeIds: activeGraph.edgeIds.filter((id) => id !== edgeId),
      };
    }

    set({
      edges: newEdges,
      graphs: newGraphs,
      selectedEdgeIds: state.selectedEdgeIds.filter((id) => id !== edgeId),
    });

    get().saveToStorage();

    if (state.projects[state.activeProjectId]?.isCloud) {
      syncEngine.queueChange(state.activeProjectId, 'edge', edgeId, 'DELETE');
    }
  },

  // Groups
  addGroup: (name, nodeIds, color = '#0f172a') => {
    const state = get();
    get().pushHistorySnapshot();

    const id = `group-${Date.now()}`;
    const containedNodes = nodeIds.map((nId) => state.nodes[nId]).filter(Boolean);
    let x = 100,
      y = 100,
      width = 500,
      height = 350;

    if (containedNodes.length > 0) {
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;
      containedNodes.forEach((n) => {
        minX = Math.min(minX, n.position.x);
        minY = Math.min(minY, n.position.y);
        maxX = Math.max(maxX, n.position.x + (n.size?.width || 210));
        maxY = Math.max(maxY, n.position.y + (n.size?.height || 110));
      });
      x = minX - 30;
      y = minY - 50;
      width = maxX - minX + 60;
      height = maxY - minY + 80;
    }

    const newGroup: UPGGroup = {
      id,
      projectId: state.activeProjectId,
      graphId: state.activeGraphId,
      name,
      color,
      position: { x, y },
      size: { width, height },
      nodeIds,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    set((s) => {
      const activeGraph = s.graphs[s.activeGraphId];
      const updatedGraph = activeGraph
        ? { ...activeGraph, groupIds: [...activeGraph.groupIds, id] }
        : activeGraph;

      const updatedNodes = { ...s.nodes };
      nodeIds.forEach((nid) => {
        if (updatedNodes[nid]) {
          updatedNodes[nid] = { ...updatedNodes[nid], groupId: id };
        }
      });

      return {
        groups: { ...s.groups, [id]: newGroup },
        nodes: updatedNodes,
        graphs: updatedGraph ? { ...s.graphs, [s.activeGraphId]: updatedGraph } : s.graphs,
        selectedGroupIds: [id],
      };
    });

    get().saveToStorage();

    if (state.projects[state.activeProjectId]?.isCloud) {
      syncEngine.queueChange(state.activeProjectId, 'group', id, 'CREATE', newGroup);
    }

    return id;
  },

  groupSelectedNodes: (name = 'New Component Group') => {
    const state = get();
    if (state.selectedNodeIds.length < 2) return null;
    return get().addGroup(name, state.selectedNodeIds);
  },

  updateGroup: (groupId: string, updates: Partial<UPGGroup>) => {
    set((s) => {
      const g = s.groups[groupId];
      if (!g) return s;
      return {
        groups: {
          ...s.groups,
          [groupId]: { ...g, ...updates, updatedAt: Date.now() },
        },
      };
    });

    get().saveToStorage();

    const state = get();
    const updated = state.groups[groupId];
    if (updated && state.projects[state.activeProjectId]?.isCloud) {
      syncEngine.queueChange(state.activeProjectId, 'group', groupId, 'UPDATE', updated);
    }
  },

  deleteGroup: (groupId: string) => {
    const state = get();
    get().pushHistorySnapshot();

    const newGroups = { ...state.groups };
    const group = newGroups[groupId];
    delete newGroups[groupId];

    // Remove group reference from nodes
    const updatedNodes = { ...state.nodes };
    if (group) {
      group.nodeIds.forEach((nid) => {
        if (updatedNodes[nid]) {
          updatedNodes[nid] = { ...updatedNodes[nid], groupId: undefined };
        }
      });
    }

    const activeGraph = state.graphs[state.activeGraphId];
    const newGraphs = { ...state.graphs };
    if (activeGraph) {
      newGraphs[state.activeGraphId] = {
        ...activeGraph,
        groupIds: activeGraph.groupIds.filter((id) => id !== groupId),
      };
    }

    set({
      groups: newGroups,
      nodes: updatedNodes,
      graphs: newGraphs,
      selectedGroupIds: state.selectedGroupIds.filter((id) => id !== groupId),
    });

    get().saveToStorage();

    if (state.projects[state.activeProjectId]?.isCloud) {
      syncEngine.queueChange(state.activeProjectId, 'group', groupId, 'DELETE');
    }
  },

  // Documents
  addDocument: (title, content, linkedNodeIds = []) => {
    const state = get();
    const id = `doc-${Date.now()}`;
    const newDoc: UPGDocument = {
      id,
      projectId: state.activeProjectId,
      title,
      content,
      linkedNodeIds,
      tags: ['spec', 'architecture'],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    set((s) => ({
      documents: { ...s.documents, [id]: newDoc },
    }));

    get().saveToStorage();

    if (state.projects[state.activeProjectId]?.isCloud) {
      syncEngine.queueChange(state.activeProjectId, 'document', id, 'CREATE', newDoc);
    }

    return id;
  },

  updateDocument: (docId, updates) => {
    set((s) => {
      const doc = s.documents[docId];
      if (!doc) return s;
      return {
        documents: {
          ...s.documents,
          [docId]: { ...doc, ...updates, updatedAt: Date.now() },
        },
      };
    });

    get().saveToStorage();

    const state = get();
    const updated = state.documents[docId];
    if (updated && state.projects[state.activeProjectId]?.isCloud) {
      syncEngine.queueChange(state.activeProjectId, 'document', docId, 'UPDATE', updated);
    }
  },

  deleteDocument: (docId) => {
    const state = get();
    const docs = { ...state.documents };
    delete docs[docId];

    set({ documents: docs });
    get().saveToStorage();

    if (state.projects[state.activeProjectId]?.isCloud) {
      syncEngine.queueChange(state.activeProjectId, 'document', docId, 'DELETE');
    }
  },

  // Custom Types
  addCustomNodeType: (typeDef) => {
    set((s) => ({
      customNodeTypes: { ...s.customNodeTypes, [typeDef.type]: typeDef },
    }));
    get().saveToStorage();
  },

  addCustomRelationshipType: (relDef) => {
    set((s) => ({
      customRelationshipTypes: { ...s.customRelationshipTypes, [relDef.type]: relDef },
    }));
    get().saveToStorage();
  },

  // UI Panels
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setInspectorOpen: (open) => set({ isInspectorOpen: open }),
  setInspectorTab: (tab) => set({ inspectorTab: tab }),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  setNewProjectModalOpen: (open) => set({ isNewProjectModalOpen: open }),
  setNewNodeModalOpen: (open) => set({ isNewNodeModalOpen: open }),
  setCustomTypeModalOpen: (open) => set({ isCustomTypeModalOpen: open }),
  setExportModalOpen: (open) => set({ isExportModalOpen: open }),
  setStatsModalOpen: (open) => set({ isStatsModalOpen: open }),
  setShortcutsModalOpen: (open) => set({ isShortcutsModalOpen: open }),
  setActiveSidebarTab: (tab) => set({ activeSidebarTab: tab }),

  // History Engine
  pushHistorySnapshot: () => {
    const s = get();
    const snapshot: GraphSnapshot = {
      nodes: JSON.parse(JSON.stringify(s.nodes)),
      edges: JSON.parse(JSON.stringify(s.edges)),
      groups: JSON.parse(JSON.stringify(s.groups)),
      graphs: JSON.parse(JSON.stringify(s.graphs)),
    };

    set((state) => ({
      undoStack: [...state.undoStack.slice(-39), snapshot],
      redoStack: [],
    }));
  },

  undo: () => {
    const s = get();
    if (s.undoStack.length === 0) return;

    const previousSnapshot = s.undoStack[s.undoStack.length - 1];
    const newUndoStack = s.undoStack.slice(0, -1);

    const currentSnapshot: GraphSnapshot = {
      nodes: JSON.parse(JSON.stringify(s.nodes)),
      edges: JSON.parse(JSON.stringify(s.edges)),
      groups: JSON.parse(JSON.stringify(s.groups)),
      graphs: JSON.parse(JSON.stringify(s.graphs)),
    };

    set({
      nodes: previousSnapshot.nodes,
      edges: previousSnapshot.edges,
      groups: previousSnapshot.groups,
      graphs: previousSnapshot.graphs,
      undoStack: newUndoStack,
      redoStack: [...s.redoStack, currentSnapshot],
    });

    get().saveToStorage();
  },

  redo: () => {
    const s = get();
    if (s.redoStack.length === 0) return;

    const nextSnapshot = s.redoStack[s.redoStack.length - 1];
    const newRedoStack = s.redoStack.slice(0, -1);

    const currentSnapshot: GraphSnapshot = {
      nodes: JSON.parse(JSON.stringify(s.nodes)),
      edges: JSON.parse(JSON.stringify(s.edges)),
      groups: JSON.parse(JSON.stringify(s.groups)),
      graphs: JSON.parse(JSON.stringify(s.graphs)),
    };

    set({
      nodes: nextSnapshot.nodes,
      edges: nextSnapshot.edges,
      groups: nextSnapshot.groups,
      graphs: nextSnapshot.graphs,
      undoStack: [...s.undoStack, currentSnapshot],
      redoStack: newRedoStack,
    });

    get().saveToStorage();
  },
}));
