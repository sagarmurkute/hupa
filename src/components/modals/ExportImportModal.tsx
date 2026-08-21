import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExportModalOpen(false);
      }
    };
    if (isExportModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExportModalOpen, setExportModalOpen]);

  if (!isExportModalOpen) return null;

  const currentProject = projects[activeProjectId];
  const exportedJson = exportProjectJson();

  const handleCopy = () => {
    navigator.clipboard.writeText(exportedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `${currentProject?.name.toLowerCase().replace(/\s+/g, '-') || 'hupa-project'}.json`;
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
      setImportError('Invalid HUPA Project Graph JSON structure.');
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
    <div className="modal-overlay" onClick={() => setExportModalOpen(false)}>
      <div
        className="modal-dialog"
        style={{
          width: '560px',
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
            <FileJson size={15} color="var(--text-primary)" />
            <span style={{ fontSize: '12.5px', fontWeight: 600 }}>Project Data Portability</span>
          </div>
          <button
            onClick={() => setExportModalOpen(false)}
            className="hupa-btn ghost icon-only"
            style={{ width: '22px', height: '22px' }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', padding: '0 16px', backgroundColor: '#ffffff' }}>
          <button
            onClick={() => setActiveTab('export')}
            style={{
              padding: '8px 12px',
              border: 'none',
              background: 'none',
              fontSize: '12px',
              fontWeight: activeTab === 'export' ? 600 : 500,
              color: activeTab === 'export' ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderBottom: `2px solid ${activeTab === 'export' ? '#0f172a' : 'transparent'}`,
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
              padding: '8px 12px',
              border: 'none',
              background: 'none',
              fontSize: '12px',
              fontWeight: activeTab === 'import' ? 600 : 500,
              color: activeTab === 'import' ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderBottom: `2px solid ${activeTab === 'import' ? '#0f172a' : 'transparent'}`,
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
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {activeTab === 'export' ? (
            <>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                Export architectural graphs, nested subsystems, perspectives, and relationships into portable JSON.
              </div>

              <textarea
                readOnly
                rows={9}
                value={exportedJson}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  backgroundColor: 'var(--surface-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  resize: 'none',
                  outline: 'none',
                  lineHeight: '1.4',
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button onClick={handleCopy} className="hupa-btn">
                  {copied ? <Check size={13} color="#059669" /> : <Copy size={13} />}
                  {copied ? 'Copied' : 'Copy JSON'}
                </button>
                <button onClick={handleDownload} className="hupa-btn primary">
                  <Download size={13} /> Download File (.json)
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                Paste JSON or upload a saved HUPA project graph definition to restore workspace state.
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <label
                  className="hupa-btn"
                  style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Upload size={13} /> Upload .json file
                  <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} />
                </label>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>or paste raw JSON below</span>
              </div>

              <textarea
                rows={8}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder="Paste HUPA project JSON here..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  backgroundColor: 'var(--surface-subtle)',
                  border: `1px solid ${importError ? '#e11d48' : 'var(--border-subtle)'}`,
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  resize: 'none',
                  outline: 'none',
                  lineHeight: '1.4',
                }}
              />

              {importError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e11d48', fontSize: '11px' }}>
                  <AlertCircle size={13} /> {importError}
                </div>
              )}

              {importSuccess && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '11px' }}>
                  <Check size={13} /> Project successfully imported!
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button onClick={() => setExportModalOpen(false)} className="hupa-btn">
                  Cancel
                </button>
                <button onClick={handleImport} className="hupa-btn primary">
                  <Upload size={13} /> Import Project
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
