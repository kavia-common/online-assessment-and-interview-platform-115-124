import React, { useState } from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import FileUpload from '../../../components/common/forms/FileUpload';
import { adminService } from '../../../services/adminService';

/**
 * PUBLIC_INTERFACE
 * Maintenance - Admin maintenance tools for Backup and Restore with confirmations.
 */
export default function Maintenance() {
  const [confirmType, setConfirmType] = useState(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');

  const doBackup = async () => {
    setBusy(true);
    setStatus('');
    try {
      const res = await adminService.backupNow();
      setStatus(`Backup job started: ${res.jobId}`);
    } catch (e) {
      setStatus(e?.message || 'Backup failed');
    } finally {
      setBusy(false);
    }
  };

  const onBackupConfirm = () => {
    setConfirmType(null);
    doBackup();
  };

  const onRestoreUpload = async (file) => {
    setBusy(true);
    setStatus('');
    try {
      const res = await adminService.restoreNow({ name: file.name, size: file.size, type: file.type });
      setStatus(`Restore job started: ${res.jobId}`);
      return res;
    } catch (e) {
      setStatus(e?.message || 'Restore failed');
      throw e;
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <Card title="Maintenance">
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
          <div className="card p-16" style={{ display: 'grid', gap: 12 }}>
            <strong>Backup</strong>
            <div style={{ color: 'var(--text-secondary)' }}>
              Create a backup of the system data. This is a mock action and does not contact a backend in this step.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button onClick={() => setConfirmType('backup')} disabled={busy}>{busy && confirmType === 'backup' ? 'Working...' : 'Backup Now'}</Button>
            </div>
          </div>
          <div className="card p-16" style={{ display: 'grid', gap: 12 }}>
            <strong>Restore</strong>
            <div style={{ color: 'var(--text-secondary)' }}>
              Restore from a backup file. Upload the file to start a mock restore job.
            </div>
            <FileUpload
              label="Upload backup file (.zip)"
              accept=".zip"
              onUpload={onRestoreUpload}
              helpText="Upload a .zip backup file to start restore (mock)"
            />
          </div>
        </div>
        {status && (
          <div className="mt-16 card p-16" style={{ color: 'var(--text-secondary)' }}>
            Status: {status}
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={confirmType === 'backup'}
        title="Run Backup"
        message="Are you sure you want to start a backup now?"
        confirmText="Start Backup"
        onCancel={() => setConfirmType(null)}
        onConfirm={onBackupConfirm}
      />
    </div>
  );
}
