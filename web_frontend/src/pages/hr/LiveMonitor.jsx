import React, { useEffect, useMemo, useState } from 'react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Tag from '../../components/common/Tag';
import TextField from '../../components/common/forms/TextField';
import Button from '../../components/common/Button';
import { hrService } from '../../services/hrService';

/**
 * PUBLIC_INTERFACE
 * LiveMonitor - real-time monitor of ongoing tests via WebSocket feed.
 * Shows events like join/leave, tab switch, idle, submission, etc.
 */
export default function LiveMonitor() {
  const [batchId, setBatchId] = useState('spring-2025');
  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState([]);

  // Maintain a limited size list
  const pushEvent = (evt) => setEvents((e) => [evt, ...e].slice(0, 100));

  useEffect(() => {
    setEvents([]);
    let closeFn = null;
    // Subscribe to WS stream; in mock, no real server sends messages.
    closeFn = hrService.subscribeLiveMonitor(batchId, (msg) => {
      setConnected(true);
      const time = new Date().toLocaleTimeString();
      pushEvent({ time, ...msg });
    });
    // Add a mock generator when in mocks (no backend)
    const mockInterval = setInterval(() => {
      const kinds = ['joined', 'tab-hidden', 'idle', 'submit', 'violation'];
      const k = kinds[Math.floor(Math.random() * kinds.length)];
      pushEvent({ type: k, candidate: 'User_' + Math.floor(Math.random() * 50), payload: '...' , time: new Date().toLocaleTimeString() });
    }, 3000);
    return () => {
      closeFn && closeFn();
      clearInterval(mockInterval);
      setConnected(false);
    };
  }, [batchId]);

  const columns = useMemo(() => [
    { key: 'time', title: 'Time', dataIndex: 'time' },
    { key: 'candidate', title: 'Candidate', dataIndex: 'candidate' },
    { key: 'type', title: 'Event', dataIndex: 'type', render: (v) => <Tag color={v === 'submit' ? 'success' : v === 'violation' ? 'error' : 'primary'}>{v}</Tag> },
    { key: 'payload', title: 'Details', dataIndex: 'payload' },
  ], []);

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <Card title="Live Monitor">
        <div className="card p-16" style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr auto' }}>
          <TextField label="Batch ID" value={batchId} onChange={setBatchId} />
          <div style={{ display: 'flex', alignItems: 'end' }}>
            <Button variant="secondary" onClick={() => setEvents([])}>Clear</Button>
          </div>
        </div>
        <div className="mt-16" style={{ color: 'var(--text-secondary)' }}>
          Status: {connected ? 'Connected (mock)' : 'Disconnected'}
        </div>
        <div className="mt-16">
          <Table columns={columns} data={events} />
        </div>
      </Card>
    </div>
  );
}
