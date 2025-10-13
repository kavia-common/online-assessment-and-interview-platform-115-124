import React, { useState } from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import FileUpload from '../../../components/common/forms/FileUpload';
import { Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * ImportExport provides placeholder UI for importing/exporting question banks.
 * Actual file format and API wiring to be implemented in a later step.
 */
export default function ImportExport() {
  const [lastImport, setLastImport] = useState(null);

  const onUpload = async (file) => {
    // placeholder parsing result
    const meta = { name: file.name, size: file.size };
    setLastImport({ success: true, imported: 42, meta });
    return { success: true };
  };

  const downloadTemplate = () => {
    const sample = {
      type: 'mcq',
      title: 'Sample Question',
      difficulty: 'Easy',
      tags: ['sample'],
      options: ['A', 'B', 'C', 'D'],
      correctIndex: 1,
    };
    const blob = new Blob([JSON.stringify(sample, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'question_template.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAll = () => {
    const mock = [
      { id: 'q1', type: 'mcq', title: 'What is React?' },
      { id: 'q2', type: 'theory', title: 'Explain event loop' },
    ];
    const blob = new Blob([JSON.stringify(mock, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'questions_export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <Card title="Import / Export Questions" extra={<Link to="/admin/questions">Back to List</Link>}>
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
          <div className="card p-16" style={{ display: 'grid', gap: 12 }}>
            <strong>Import</strong>
            <FileUpload label="Upload JSON/CSV" accept=".json,.csv" onUpload={onUpload} helpText="Upload .json or .csv with questions" />
            {lastImport && (
              <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                Imported {lastImport.imported} items from {lastImport.meta.name}
              </div>
            )}
          </div>
          <div className="card p-16" style={{ display: 'grid', gap: 12 }}>
            <strong>Export</strong>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button onClick={exportAll}>Export All (JSON)</Button>
              <Button variant="secondary" onClick={downloadTemplate}>Download Template</Button>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              In a future step, filters and advanced export formats will be added.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
