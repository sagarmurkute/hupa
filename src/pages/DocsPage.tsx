import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { Search, ArrowLeft, ArrowRight, FileText, Terminal, Layers, Database, HardDrive, Monitor } from 'lucide-react';
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
    icon: <Terminal size={16} />,
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
    icon: <Layers size={16} />,
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
+────────────────────────────────────────────────────────────────---------+
|                        HUPA BACKEND (Express 5)                         |
|                                                                         |
|  [ Better Auth Session Middleware ] ---> [ /api/projects Router ]       |
|                                                  │                      |
|                                                  ▼                      |
|                         [ Supabase PostgreSQL Database ]                |
|               (projects, graphs, nodes, edges, groups, documents)       |
+────────────────────────────────────────────────────────────────---------+`,
        },
      ],
    },
  },
  {
    id: 'graph-data-model',
    title: 'Graph Data Model',
    category: 'SCHEMAS & TYPES',
    icon: <FileText size={16} />,
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
    icon: <HardDrive size={16} />,
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
    icon: <Database size={16} />,
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
    icon: <Monitor size={16} />,
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

  useEffect(() => {
    document.title = 'Documentation — HUPA Universal Project Graph';
    window.scrollTo(0, 0);
  }, [activeDocId]);

  const activeDoc = DOCS_DATA.find((d) => d.id === activeDocId) || DOCS_DATA[0];

  const filteredDocs = DOCS_DATA.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return d.title.toLowerCase().includes(q) || d.content.summary.toLowerCase().includes(q) || d.category.toLowerCase().includes(q);
  });

  return (
    <div className="landing-viewport">
      <Navbar onNavigate={onNavigate} />

      <main style={{ minHeight: '80vh', borderBottom: '1px solid #e5e5e5' }}>
        <div className="landing-container" style={{ padding: '3rem 2rem' }}>
          {/* Top Breadcrumb & Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-kicker">
                <span>Developer Documentation</span>
              </div>
              <h1 className="section-heading-large" style={{ fontSize: '2.5rem' }}>
                HUPA Documentation
              </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button onClick={() => onNavigate('/')} className="mono-btn mono-btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                <ArrowLeft size={14} /> Back to Home
              </button>
              <button onClick={() => onNavigate('/app')} className="mono-btn mono-btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
                Open HUPA <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Docs Layout Grid */}
          <div
            style={{
              border: '1px solid #000000',
              backgroundColor: '#ffffff',
              display: 'grid',
              gridTemplateColumns: '280px 1fr',
            }}
          >
            {/* Left Sidebar */}
            <aside style={{ borderRight: '1px solid #e5e5e5', backgroundColor: '#fafafa', padding: '1.5rem 0' }}>
              {/* Search Bar */}
              <div style={{ padding: '0 1.25rem', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    border: '1px solid #d4d4d4',
                    backgroundColor: '#ffffff',
                    padding: '0.4rem 0.6rem',
                  }}
                >
                  <Search size={14} color="#737373" />
                  <input
                    type="text"
                    placeholder="Search docs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.8125rem',
                      width: '100%',
                      fontFamily: 'var(--hupa-font-sans)',
                    }}
                  />
                </div>
              </div>

              {/* Doc List */}
              <nav aria-label="Documentation Index">
                {filteredDocs.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setActiveDocId(doc.id)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.85rem 1.25rem',
                      border: 'none',
                      borderLeft: activeDocId === doc.id ? '3px solid #000000' : '3px solid transparent',
                      backgroundColor: activeDocId === doc.id ? '#ffffff' : 'transparent',
                      color: activeDocId === doc.id ? '#000000' : '#525252',
                      fontWeight: activeDocId === doc.id ? 700 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      fontSize: '0.875rem',
                      transition: 'all 0.1s ease',
                    }}
                  >
                    {doc.icon}
                    <span>{doc.title}</span>
                  </button>
                ))}
              </nav>
            </aside>

            {/* Right Document Content */}
            <article style={{ padding: '3rem', maxWidth: '840px' }}>
              <div
                style={{
                  fontFamily: 'var(--hupa-font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#737373',
                  marginBottom: '0.5rem',
                }}
              >
                {activeDoc.category}
              </div>

              <h2
                style={{
                  fontFamily: 'var(--hupa-font-display)',
                  fontSize: '2.25rem',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  marginBottom: '1rem',
                }}
              >
                {activeDoc.title}
              </h2>

              <p style={{ fontSize: '1.125rem', color: 'var(--hupa-gray-2)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                {activeDoc.content.summary}
              </p>

              {/* Sections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {activeDoc.content.sections.map((sec, idx) => (
                  <div key={sec.heading} style={{ borderTop: idx > 0 ? '1px solid #e5e5e5' : 'none', paddingTop: idx > 0 ? '2rem' : 0 }}>
                    <h3
                      style={{
                        fontFamily: 'var(--hupa-font-display)',
                        fontSize: '1.35rem',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        marginBottom: '0.75rem',
                      }}
                    >
                      {sec.heading}
                    </h3>
                    <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, color: 'var(--hupa-gray-1)', marginBottom: sec.code || sec.table ? '1rem' : 0 }}>
                      {sec.text}
                    </p>

                    {/* Code Block */}
                    {sec.code && (
                      <pre
                        style={{
                          backgroundColor: '#000000',
                          color: '#ffffff',
                          padding: '1.25rem',
                          fontFamily: 'var(--hupa-font-mono)',
                          fontSize: '0.8125rem',
                          lineHeight: 1.5,
                          overflowX: 'auto',
                          border: '1px solid #262626',
                          marginTop: '0.75rem',
                        }}
                      >
                        <code>{sec.code}</code>
                      </pre>
                    )}

                    {/* Table */}
                    {sec.table && (
                      <table
                        style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          marginTop: '1rem',
                          fontFamily: 'var(--hupa-font-mono)',
                          fontSize: '0.8125rem',
                        }}
                      >
                        <thead>
                          <tr style={{ backgroundColor: '#000000', color: '#ffffff' }}>
                            <th style={{ padding: '0.6rem 0.8rem', textAlign: 'left' }}>{sec.table[0].col1}</th>
                            <th style={{ padding: '0.6rem 0.8rem', textAlign: 'left' }}>{sec.table[0].col2}</th>
                            <th style={{ padding: '0.6rem 0.8rem', textAlign: 'left' }}>{sec.table[0].col3}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sec.table.slice(1).map((row, rIdx) => (
                            <tr key={rIdx} style={{ borderBottom: '1px solid #e5e5e5' }}>
                              <td style={{ padding: '0.6rem 0.8rem', fontWeight: 600 }}>{row.col1}</td>
                              <td style={{ padding: '0.6rem 0.8rem', color: '#737373' }}>{row.col2}</td>
                              <td style={{ padding: '0.6rem 0.8rem' }}>{row.col3}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
