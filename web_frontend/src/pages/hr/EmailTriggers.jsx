import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import TextArea from '../../components/common/forms/TextArea';
import TextField from '../../components/common/forms/TextField';
import { hrService } from '../../services/hrService';

/**
 * PUBLIC_INTERFACE
 * EmailTriggers - trigger HR related email campaigns.
 */
export default function EmailTriggers() {
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState('');

  const send = async () => {
    const list = recipients.split(',').map((s) => s.trim()).filter(Boolean);
    if (list.length === 0) return alert('Add at least one recipient');
    const res = await hrService.triggerEmails({ recipients: list, subject, body });
    setStatus(`Triggered emails to ${res.count} recipients.`);
  };

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <Card title="Email Triggers">
        <div style={{ display: 'grid', gap: 12 }}>
          <TextArea label="Recipients (comma-separated emails)" value={recipients} onChange={setRecipients} rows={3} />
          <TextField label="Subject" value={subject} onChange={setSubject} />
          <TextArea label="Body" value={body} onChange={setBody} rows={6} />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button onClick={send}>Send</Button>
          </div>
          {status && <div className="card p-16" style={{ color: 'var(--text-secondary)' }}>{status}</div>}
        </div>
      </Card>
    </div>
  );
}
