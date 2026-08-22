import { Router, type Response } from 'express';
import { z } from 'zod';
import { pool, query } from '../db/pool';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth';

export const projectsRouter = Router();

// Zod Validation Schemas
const CreateProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100),
  description: z.string().max(1000).optional().default(''),
  domain: z.string().max(100).optional().default('Systems & Software'),
  type: z.string().max(50).optional().default('Architecture Graph'),
  version: z.string().max(20).optional().default('0.1.0'),
  organizationId: z.string().optional(),
});

const UpdateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).optional(),
  domain: z.string().max(100).optional(),
  type: z.string().max(50).optional(),
  version: z.string().max(20).optional(),
  customNodeTypes: z.array(z.any()).optional(),
  customRelationshipTypes: z.array(z.any()).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

const SyncChangesSchema = z.object({
  clientId: z.string().optional(),
  changes: z.array(
    z.object({
      id: z.string(),
      entityType: z.enum(['project', 'graph', 'node', 'edge', 'group', 'document', 'view']),
      entityId: z.string(),
      operation: z.enum(['CREATE', 'UPDATE', 'DELETE']),
      payload: z.any().optional(),
      timestamp: z.number().optional(),
    })
  ),
});

// 1. GET /api/projects — List user's cloud projects
projectsRouter.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const result = await query(
      `SELECT id, name, description, domain, type, version, root_graph_id as "rootGraphId", 
              organization_id as "organizationId", created_at as "createdAt", updated_at as "updatedAt"
       FROM projects 
       WHERE owner_id = $1
       ORDER BY updated_at DESC`,
      [userId]
    );

    res.json({ projects: result.rows });
  } catch (error) {
    console.error('Failed to list projects:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to retrieve projects.' });
  }
});

// 2. POST /api/projects — Create a new empty cloud project
projectsRouter.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const client = await pool.connect();
  try {
    const parsed = CreateProjectSchema.parse(req.body);
    const userId = req.user!.id;

    const projectId = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const rootGraphId = `graph-root-${Date.now()}`;

    await client.query('BEGIN');

    // 1. Insert Project
    await client.query(
      `INSERT INTO projects (id, owner_id, organization_id, name, description, domain, type, version, root_graph_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
      [
        projectId,
        userId,
        parsed.organizationId || null,
        parsed.name,
        parsed.description,
        parsed.domain,
        parsed.type,
        parsed.version,
        rootGraphId,
      ]
    );

    // 2. Insert Root Graph
    await client.query(
      `INSERT INTO graphs (id, project_id, name, description, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      [rootGraphId, projectId, `${parsed.name} Root Graph`, 'Root system architectural topology']
    );

    await client.query('COMMIT');

    res.status(201).json({
      project: {
        id: projectId,
        name: parsed.name,
        description: parsed.description,
        domain: parsed.domain,
        type: parsed.type,
        version: parsed.version,
        rootGraphId,
        ownerId: userId,
        isCloud: true,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.issues });
      return;
    }
    console.error('Failed to create project:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create project.' });
  } finally {
    client.release();
  }
});

// 3. POST /api/projects/upload-local — Safe upload of a local project into cloud storage
projectsRouter.post('/upload-local', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const client = await pool.connect();
  try {
    const userId = req.user!.id;
    const { project, graphs, nodes, edges, groups, documents } = req.body;

    if (!project || !project.id || !project.name) {
      res.status(400).json({ error: 'Bad Request', message: 'Valid project object is required.' });
      return;
    }

    const projectId = project.id;
    const rootGraphId = project.rootGraphId || Object.keys(graphs || {})[0] || `graph-root-${Date.now()}`;

    await client.query('BEGIN');

    // Insert or update project with verified owner
    await client.query(
      `INSERT INTO projects (id, owner_id, name, description, domain, type, version, root_graph_id, custom_node_types, custom_relationship_types, metadata, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
       ON CONFLICT (id) DO UPDATE SET 
         name = EXCLUDED.name,
         description = EXCLUDED.description,
         domain = EXCLUDED.domain,
         type = EXCLUDED.type,
         version = EXCLUDED.version,
         root_graph_id = EXCLUDED.root_graph_id,
         custom_node_types = EXCLUDED.custom_node_types,
         custom_relationship_types = EXCLUDED.custom_relationship_types,
         metadata = EXCLUDED.metadata,
         updated_at = NOW()
       WHERE projects.owner_id = $2`,
      [
        projectId,
        userId,
        project.name,
        project.description || '',
        project.domain || 'Systems & Software',
        project.type || 'Architecture Graph',
        project.version || '0.1.0',
        rootGraphId,
        JSON.stringify(project.customNodeTypes || []),
        JSON.stringify(project.customRelationshipTypes || []),
        JSON.stringify(project.metadata || {}),
      ]
    );

    // Clean existing entities for this project to ensure clean sync
    await client.query(`DELETE FROM edges WHERE project_id = $1`, [projectId]);
    await client.query(`DELETE FROM groups WHERE project_id = $1`, [projectId]);
    await client.query(`DELETE FROM nodes WHERE project_id = $1`, [projectId]);
    await client.query(`DELETE FROM graphs WHERE project_id = $1`, [projectId]);
    await client.query(`DELETE FROM documents WHERE project_id = $1`, [projectId]);

    // Insert Graphs
    if (graphs && typeof graphs === 'object') {
      for (const g of Object.values(graphs) as any[]) {
        await client.query(
          `INSERT INTO graphs (id, project_id, parent_node_id, parent_graph_id, name, description, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
          [g.id, projectId, g.parentNodeId || null, g.parentGraphId || null, g.name || 'Graph', g.description || '']
        );
      }
    }

    // Insert Nodes
    if (nodes && typeof nodes === 'object') {
      for (const n of Object.values(nodes) as any[]) {
        await client.query(
          `INSERT INTO nodes (
             id, project_id, graph_id, sub_graph_id, group_id, type, name, description, 
             status, priority, version, position_x, position_y, size_width, size_height, 
             properties, tags, owner, inputs, outputs, documentation, created_at, updated_at
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, NOW(), NOW())`,
          [
            n.id,
            projectId,
            n.graphId,
            n.subGraphId || null,
            n.groupId || null,
            n.type || 'custom',
            n.name || 'Node',
            n.description || '',
            n.status || 'planned',
            n.priority || 'medium',
            n.version || '1.0.0',
            n.position?.x || 0,
            n.position?.y || 0,
            n.size?.width || 240,
            n.size?.height || 100,
            JSON.stringify(n.properties || {}),
            JSON.stringify(n.tags || []),
            n.owner || null,
            JSON.stringify(n.inputs || []),
            JSON.stringify(n.outputs || []),
            n.documentation || '',
          ]
        );
      }
    }

    // Insert Edges
    if (edges && typeof edges === 'object') {
      for (const e of Object.values(edges) as any[]) {
        await client.query(
          `INSERT INTO edges (
             id, project_id, graph_id, source_node_id, target_node_id, source_handle, target_handle, 
             type, label, color, line_style, animated, created_at, updated_at
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())`,
          [
            e.id,
            projectId,
            e.graphId,
            e.sourceNodeId,
            e.targetNodeId,
            e.sourceHandle || 'right',
            e.targetHandle || 'left',
            e.type || 'uses',
            e.label || '',
            e.color || '#0f172a',
            e.lineStyle || 'solid',
            e.animated || false,
          ]
        );
      }
    }

    // Insert Groups
    if (groups && typeof groups === 'object') {
      for (const grp of Object.values(groups) as any[]) {
        await client.query(
          `INSERT INTO groups (
             id, project_id, graph_id, name, description, category, color, position_x, position_y, size_width, size_height, is_collapsed, node_ids, created_at, updated_at
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())`,
          [
            grp.id,
            projectId,
            grp.graphId,
            grp.name || 'Group',
            grp.description || '',
            grp.category || 'architecture',
            grp.color || '#0f172a',
            grp.position?.x || 0,
            grp.position?.y || 0,
            grp.size?.width || 500,
            grp.size?.height || 350,
            grp.isCollapsed || false,
            JSON.stringify(grp.nodeIds || []),
          ]
        );
      }
    }

    // Insert Documents
    if (documents && typeof documents === 'object') {
      for (const doc of Object.values(documents) as any[]) {
        await client.query(
          `INSERT INTO documents (id, project_id, title, content, tags, linked_node_ids, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
          [
            doc.id,
            projectId,
            doc.title || 'Untitled Document',
            doc.content || '',
            JSON.stringify(doc.tags || []),
            JSON.stringify(doc.linkedNodeIds || []),
          ]
        );
      }
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Local project successfully uploaded to Supabase PostgreSQL.',
      project: {
        id: projectId,
        ownerId: userId,
        isCloud: true,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to upload local project:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to upload project.' });
  } finally {
    client.release();
  }
});

// 4. POST /api/projects/:id/sync-changes — Incremental batch changes synchronization
projectsRouter.post('/:id/sync-changes', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const client = await pool.connect();
  try {
    const projectId = req.params.id as string;
    const userId = req.user!.id;
    const parsed = SyncChangesSchema.parse(req.body);

    // Verify ownership
    const projCheck = await client.query(`SELECT id FROM projects WHERE id = $1 AND owner_id = $2`, [projectId, userId]);
    if (projCheck.rows.length === 0) {
      res.status(404).json({ error: 'Not Found', message: 'Project not found or access denied.' });
      return;
    }

    await client.query('BEGIN');
    const syncedIds: string[] = [];

    for (const change of parsed.changes) {
      const { id: changeId, entityType, entityId, operation, payload } = change;

      if (operation === 'DELETE') {
        if (entityType === 'node') {
          await client.query(`DELETE FROM nodes WHERE id = $1 AND project_id = $2`, [entityId, projectId]);
        } else if (entityType === 'edge') {
          await client.query(`DELETE FROM edges WHERE id = $1 AND project_id = $2`, [entityId, projectId]);
        } else if (entityType === 'group') {
          await client.query(`DELETE FROM groups WHERE id = $1 AND project_id = $2`, [entityId, projectId]);
        } else if (entityType === 'document') {
          await client.query(`DELETE FROM documents WHERE id = $1 AND project_id = $2`, [entityId, projectId]);
        } else if (entityType === 'graph') {
          await client.query(`DELETE FROM graphs WHERE id = $1 AND project_id = $2`, [entityId, projectId]);
        }
        syncedIds.push(changeId);
        continue;
      }

      // CREATE or UPDATE (Upsert)
      if (entityType === 'node' && payload) {
        await client.query(
          `INSERT INTO nodes (
             id, project_id, graph_id, sub_graph_id, group_id, type, name, description, 
             status, priority, version, position_x, position_y, size_width, size_height, 
             properties, tags, owner, inputs, outputs, documentation, updated_at
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, NOW())
           ON CONFLICT (id) DO UPDATE SET
             graph_id = EXCLUDED.graph_id,
             sub_graph_id = EXCLUDED.sub_graph_id,
             group_id = EXCLUDED.group_id,
             type = EXCLUDED.type,
             name = EXCLUDED.name,
             description = EXCLUDED.description,
             status = EXCLUDED.status,
             priority = EXCLUDED.priority,
             version = EXCLUDED.version,
             position_x = EXCLUDED.position_x,
             position_y = EXCLUDED.position_y,
             size_width = EXCLUDED.size_width,
             size_height = EXCLUDED.size_height,
             properties = EXCLUDED.properties,
             tags = EXCLUDED.tags,
             owner = EXCLUDED.owner,
             inputs = EXCLUDED.inputs,
             outputs = EXCLUDED.outputs,
             documentation = EXCLUDED.documentation,
             updated_at = NOW()`,
          [
            entityId,
            projectId,
            payload.graphId,
            payload.subGraphId || null,
            payload.groupId || null,
            payload.type || 'custom',
            payload.name || 'Node',
            payload.description || '',
            payload.status || 'planned',
            payload.priority || 'medium',
            payload.version || '1.0.0',
            payload.position?.x || 0,
            payload.position?.y || 0,
            payload.size?.width || 240,
            payload.size?.height || 100,
            JSON.stringify(payload.properties || {}),
            JSON.stringify(payload.tags || []),
            payload.owner || null,
            JSON.stringify(payload.inputs || []),
            JSON.stringify(payload.outputs || []),
            payload.documentation || '',
          ]
        );
        syncedIds.push(changeId);
      } else if (entityType === 'edge' && payload) {
        await client.query(
          `INSERT INTO edges (
             id, project_id, graph_id, source_node_id, target_node_id, source_handle, target_handle, 
             type, label, color, line_style, animated, updated_at
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
           ON CONFLICT (id) DO UPDATE SET
             graph_id = EXCLUDED.graph_id,
             source_node_id = EXCLUDED.source_node_id,
             target_node_id = EXCLUDED.target_node_id,
             source_handle = EXCLUDED.source_handle,
             target_handle = EXCLUDED.target_handle,
             type = EXCLUDED.type,
             label = EXCLUDED.label,
             color = EXCLUDED.color,
             line_style = EXCLUDED.line_style,
             animated = EXCLUDED.animated,
             updated_at = NOW()`,
          [
            entityId,
            projectId,
            payload.graphId,
            payload.sourceNodeId,
            payload.targetNodeId,
            payload.sourceHandle || 'right',
            payload.targetHandle || 'left',
            payload.type || 'uses',
            payload.label || '',
            payload.color || '#0f172a',
            payload.lineStyle || 'solid',
            payload.animated || false,
          ]
        );
        syncedIds.push(changeId);
      } else if (entityType === 'group' && payload) {
        await client.query(
          `INSERT INTO groups (
             id, project_id, graph_id, name, description, category, color, position_x, position_y, size_width, size_height, is_collapsed, node_ids, updated_at
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
           ON CONFLICT (id) DO UPDATE SET
             graph_id = EXCLUDED.graph_id,
             name = EXCLUDED.name,
             description = EXCLUDED.description,
             category = EXCLUDED.category,
             color = EXCLUDED.color,
             position_x = EXCLUDED.position_x,
             position_y = EXCLUDED.position_y,
             size_width = EXCLUDED.size_width,
             size_height = EXCLUDED.size_height,
             is_collapsed = EXCLUDED.is_collapsed,
             node_ids = EXCLUDED.node_ids,
             updated_at = NOW()`,
          [
            entityId,
            projectId,
            payload.graphId,
            payload.name || 'Group',
            payload.description || '',
            payload.category || 'architecture',
            payload.color || '#0f172a',
            payload.position?.x || 0,
            payload.position?.y || 0,
            payload.size?.width || 500,
            payload.size?.height || 350,
            payload.isCollapsed || false,
            JSON.stringify(payload.nodeIds || []),
          ]
        );
        syncedIds.push(changeId);
      } else if (entityType === 'document' && payload) {
        await client.query(
          `INSERT INTO documents (id, project_id, title, content, tags, linked_node_ids, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW())
           ON CONFLICT (id) DO UPDATE SET
             title = EXCLUDED.title,
             content = EXCLUDED.content,
             tags = EXCLUDED.tags,
             linked_node_ids = EXCLUDED.linked_node_ids,
             updated_at = NOW()`,
          [
            entityId,
            projectId,
            payload.title || 'Untitled Document',
            payload.content || '',
            JSON.stringify(payload.tags || []),
            JSON.stringify(payload.linkedNodeIds || []),
          ]
        );
        syncedIds.push(changeId);
      } else if (entityType === 'graph' && payload) {
        await client.query(
          `INSERT INTO graphs (id, project_id, parent_node_id, parent_graph_id, name, description, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW())
           ON CONFLICT (id) DO UPDATE SET
             parent_node_id = EXCLUDED.parent_node_id,
             parent_graph_id = EXCLUDED.parent_graph_id,
             name = EXCLUDED.name,
             description = EXCLUDED.description,
             updated_at = NOW()`,
          [entityId, projectId, payload.parentNodeId || null, payload.parentGraphId || null, payload.name || 'Graph', payload.description || '']
        );
        syncedIds.push(changeId);
      } else if (entityType === 'project' && payload) {
        await client.query(
          `UPDATE projects 
           SET name = COALESCE($1, name), 
               description = COALESCE($2, description), 
               domain = COALESCE($3, domain), 
               version = COALESCE($4, version), 
               updated_at = NOW()
           WHERE id = $5 AND owner_id = $6`,
          [payload.name, payload.description, payload.domain, payload.version, projectId, userId]
        );
        syncedIds.push(changeId);
      }
    }

    // Update project updated_at timestamp
    await client.query(`UPDATE projects SET updated_at = NOW() WHERE id = $1`, [projectId]);
    await client.query('COMMIT');

    res.json({
      success: true,
      syncedIds,
      serverTimestamp: Date.now(),
    });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.issues });
      return;
    }
    console.error('Failed to sync changes:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to process sync changes.' });
  } finally {
    client.release();
  }
});

// 5. GET /api/projects/:id — Get a single project
projectsRouter.get('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const projectId = req.params.id as string;
    const userId = req.user!.id;

    const result = await query(
      `SELECT id, name, description, domain, type, version, root_graph_id as "rootGraphId", 
              custom_node_types as "customNodeTypes", custom_relationship_types as "customRelationshipTypes",
              metadata, created_at as "createdAt", updated_at as "updatedAt"
       FROM projects 
       WHERE id = $1 AND owner_id = $2`,
      [projectId, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Not Found', message: 'Project not found or access denied.' });
      return;
    }

    res.json({ project: result.rows[0] });
  } catch (error) {
    console.error('Failed to get project:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch project.' });
  }
});

// 6. PUT /api/projects/:id — Update project metadata
projectsRouter.put('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const projectId = req.params.id as string;
    const userId = req.user!.id;
    const parsed = UpdateProjectSchema.parse(req.body);

    const result = await query(
      `UPDATE projects 
       SET name = COALESCE($1, name), 
           description = COALESCE($2, description), 
           domain = COALESCE($3, domain), 
           type = COALESCE($4, type), 
           version = COALESCE($5, version), 
           updated_at = NOW()
       WHERE id = $6 AND owner_id = $7
       RETURNING id, name, description, domain, type, version, updated_at as "updatedAt"`,
      [parsed.name, parsed.description, parsed.domain, parsed.type, parsed.version, projectId, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Not Found', message: 'Project not found or unauthorized.' });
      return;
    }

    res.json({ project: result.rows[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.issues });
      return;
    }
    console.error('Failed to update project:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update project.' });
  }
});

// 7. GET /api/projects/:id/bundle — Load full architecture graph bundle
projectsRouter.get('/:id/bundle', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const projectId = req.params.id as string;
    const userId = req.user!.id;

    // Verify ownership
    const projResult = await query(
      `SELECT * FROM projects WHERE id = $1 AND owner_id = $2`,
      [projectId, userId]
    );

    if (projResult.rows.length === 0) {
      res.status(404).json({ error: 'Not Found', message: 'Project not found or access denied.' });
      return;
    }

    const project = projResult.rows[0];

    // Fetch all related entities in parallel
    const [graphsRes, nodesRes, edgesRes, groupsRes, viewsRes, docsRes] = await Promise.all([
      query(`SELECT * FROM graphs WHERE project_id = $1`, [projectId]),
      query(`SELECT * FROM nodes WHERE project_id = $1`, [projectId]),
      query(`SELECT * FROM edges WHERE project_id = $1`, [projectId]),
      query(`SELECT * FROM groups WHERE project_id = $1`, [projectId]),
      query(`SELECT * FROM views WHERE project_id = $1`, [projectId]),
      query(`SELECT * FROM documents WHERE project_id = $1`, [projectId]),
    ]);

    // Format for HUPA client store
    const graphsMap: Record<string, any> = {};
    graphsRes.rows.forEach((g) => {
      graphsMap[g.id] = {
        id: g.id,
        projectId: g.project_id,
        parentNodeId: g.parent_node_id,
        parentGraphId: g.parent_graph_id,
        name: g.name,
        description: g.description,
        nodeIds: [],
        edgeIds: [],
        groupIds: [],
        createdAt: new Date(g.created_at).getTime(),
        updatedAt: new Date(g.updated_at).getTime(),
      };
    });

    const nodesMap: Record<string, any> = {};
    nodesRes.rows.forEach((n) => {
      nodesMap[n.id] = {
        id: n.id,
        projectId: n.project_id,
        graphId: n.graph_id,
        subGraphId: n.sub_graph_id,
        groupId: n.group_id,
        type: n.type,
        name: n.name,
        description: n.description,
        status: n.status,
        priority: n.priority,
        version: n.version,
        position: { x: Number(n.position_x), y: Number(n.position_y) },
        size: { width: Number(n.size_width), height: Number(n.size_height) },
        properties: n.properties || {},
        tags: n.tags || [],
        owner: n.owner,
        inputs: n.inputs || [],
        outputs: n.outputs || [],
        documentation: n.documentation,
        createdAt: new Date(n.created_at).getTime(),
        updatedAt: new Date(n.updated_at).getTime(),
      };
      if (graphsMap[n.graph_id]) {
        graphsMap[n.graph_id].nodeIds.push(n.id);
      }
    });

    const edgesMap: Record<string, any> = {};
    edgesRes.rows.forEach((e) => {
      edgesMap[e.id] = {
        id: e.id,
        projectId: e.project_id,
        graphId: e.graph_id,
        sourceNodeId: e.source_node_id,
        targetNodeId: e.target_node_id,
        sourceHandle: e.source_handle,
        targetHandle: e.target_handle,
        type: e.type,
        label: e.label,
        color: e.color,
        lineStyle: e.line_style,
        animated: e.animated,
        createdAt: new Date(e.created_at).getTime(),
        updatedAt: new Date(e.updated_at).getTime(),
      };
      if (graphsMap[e.graph_id]) {
        graphsMap[e.graph_id].edgeIds.push(e.id);
      }
    });

    const groupsMap: Record<string, any> = {};
    groupsRes.rows.forEach((grp) => {
      groupsMap[grp.id] = {
        id: grp.id,
        projectId: grp.project_id,
        graphId: grp.graph_id,
        name: grp.name,
        description: grp.description,
        category: grp.category,
        color: grp.color,
        position: { x: Number(grp.position_x), y: Number(grp.position_y) },
        size: { width: Number(grp.size_width), height: Number(grp.size_height) },
        isCollapsed: grp.is_collapsed,
        nodeIds: grp.node_ids || [],
        createdAt: new Date(grp.created_at).getTime(),
        updatedAt: new Date(grp.updated_at).getTime(),
      };
      if (graphsMap[grp.graph_id]) {
        graphsMap[grp.graph_id].groupIds.push(grp.id);
      }
    });

    const documentsMap: Record<string, any> = {};
    docsRes.rows.forEach((doc) => {
      documentsMap[doc.id] = {
        id: doc.id,
        projectId: doc.project_id,
        title: doc.title,
        content: doc.content,
        tags: doc.tags || [],
        linkedNodeIds: doc.linked_node_ids || [],
        createdAt: new Date(doc.created_at).getTime(),
        updatedAt: new Date(doc.updated_at).getTime(),
      };
    });

    res.json({
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        domain: project.domain,
        type: project.type,
        version: project.version,
        rootGraphId: project.root_graph_id,
        createdAt: new Date(project.created_at).getTime(),
        updatedAt: new Date(project.updated_at).getTime(),
        isCloud: true,
      },
      graphs: graphsMap,
      nodes: nodesMap,
      edges: edgesMap,
      groups: groupsMap,
      views: viewsRes.rows,
      documents: documentsMap,
    });
  } catch (error) {
    console.error('Failed to load project bundle:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to load project bundle.' });
  }
});

// 8. POST /api/projects/:id/save-snapshot — Save / Sync full project graph bundle
projectsRouter.post('/:id/save-snapshot', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const client = await pool.connect();
  try {
    const projectId = req.params.id as string;
    const userId = req.user!.id;
    const { project, graphs, nodes, edges, groups, documents } = req.body;

    // Verify ownership
    const projCheck = await client.query(`SELECT id FROM projects WHERE id = $1 AND owner_id = $2`, [projectId, userId]);
    if (projCheck.rows.length === 0) {
      res.status(404).json({ error: 'Not Found', message: 'Project not found or access denied.' });
      return;
    }

    await client.query('BEGIN');

    // 1. Update Project Metadata
    if (project) {
      await client.query(
        `UPDATE projects 
         SET name = COALESCE($1, name), 
             description = COALESCE($2, description), 
             domain = COALESCE($3, domain), 
             version = COALESCE($4, version), 
             updated_at = NOW()
         WHERE id = $5 AND owner_id = $6`,
        [project.name, project.description, project.domain, project.version, projectId, userId]
      );
    }

    // 2. Clean and replace graph entities in atomic transaction
    await client.query(`DELETE FROM edges WHERE project_id = $1`, [projectId]);
    await client.query(`DELETE FROM groups WHERE project_id = $1`, [projectId]);
    await client.query(`DELETE FROM nodes WHERE project_id = $1`, [projectId]);
    await client.query(`DELETE FROM graphs WHERE project_id = $1`, [projectId]);
    await client.query(`DELETE FROM documents WHERE project_id = $1`, [projectId]);

    // Insert Graphs
    if (graphs && typeof graphs === 'object') {
      for (const g of Object.values(graphs) as any[]) {
        await client.query(
          `INSERT INTO graphs (id, project_id, parent_node_id, parent_graph_id, name, description, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
          [g.id, projectId, g.parentNodeId || null, g.parentGraphId || null, g.name || 'Graph', g.description || '']
        );
      }
    }

    // Insert Nodes
    if (nodes && typeof nodes === 'object') {
      for (const n of Object.values(nodes) as any[]) {
        await client.query(
          `INSERT INTO nodes (
             id, project_id, graph_id, sub_graph_id, group_id, type, name, description, 
             status, priority, version, position_x, position_y, size_width, size_height, 
             properties, tags, owner, inputs, outputs, documentation, created_at, updated_at
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, NOW(), NOW())`,
          [
            n.id,
            projectId,
            n.graphId,
            n.subGraphId || null,
            n.groupId || null,
            n.type || 'custom',
            n.name || 'Node',
            n.description || '',
            n.status || 'planned',
            n.priority || 'medium',
            n.version || '1.0.0',
            n.position?.x || 0,
            n.position?.y || 0,
            n.size?.width || 240,
            n.size?.height || 100,
            JSON.stringify(n.properties || {}),
            JSON.stringify(n.tags || []),
            n.owner || null,
            JSON.stringify(n.inputs || []),
            JSON.stringify(n.outputs || []),
            n.documentation || '',
          ]
        );
      }
    }

    // Insert Edges
    if (edges && typeof edges === 'object') {
      for (const e of Object.values(edges) as any[]) {
        await client.query(
          `INSERT INTO edges (
             id, project_id, graph_id, source_node_id, target_node_id, source_handle, target_handle, 
             type, label, color, line_style, animated, created_at, updated_at
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())`,
          [
            e.id,
            projectId,
            e.graphId,
            e.sourceNodeId,
            e.targetNodeId,
            e.sourceHandle || 'right',
            e.targetHandle || 'left',
            e.type || 'uses',
            e.label || '',
            e.color || '#0f172a',
            e.lineStyle || 'solid',
            e.animated || false,
          ]
        );
      }
    }

    // Insert Groups
    if (groups && typeof groups === 'object') {
      for (const grp of Object.values(groups) as any[]) {
        await client.query(
          `INSERT INTO groups (
             id, project_id, graph_id, name, description, category, color, position_x, position_y, size_width, size_height, is_collapsed, node_ids, created_at, updated_at
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())`,
          [
            grp.id,
            projectId,
            grp.graphId,
            grp.name || 'Group',
            grp.description || '',
            grp.category || 'architecture',
            grp.color || '#0f172a',
            grp.position?.x || 0,
            grp.position?.y || 0,
            grp.size?.width || 500,
            grp.size?.height || 350,
            grp.isCollapsed || false,
            JSON.stringify(grp.nodeIds || []),
          ]
        );
      }
    }

    // Insert Documents
    if (documents && typeof documents === 'object') {
      for (const doc of Object.values(documents) as any[]) {
        await client.query(
          `INSERT INTO documents (id, project_id, title, content, tags, linked_node_ids, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
          [
            doc.id,
            projectId,
            doc.title || 'Untitled Document',
            doc.content || '',
            JSON.stringify(doc.tags || []),
            JSON.stringify(doc.linkedNodeIds || []),
          ]
        );
      }
    }

    await client.query('COMMIT');
    res.json({ success: true, message: 'Project snapshot successfully synchronized to Supabase PostgreSQL.' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to save project snapshot:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to synchronize project snapshot.' });
  } finally {
    client.release();
  }
});

// 9. DELETE /api/projects/:id — Delete a project
projectsRouter.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const projectId = req.params.id as string;
    const userId = req.user!.id;

    const result = await query(
      `DELETE FROM projects WHERE id = $1 AND owner_id = $2 RETURNING id`,
      [projectId, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Not Found', message: 'Project not found or unauthorized.' });
      return;
    }

    res.json({ success: true, message: 'Project successfully deleted.' });
  } catch (error) {
    console.error('Failed to delete project:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to delete project.' });
  }
});
