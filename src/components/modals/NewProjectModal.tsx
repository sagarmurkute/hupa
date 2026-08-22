import React, { useState, useEffect } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { useAuthStore } from '../../store/useAuthStore';
import { UNIVERSAL_TEMPLATES } from '../../constants/templates';
import { FolderPlus, X, Box, Globe, Server, Bot, FileCode, Cloud, Database } from 'lucide-react';

export const NewProjectModal: React.FC = () => {
  const { isNewProjectModalOpen, setNewProjectModalOpen, createProject } = useGraphStore();
  const { user } = useAuthStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('Systems & Web');
  const [selectedTemplateId, setSelectedTemplateId] = useState('fullstack-web');
  const [isCloud, setIsCloud] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setNewProjectModalOpen(false);
      }
    };
    if (isNewProjectModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNewProjectModalOpen, setNewProjectModalOpen]);

  if (!isNewProjectModalOpen) return null;

  const getTemplateIcon = (id: string) => {
    switch (id) {
      case 'blank':
        return Box;
      case 'fullstack-web':
        return Globe;
      case 'microservices':
        return Server;
      case 'ai-agents':
        return Bot;
      default:
        return FileCode;
    }
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    createProject(
      name.trim(),
      description.trim(),
      domain.trim() || 'Software Architecture',
      selectedTemplateId,
      isCloud && Boolean(user)
    );
    setName('');
    setDescription('');
    setNewProjectModalOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setNewProjectModalOpen(false)}>
      <div
        className="modal-dialog"
        style={{
          width: '540px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--surface-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FolderPlus size={15} color="var(--text-primary)" />
            <span style={{ fontSize: '12.5px', fontWeight: 600 }}>Create New Project Graph</span>
          </div>
          <button
            onClick={() => setNewProjectModalOpen(false)}
            className="hupa-btn ghost icon-only"
            style={{ width: '22px', height: '22px' }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Project Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Distributed Engine, Core Services..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              autoFocus
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: '5px',
                border: '1px solid var(--border-subtle)',
                fontSize: '12.5px',
                fontWeight: 600,
                outline: 'none',
                backgroundColor: '#ffffff',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                System Domain
              </label>
              <input
                type="text"
                placeholder="e.g. Developer Tools, Infrastructure"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  borderRadius: '5px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '11.5px',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Description
              </label>
              <input
                type="text"
                placeholder="Architecture context..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  borderRadius: '5px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '11.5px',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                }}
              />
            </div>
          </div>

          {/* Storage Destination Option */}
          {user && (
            <div>
              <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Storage & Synchronization Target
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div
                  onClick={() => setIsCloud(true)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: `1px solid ${isCloud ? 'var(--accent-indigo)' : 'var(--border-subtle)'}`,
                    backgroundColor: isCloud ? 'rgba(79, 70, 229, 0.05)' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: isCloud ? '0 0 0 1px var(--accent-indigo)' : 'none',
                  }}
                >
                  <Cloud size={16} color="var(--accent-indigo)" />
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-primary)' }}>Cloud Synced</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Supabase PostgreSQL + Local DB</div>
                  </div>
                </div>

                <div
                  onClick={() => setIsCloud(false)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: `1px solid ${!isCloud ? '#0f172a' : 'var(--border-subtle)'}`,
                    backgroundColor: !isCloud ? 'var(--surface-subtle)' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: !isCloud ? '0 0 0 1px #0f172a' : 'none',
                  }}
                >
                  <Database size={16} color="var(--text-primary)" />
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-primary)' }}>Local Only</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>IndexedDB (browser storage)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Template Picker */}
          <div>
            <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Starter Architecture Template
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {UNIVERSAL_TEMPLATES.map((tmpl) => {
                const Icon = getTemplateIcon(tmpl.id);
                const isSelected = selectedTemplateId === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => setSelectedTemplateId(tmpl.id)}
                    style={{
                      padding: '10px',
                      border: `1px solid ${isSelected ? '#0f172a' : 'var(--border-subtle)'}`,
                      backgroundColor: isSelected ? 'var(--surface-subtle)' : '#ffffff',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      boxShadow: isSelected ? '0 0 0 1px #0f172a' : 'none',
                    }}
                  >
                    <Icon size={16} color={isSelected ? '#0f172a' : 'var(--text-secondary)'} style={{ marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {tmpl.name}
                      </div>
                      <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', lineHeight: '1.3', marginTop: '2px' }}>
                        {tmpl.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <button onClick={() => setNewProjectModalOpen(false)} className="hupa-btn">
              Cancel
            </button>
            <button onClick={handleCreate} disabled={!name.trim()} className="hupa-btn primary">
              Create Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
