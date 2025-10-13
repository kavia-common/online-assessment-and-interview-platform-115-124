import React, { useState } from 'react';
import Card from '../../components/common/Card';
import FileUpload from '../../components/common/forms/FileUpload';
import Button from '../../components/common/Button';
import { candidateService } from '../../services/candidateService';

/**
 * PUBLIC_INTERFACE
 * ResumeUpload - allows candidates to upload a resume file.
 */
export default function ResumeUpload() {
  const [result, setResult] = useState(null);
  const [lastMeta, setLastMeta] = useState(null);

  const onUpload = async (file) => {
    const res = await candidateService.uploadResume(file);
    setResult(res);
    setLastMeta({ name: file.name, size: file.size });
    return res;
  };

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <Card title="Resume Upload">
        <div style={{ display: 'grid', gap: 16 }}>
          <FileUpload onUpload={onUpload} />
          {result && (
            <div className="card p-16" style={{ display: 'grid', gap: 8 }}>
              <div><strong>Status:</strong> {result.success ? 'Success' : 'Failed'}</div>
              {result.resumeId && <div><strong>Resume ID:</strong> {result.resumeId}</div>}
              {lastMeta && <div><strong>File:</strong> {lastMeta.name} ({Math.round(lastMeta.size / 1024)} KB)</div>}
            </div>
          )}
          <div className="hr" />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setResult(null)}>Clear</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
