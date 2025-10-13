import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Tag from '../../components/common/Tag';
import Button from '../../components/common/Button';
import { candidateService } from '../../services/candidateService';

/**
 * PUBLIC_INTERFACE
 * InterviewDetail - details about a scheduled interview with panel, notes and join link.
 */
export default function InterviewDetail() {
  const { interviewId } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const d = await candidateService.getInterviewDetail(interviewId);
        setDetail(d);
      } finally {
        setLoading(false);
      }
    })();
  }, [interviewId]);

  if (loading) {
    return <div className="container"><div className="card p-24">Loading...</div></div>;
  }
  if (!detail) {
    return <div className="container"><div className="card p-24">Interview not found.</div></div>;
  }

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <Card title={`Interview - ${detail.role}`}>
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div><strong>Date & Time:</strong> {detail.date}</div>
            <div><strong>Mode:</strong> {detail.mode}</div>
            <Tag color={detail.status === 'Scheduled' ? 'primary' : 'success'}>{detail.status}</Tag>
          </div>
          <div>
            <strong>Panel:</strong>{' '}
            {detail.panel?.map((p, idx) => (
              <span key={idx} style={{ marginRight: 8 }}>{p.name}</span>
            ))}
          </div>
          <div>
            <strong>Notes:</strong>
            <div style={{ color: 'var(--text-secondary)' }}>{detail.notes}</div>
          </div>
          {detail.meetingLink && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Button as="a" onClick={() => window.open(detail.meetingLink, '_blank', 'noopener,noreferrer')}>
                Join Meeting
              </Button>
              <a href={detail.meetingLink} target="_blank" rel="noreferrer">Open in new tab</a>
            </div>
          )}
          <div className="hr" />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link to="/candidate/interviews">Back to list</Link>
            <Link to="/candidate/tests/launch">Go to Test Launcher</Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
