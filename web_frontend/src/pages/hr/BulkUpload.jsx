import React, { useState } from 'react';
import Card from '../../components/common/Card';
import FileUpload from '../../components/common/forms/FileUpload';
import Button from '../../components/common/Button';
import { hrService } from '../../services/hrService';

/**
 * PUBLIC_INTERFACE
 * BulkUpload - HR uploads a CSV/Excel of candidates.
 */
export default function BulkUpload() {
  const [result, setResult] = useState(null);

  const onUpload = async (file) => {
    const meta = { name: file.name, size: file.size, type: file.type };
    const res = await hrService.bulkUploadCandidates(meta);
    setResult(res);
    return res;
  };

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <Card title="Bulk Upload Candidates">
        <div style={{ display: 'grid', gap: 12 }}>
          <FileUpload label="Upload CSV/XLSX" accept=".csv,.xlsx" onUpload={onUpload} helpText="Upload a CSV/XLSX with candidate details." />
          {result && (
            <div className="card p-16">
              Imported: {result.imported} · Duplicates: {result.duplicates}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setResult(null)}>Clear</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
