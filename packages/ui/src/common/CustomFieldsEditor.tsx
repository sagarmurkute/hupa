import React, { useState } from 'react';
import { Plus, Trash2, Link as LinkIcon, Hash, Type, ToggleLeft, ToggleRight } from 'lucide-react';

export interface CustomField {
  key: string;
  value: any;
  type?: 'text' | 'number' | 'boolean' | 'link';
}

interface CustomFieldsEditorProps {
  properties: Record<string, any>;
  onChange: (properties: Record<string, any>) => void;
}

export const CustomFieldsEditor: React.FC<CustomFieldsEditorProps> = ({
  properties = {},
  onChange,
}) => {
  const [newKey, setNewKey] = useState('');
  const [newVal, setNewVal] = useState('');
  const [newType, setNewType] = useState<'text' | 'number' | 'boolean' | 'link'>('text');

  const handleAddField = () => {
    const key = newKey.trim();
    if (!key) return;

    let processedVal: any = newVal;
    if (newType === 'number') {
      processedVal = Number(newVal) || 0;
    } else if (newType === 'boolean') {
      processedVal = newVal.toLowerCase() === 'true' || newVal === '1';
    }

    onChange({ ...properties, [key]: processedVal });
    setNewKey('');
    setNewVal('');
  };

  const handleUpdateVal = (key: string, nextVal: any) => {
    onChange({ ...properties, [key]: nextVal });
  };

  const handleRemoveField = (key: string) => {
    const copy = { ...properties };
    delete copy[key];
    onChange(copy);
  };

  const getTypeIcon = (val: any) => {
    if (typeof val === 'boolean') return <ToggleRight size={11} color="var(--accent-indigo)" />;
    if (typeof val === 'number' || !isNaN(Number(val)) && typeof val !== 'string') return <Hash size={11} color="var(--accent-amber)" />;
    if (typeof val === 'string' && (val.startsWith('http://') || val.startsWith('https://'))) return <LinkIcon size={11} color="var(--accent-blue)" />;
    return <Type size={11} color="var(--text-muted)" />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Existing Custom Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {Object.entries(properties).map(([k, v]) => {
          const isBool = typeof v === 'boolean';
          return (
            <div
              key={k}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 6px',
                backgroundColor: 'var(--surface-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '5px',
              }}
            >
              {/* Field Key */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  minWidth: '90px',
                  maxWidth: '110px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={k}
              >
                {getTypeIcon(v)}
                <span>{k}</span>
              </div>

              <span style={{ color: 'var(--border-medium)', fontSize: '11px' }}>:</span>

              {/* Field Value Editor */}
              {isBool ? (
                <button
                  type="button"
                  onClick={() => handleUpdateVal(k, !v)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: v ? '#ecfdf5' : '#f8fafc',
                    color: v ? '#059669' : '#64748b',
                    fontSize: '10.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    flex: 1,
                  }}
                >
                  {v ? <ToggleRight size={13} color="#059669" /> : <ToggleLeft size={13} color="#64748b" />}
                  <span>{v ? 'TRUE' : 'FALSE'}</span>
                </button>
              ) : (
                <input
                  value={String(v)}
                  onChange={(e) => handleUpdateVal(k, e.target.value)}
                  style={{
                    flex: 1,
                    height: '24px',
                    fontSize: '11px',
                    fontFamily: typeof v === 'number' ? 'var(--font-mono)' : 'inherit',
                    padding: '0 6px',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '4px',
                    backgroundColor: '#ffffff',
                    outline: 'none',
                    minWidth: 0,
                  }}
                />
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemoveField(k)}
                className="hupa-btn ghost icon-only danger"
                style={{ width: '22px', height: '22px', flexShrink: 0 }}
                title="Remove field"
              >
                <Trash2 size={11} />
              </button>
            </div>
          );
        })}

        {Object.keys(properties).length === 0 && (
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '4px 0' }}>
            No custom architecture fields added yet.
          </div>
        )}
      </div>

      {/* Add New Field Builder */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          padding: '8px',
          backgroundColor: '#ffffff',
          border: '1px dashed var(--border-medium)',
          borderRadius: '6px',
          marginTop: '2px',
        }}
      >
        <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Add Custom Field
        </div>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <input
            placeholder="Field key (e.g. latency, port, runtime)"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            style={{
              flex: 1,
              height: '26px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              padding: '0 6px',
              border: '1px solid var(--border-subtle)',
              borderRadius: '4px',
              outline: 'none',
            }}
          />

          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as any)}
            style={{
              height: '26px',
              fontSize: '10.5px',
              padding: '0 4px',
              border: '1px solid var(--border-subtle)',
              borderRadius: '4px',
              backgroundColor: 'var(--surface-subtle)',
              outline: 'none',
            }}
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
            <option value="link">Link</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <input
            placeholder={newType === 'boolean' ? 'true or false' : newType === 'number' ? '123' : 'Field value...'}
            value={newVal}
            onChange={(e) => setNewVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddField()}
            style={{
              flex: 1,
              height: '26px',
              fontSize: '11px',
              padding: '0 6px',
              border: '1px solid var(--border-subtle)',
              borderRadius: '4px',
              outline: 'none',
            }}
          />

          <button
            type="button"
            onClick={handleAddField}
            disabled={!newKey.trim()}
            className="hupa-btn primary"
            style={{ height: '26px', padding: '0 8px', fontSize: '11px' }}
          >
            <Plus size={11} /> Add Field
          </button>
        </div>
      </div>
    </div>
  );
};
