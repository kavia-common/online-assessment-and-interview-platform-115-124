import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import TextField from '../../components/common/forms/TextField';
import { hrService } from '../../services/hrService';

/**
 * PUBLIC_INTERFACE
 * TimeAdjustment - grant extra time to specific attempts.
 */
export default function TimeAdjustment() {
  const [attemptId, setAttemptId] = useState('');
  const [minutes, setMinutes] = useState(5);
  const [status, setStatus] = useState('');

  const adjust = async () => {
    if (!attemptId.trim() || minutes <= 0) return alert('Provide attempt id and minutes > 0');
    const res = await hrService.adjustTime(attemptId, Number(minutes));
    setStatus(res.success ? 'Time adjusted successfully.' : 'Failed');
  };

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <Card title="Time Adjustment">
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '2fr 1fr auto' }}>
          <TextField label="Attempt ID" value={attemptId} onChange={setAttemptId} />
          <TextField label="Minutes" type="number" value={minutes} onChange={(v) => setMinutes(Number(v))} />
          <div style={{ display: 'flex', alignItems: 'end' }}>
            <Button onClick={adjust}>Adjust</Button>
          </div>
        </div>
        {status && <div className="mt-16 card p-16" style={{ color: 'var(--text-secondary)' }}>{status}</div>}
      </Card>
    </div>
  );
}
