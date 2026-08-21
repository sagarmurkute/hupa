import type { UPGNode, UPGEdge, UPGGroup, UPGGraph, GraphStats } from '../types/graph';

export function analyzeGraph(
  nodes: Record<string, UPGNode>,
  edges: Record<string, UPGEdge>,
  groups: Record<string, UPGGroup>,
  graphs: Record<string, UPGGraph>,
  activeGraphId: string
): GraphStats {
  const currentNodes = Object.values(nodes).filter((n) => n.graphId === activeGraphId);
  const currentEdges = Object.values(edges).filter((e) => e.graphId === activeGraphId);
  const currentGroups = Object.values(groups).filter((g) => g.graphId === activeGraphId);

  const nodeCount = currentNodes.length;
  const edgeCount = currentEdges.length;
  const groupCount = currentGroups.length;
  const graphCount = Object.keys(graphs).length;

  // Build adjacency
  const adj: Record<string, string[]> = {};
  const inDegree: Record<string, number> = {};
  const outDegree: Record<string, number> = {};

  currentNodes.forEach((n) => {
    adj[n.id] = [];
    inDegree[n.id] = 0;
    outDegree[n.id] = 0;
  });

  currentEdges.forEach((e) => {
    if (adj[e.sourceNodeId]) adj[e.sourceNodeId].push(e.targetNodeId);
    if (outDegree[e.sourceNodeId] !== undefined) outDegree[e.sourceNodeId]++;
    if (inDegree[e.targetNodeId] !== undefined) inDegree[e.targetNodeId]++;
  });

  // Orphan nodes: no in-degree and no out-degree
  const orphanCount = currentNodes.filter(
    (n) => (inDegree[n.id] || 0) === 0 && (outDegree[n.id] || 0) === 0
  ).length;

  // Unresolved items: tasks or bugs or blocked nodes
  const unresolvedCount = currentNodes.filter(
    (n) => n.status === 'blocked' || n.type === 'bug' || (n.type === 'task' && n.status !== 'completed')
  ).length;

  // Dependencies count
  const dependenciesCount = currentEdges.filter(
    (e) => e.type === 'depends-on' || e.type === 'blocks' || e.type === 'imports'
  ).length;

  // Circular dependency detection via DFS
  const cycles: string[][] = [];
  const visited: Record<string, number> = {}; // 0 = unvisited, 1 = visiting, 2 = visited
  const path: string[] = [];

  const dfs = (u: string) => {
    visited[u] = 1;
    path.push(u);

    for (const v of adj[u] || []) {
      if (visited[v] === 1) {
        // Found cycle
        const cycleStartIndex = path.indexOf(v);
        if (cycleStartIndex >= 0) {
          cycles.push([...path.slice(cycleStartIndex), v]);
        }
      } else if (visited[v] === 0 || visited[v] === undefined) {
        dfs(v);
      }
    }

    path.pop();
    visited[u] = 2;
  };

  currentNodes.forEach((n) => {
    if (!visited[n.id]) {
      dfs(n.id);
    }
  });

  const avgConnectivity = nodeCount > 0 ? Number(((edgeCount * 2) / nodeCount).toFixed(2)) : 0;

  return {
    totalNodes: nodeCount,
    totalEdges: edgeCount,
    totalGroups: groupCount,
    totalGraphs: graphCount,
    dependenciesCount,
    unresolvedCount,
    orphanCount,
    circularDependencyCycles: cycles.slice(0, 5), // top 5
    avgConnectivity,
  };
}
