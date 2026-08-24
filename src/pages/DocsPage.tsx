import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { Search, ArrowLeft, ArrowRight, FileText, Terminal, Layers, Database, HardDrive, Monitor } from 'lucide-react';
import { useSmoothScroll } from '../components/landing/useScrollReveal';
import '../styles/landing.css';

interface DocsPageProps {
  onNavigate: (route: string) => void;
  initialDoc?: string;
}

interface DocArticle {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  content: {
    summary: string;
    sections: Array<{
      heading: string;
      text: string;
      code?: string;
      table?: Array<{ col1: string; col2: string; col3: string }>;
    }>;
  };
}

const DOCS_DATA: DocArticle[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    category: 'QUICK START',
    icon: <Terminal size={15} />,
    content: {
      summary: 'Step-by-step guide to cloning, configuring, and launching HUPA locally in web or desktop mode.',
      sections: [
        {
          heading: '1. System Requirements',
          text: 'HUPA runs on modern operating systems including Windows 10/11, macOS 12+, and Linux distributions. Ensure Node.js v20+ and npm v10+ are installed.',
          code: `# Verify installed runtimes
node -v # >= v20.0.0
npm -v  # >= v10.0.0`,
        },
        {
          heading: '2. Clone & Install',
          text: 'Clone the official GitHub repository and install root workspace dependencies.',
          code: `git clone https://github.com/sagarmurkute/hupa.git
cd hupa
npm install`,
        },
        {
          heading: '3. Configure Environment Variables',
          text: 'Copy the sample environment configuration and configure your PostgreSQL database credentials and Better Auth secret.',
          code: `cp .env.example .env

# Configure .env:
NODE_ENV=development
PORT=3001
APP_URL=http://localhost:5173
BETTER_AUTH_SECRET=your-secure-32-char-random-secret
DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres`,
        },
        {
          heading: '4. Start Development',
          text: 'Launch the development server. For the Web application, run npm run dev. For Windows Desktop Electron development, run npm run dev:desktop.',
          code: `# Launch Web App (Client: 5173, Server: 3001)
npm run dev

# Launch Windows Electron Desktop App
npm run dev:desktop`,
        },
      ],
    },
  },
  {
    id: 'architecture',
    title: 'System Architecture',
    category: 'CORE SPECIFICATIONS',
    icon: <Layers size={15} />,
    content: {
      summary: 'Detailed breakdown of the Local-First Shared-Core architecture, client-server topology, and sync protocols.',
      sections: [
        {
          heading: 'Architectural Principles',
          text: 'HUPA is engineered around a Local-First, Shared-Core architecture. In-memory spatial canvas interactions render at 60fps with 0ms latency directly against IndexedDB, while mutations are batched asynchronously to Supabase PostgreSQL.',
        },
        {
          heading: 'Component Topology',
          text: 'The client runtime consists of the React 19 canvas powered by Zustand in-memory state. An autonomous background SyncEngine captures mutations with 350ms debouncing and sends atomic JSON payloads to the Express 5 backend with Better Auth session validation.',
          code: `+-------------------------------------------------------------------------+
|                               HUPA CLIENT                               |
|                                                                         |
|  [ React Graph Canvas ] <---> [ Zustand Graph Store (In-Memory State) ] |
|                                       │                                 |
|                      ┌────────────────┴────────────────┐                |
|                      ▼                                 ▼                |
|            [ IndexedDB Layer ]               [ Sync Engine & Queue ]    |
|         - projects   - nodes               - Change Queue (IndexedDB)   |
|         - graphs     - edges               - Debounce Worker            |
|         - groups     - documents           - Offline Detector           |
|         - views      - tombstones          - Backoff Retry Worker       |
+────────────────────────────────────────────────────────┬────────────────+
                                                         │
                                                  (Authenticated)
                                                HTTP Sync API / JSON
                                                         │
                                                         ▼
+-------------------------------------------------------------------------+
|                        HUPA BACKEND (Express 5)                         |
|                                                                         |
|  [ Better Auth Session Middleware ] ---> [ /api/projects Router ]       |
|                                                  │                      |
|                                                  ▼                      |
|                         [ Supabase PostgreSQL Database ]                |
|               (projects, graphs, nodes, edges, groups, documents)       |
+-------------------------------------------------------------------------+`,
        },
      ],
    },
  },
  {
    id: 'graph-data-model',
    title: 'Graph Data Model',
    category: 'SCHEMAS & TYPES',
    icon: <FileText size={15} />,
    content: {
      summary: 'Data models for projects, subsystem graphs, nodes, edges, groups, and perspectives.',
      sections: [
        {
          heading: 'Universal Project Schema (UPGProject)',
          text: 'Defines top-level project metadata, root graph reference, domain, and cloud sync status.',
          code: `interface UPGProject {
  id: string;                      // Stable UUID
  name: string;                    // Project display name
  description: string;             // Architectural overview
  domain: string;                  // e.g. "Systems & Infrastructure"
  type: string;                    // "software" | "system" | "universal"
  version: string;                 // Semantic project version
  rootGraphId: string;             // Root system graph UUID
  createdAt: number;               // Epoch timestamp
  updatedAt: number;               // Epoch timestamp
  isCloud?: boolean;               // True if synchronized with Supabase
  syncStatus?: 'synced' | 'pending' | 'error';
  lastSyncedAt?: number;
}`,
        },
        {
          heading: 'Node Schema (UPGNode)',
          text: 'Defines architectural entities with spatial coordinates, dimensional size, priority, status, and nested child graph links.',
          code: `interface UPGNode {
  id: string;
  projectId: string;
  graphId: string;
  type: string;                    // "service" | "database" | "queue" | "agent" | etc.
  name: string;
  description: string;
  status: 'active' | 'deprecated' | 'proposed' | 'maintenance';
  priority: 'low' | 'medium' | 'high' | 'critical';
  position: { x: number; y: number };
  size: { width: number; height: number };
  childGraphId?: string;           // Links to a nested child subsystem graph
  properties: Record<string, any>; // Custom typed key-value attributes
  tags: string[];
  createdAt: number;
  updatedAt: number;
}`,
        },
      ],
    },
  },
  {
    id: 'local-first-and-sync',
    title: 'Local-First & Sync',
    category: 'PERSISTENCE & SYNC',
    icon: <HardDrive size={15} />,
    content: {
      summary: 'Specifications for client-side IndexedDB stores, mutation queues, debouncing, and tombstone conflict resolution.',
      sections: [
        {
          heading: '10 Structured IndexedDB Stores',
          text: 'The client maintains 10 isolated stores for maximum isolation and rapid querying.',
          table: [
            { col1: 'Store Name', col2: 'Key', col3: 'Description' },
            { col1: 'projects', col2: 'id', col3: 'Project metadata & cloud sync status' },
            { col1: 'graphs', col2: 'id', col3: 'Subsystem graphs and hierarchy nodes' },
            { col1: 'nodes', col2: 'id', col3: 'Spatial coordinates, sizes, types, properties' },
            { col1: 'edges', col2: 'id', col3: 'Relationships, directionality, protocols' },
            { col1: 'syncQueue', col2: 'id', col3: 'Pending mutation queue with retry worker' },
            { col1: 'tombstones', col2: 'id', col3: 'Deletion markers for remote synchronization' },
          ],
        },
        {
          heading: 'Debouncing & Conflict Resolution',
          text: 'Dragging operations are debounced by 350ms before committing to the sync queue. Timestamps (updatedAt) govern Last-Write-Wins (LWW) resolution in PostgreSQL.',
        },
      ],
    },
  },
  {
    id: 'database-and-auth',
    title: 'Database & Auth',
    category: 'BACKEND & SECURITY',
    icon: <Database size={15} />,
    content: {
      summary: 'PostgreSQL schema definitions, Better Auth integration, and session security.',
      sections: [
        {
          heading: 'Authentication Engine',
          text: 'Authentication is powered by Better Auth, providing email/password credential validation, secure session token hashing, and project ownership verification.',
        },
        {
          heading: 'PostgreSQL Relational Schema',
          text: 'Foreign key constraints with ON DELETE CASCADE ensure clean relationship teardown when entities or child subsystems are removed.',
        },
      ],
    },
  },
  {
    id: 'desktop-application',
    title: 'Windows Desktop App',
    category: 'DESKTOP INTEGRATION',
    icon: <Monitor size={15} />,
    content: {
      summary: 'Electron 43 desktop application architecture, native file dialogs, and packaging.',
      sections: [
        {
          heading: 'Desktop Capabilities',
          text: 'The Windows desktop application provides native file dialogs (Open & Save .json), window state persistence, hardware acceleration, and single-instance process locking.',
          code: `# Build Windows Desktop Installer (.exe)
npm run package:win

# Output:
dist-desktop/HUPA-Setup-0.1.0.exe`,
        },
      ],
    },
  },
];

export const DocsPage: React.FC<DocsPageProps> = ({ onNavigate, initialDoc }) => {
  const [activeDocId, setActiveDocId] = useState<string>(initialDoc || 'getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  useSmoothScroll();

  useEffect(() => {
    document.title = 'Documentation — HUPA Universal Project Graph';
    window.scrollTo(0, 0);
  }, [activeDocId]);

  const activeDoc = DOCS_DATA.find((d) => d.id === activeDocId) || DOCS_DATA[0];

  const filteredDocs = DOCS_DATA.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.title.toLowerCase().includes(q) ||
      d.content.summary.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="landing-root">
      <Navbar onNavigate={onNavigate} />

      <main className="land-subpage">
        <div className="land-container">
          {/* Header */}
          <div className="land-subpage-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div className="land-section-label">Developer Documentation</div>
              <h1 className="land-subpage-title">HUPA Docs</h1>
              <p className="land-subpage-lead">
                Explore architecture specifications, data schemas, sync protocols, and developer setup.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button
                onClick={() => onNavigate('/')}
                className="land-btn-secondary"
                style={{ height: 38, padding: '0 16px', fontSize: 13 }}
              >
                <ArrowLeft size={14} />
                <span>Home</span>
              </button>
              <button
                onClick={() => onNavigate('/app')}
                className="land-btn-primary"
                style={{ height: 38, padding: '0 18px', fontSize: 13 }}
              >
                <span>Launch Studio</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Docs Layout */}
          <div className="land-docs-layout">
            {/* Sidebar */}
            <aside className="land-docs-sidebar">
              <div className="land-docs-search">
                <Search size={14} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--land-text-4)' }} />
                <input
                  type="text"
                  placeholder="Search docs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="land-docs-nav-group">
                <div className="land-docs-nav-label">Table of Contents</div>
                {filteredDocs.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setActiveDocId(doc.id)}
                    className={`land-docs-nav-item ${activeDocId === doc.id ? 'is-active' : ''}`}
                  >
                    <span style={{ opacity: 0.6 }}>{doc.icon}</span>
                    <span>{doc.title}</span>
                  </button>
                ))}
              </div>
            </aside>

            {/* Article */}
            <article className="land-docs-article">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--land-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                {activeDoc.category}
              </div>

              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 600, color: 'var(--land-text-hero)', letterSpacing: '-0.025em', margin: '0 0 14px' }}>
                {activeDoc.title}
              </h2>

              <p style={{ fontSize: 15, color: 'var(--land-text-2)', lineHeight: 1.65, margin: '0 0 36px', fontWeight: 300 }}>
                {activeDoc.content.summary}
              </p>

              {/* Sections */}
              <div style={{ display: 'grid', gap: 36 }}>
                {activeDoc.content.sections.map((sec, idx) => (
                  <div key={sec.heading} style={{ borderTop: idx > 0 ? '1px solid var(--land-border)' : 'none', paddingTop: idx > 0 ? 28 : 0 }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--land-text-hero)', margin: '0 0 10px', letterSpacing: '-0.015em' }}>
                      {sec.heading}
                    </h3>
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--land-text-2)', margin: '0 0 14px', fontWeight: 300 }}>
                      {sec.text}
                    </p>

                    {/* Code Block */}
                    {sec.code && (
                      <pre className="land-docs-code">
                        <code>{sec.code}</code>
                      </pre>
                    )}

                    {/* Table */}
                    {sec.table && (
                      <div style={{ overflowX: 'auto', border: '1px solid var(--land-border)', borderRadius: 10, marginTop: 12 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, fontFamily: 'var(--font-mono)' }}>
                          <thead>
                            <tr style={{ background: 'var(--land-surface)', color: 'var(--land-text-hero)' }}>
                              <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 500 }}>{sec.table[0].col1}</th>
                              <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 500 }}>{sec.table[0].col2}</th>
                              <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 500 }}>{sec.table[0].col3}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sec.table.slice(1).map((row, rIdx) => (
                              <tr key={rIdx} style={{ borderTop: '1px solid var(--land-border)' }}>
                                <td style={{ padding: '10px 14px', fontWeight: 500, color: 'var(--land-text)' }}>{row.col1}</td>
                                <td style={{ padding: '10px 14px', color: 'var(--land-text-3)' }}>{row.col2}</td>
                                <td style={{ padding: '10px 14px', color: 'var(--land-text-2)' }}>{row.col3}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default DocsPage;
