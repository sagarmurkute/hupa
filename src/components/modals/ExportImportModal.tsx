import React, { useState } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { Download, Upload, Copy, Check, X, FileJson, AlertCircle } from 'lucide-react';

export const ExportImportModal: React.FC = () => {
  const {
    isExportModalOpen,
    setExportModalOpen,
    exportProjectJson,
    importProjectJson,
    projects,
    activeProjectId,
  } = useGraphStore();

  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [copied, setCopied] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  if (!isExportModalOpen) return null;

  const currentProject = projects[activeProjectId];
  const exportedJson = exportProjectJson();

  const handleCopy = () => {
    navigator.clipboard.writeText(exportedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `${currentProject?.name.toLowerCase().replace(/\s+/g, '-') || 'upg-project'}.json`;
    const blob = new Blob([exportedJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importJsonText.trim()) {
      setImportError('Please paste a valid JSON string.');
      return;
    }
    setImportError(null);
    const success = importProjectJson(importJsonText);
    if (success) {
      setImportSuccess(true);
      setTimeout(() => {
        setImportSuccess(false);
        setExportModalOpen(false);
      }, 1200);
    } else {
      setImportError('Invalid UPG Project Graph JSON structure.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportJsonText(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-backdrop" onClick={() => setExportModalOpen(false)}>
      <div
        className="glass-panel animate-slide-down"
        style={{
          width: '600px',
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
            <FileJson size={16} color="#09090b" />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Project Data Portability</span>
          </div>
          <button onClick={() => setExportModalOpen(false)} className="btn-icon" style={{ width: '24px', height: '24px' }}>
            <X size={15} />
          </button>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', padding: '0 18px' }}>
          <button
            onClick={() => setActiveTab('export')}
            style={{
              padding: '10px 14px',
              border: 'none',
              background: 'none',
              fontSize: '12px',
              fontWeight: activeTab === 'export' ? 600 : 500,
              color: activeTab === 'export' ? '#09090b' : 'var(--text-secondary)',
              borderBottom: `2px solid ${activeTab === 'export' ? '#09090b' : 'transparent'}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Download size={13} /> Export JSON
          </button>
          <button
            onClick={() => setActiveTab('import')}
            style={{
              padding: '10px 14px',
              border: 'none',
              background: 'none',
              fontSize: '12px',
              fontWeight: activeTab === 'import' ? 600 : 500,
              color: activeTab === 'import' ? '#09090b' : 'var(--text-secondary)',
              borderBottom: `2px solid ${activeTab === 'import' ? '#09090b' : 'transparent'}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Upload size={13} /> Import JSON
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {activeTab === 'export' ? (
            <>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Export complete architectural models, nested graphs, views, relationships, and metadata.
              </div>

              <textarea
                readOnly
                rows={9}
                value={exportedJson}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-default)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  color: 'var(--text-primary)',
                  resize: 'none',
                }}
              />

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button onClick={handleCopy} className="btn">
                  {copied ? <Check size={14} color="#09090b" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy JSON'}</span>
                </button>
                <button onClick={handleDownload} className="btn btn-primary">
                  <Download size={14} />
                  <span>Download .json file</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Paste exported UPG JSON string or select a local file to restore graph architecture.
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label className="btn" style={{ cursor: 'pointer' }}>
                  <Upload size={13} /> Select File...
                  <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} />
                </label>
                <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>or paste JSON below</span>
              </div>

              <textarea
                rows={8}
                placeholder="Paste UPG JSON payload here..."
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-default)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  resize: 'none',
                }}
              />

              {importError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#09090b', fontSize: '12px' }}>
                  <AlertCircle size={14} />
                  <span>{importError}</span>
                </div>
              )}

              {importSuccess && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#09090b', fontSize: '12px' }}>
                  <Check size={14} />
                  <span>Graph successfully imported!</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button onClick={() => setExportModalOpen(false)} className="btn">
                  Cancel
                </button>
                <button onClick={handleImport} disabled={!importJsonText.trim()} className="btn btn-primary">
                  <Upload size={14} />
                  <span>Import Project</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
