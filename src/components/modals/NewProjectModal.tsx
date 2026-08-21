import React, { useState } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { UNIVERSAL_TEMPLATES } from '../../constants/templates';
import { FolderPlus, X, Box, Globe, Server, Bot, FileCode } from 'lucide-react';

export const NewProjectModal: React.FC = () => {
  const { isNewProjectModalOpen, setNewProjectModalOpen, createProject } = useGraphStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('Systems & Web');
  const [selectedTemplateId, setSelectedTemplateId] = useState('fullstack-web');

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
      selectedTemplateId
    );
    setName('');
    setDescription('');
    setNewProjectModalOpen(false);
  };

  return (
    <div className="modal-backdrop" onClick={() => setNewProjectModalOpen(false)}>
      <div
        className="glass-panel animate-slide-down"
        style={{
          width: '560px',
          backgroundColor: '#ffffff',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-surface-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FolderPlus size={16} color="#09090b" />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Create New Project Graph</span>
          </div>
          <button onClick={() => setNewProjectModalOpen(false)} className="btn-icon" style={{ width: '24px', height: '24px' }}>
            <X size={15} />
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '440px', overflowY: 'auto' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
              Project Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Payment Gateway Engine, Search Platform..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              autoFocus
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border-default)',
                fontSize: '13px',
                fontWeight: 500,
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                System Domain
              </label>
              <input
                type="text"
                placeholder="e.g. Fintech, Developer Tools, AI"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-default)',
                  fontSize: '12px',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                Description (Optional)
              </label>
              <input
                type="text"
                placeholder="High-level architecture context..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-default)',
                  fontSize: '12px',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
              Starter Architecture Template
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {UNIVERSAL_TEMPLATES.map((tpl) => {
                const isSelected = selectedTemplateId === tpl.id;
                const IconComp = getTemplateIcon(tpl.id);
                return (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: `1.5px solid ${isSelected ? '#09090b' : 'var(--border-subtle)'}`,
                      backgroundColor: isSelected ? '#09090b' : '#ffffff',
                      color: isSelected ? '#ffffff' : 'var(--text-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      transition: 'all 0.12s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        backgroundColor: isSelected ? 'rgba(255,255,255,0.15)' : '#f4f4f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <IconComp size={14} color={isSelected ? '#ffffff' : '#09090b'} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12.5px', fontWeight: 600, color: isSelected ? '#ffffff' : '#09090b' }}>
                        {tpl.name}
                      </div>
                      <div style={{ fontSize: '11px', color: isSelected ? '#d4d4d8' : 'var(--text-muted)', marginTop: '2px', lineHeight: '1.3' }}>
                        {tpl.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 18px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface-subtle)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
          }}
        >
          <button onClick={() => setNewProjectModalOpen(false)} className="btn">
            Cancel
          </button>
          <button onClick={handleCreate} disabled={!name.trim()} className="btn btn-primary">
            <FolderPlus size={14} /> Create Project
          </button>
        </div>
      </div>
    </div>
  );
};
