import React from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import Card from '../../components/common/Card';
import Stepper from '../../components/common/Stepper';
import Table from '../../components/common/Table';
import Tag from '../../components/common/Tag';

/**
 * PUBLIC_INTERFACE
 * TestSummary shows a simple submission summary: answers and violations.
 */
export default function TestSummary() {
  const { testId } = useParams();
  const [params] = useSearchParams();
  const session = params.get('session') || 'local';
  const loc = useLocation();
  const { answers = {}, violations = 0, auto = false } = loc.state || {};

  const columns = [
    { key: 'qid', title: 'Question ID', dataIndex: 'qid' },
    { key: 'answer', title: 'Answer', dataIndex: 'answer' },
  ];
  const data = Object.keys(answers).map((k) => ({ qid: k, answer: String(answers[k]) }));

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <Stepper steps={['Launch', 'Run', 'Summary']} current={2} />
      <Card title="Submission Summary">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontWeight: 700 }}>Test: {testId}</div>
          <div style={{ color: 'var(--text-muted)' }}>Session: {session}</div>
          <Tag color={auto ? 'warning' : 'success'}>{auto ? 'Auto-submitted' : 'Submitted'}</Tag>
          <Tag color={violations > 0 ? 'error' : 'success'}>Violations: {violations}</Tag>
          <div style={{ marginLeft: 'auto' }}>
            <Link to="/candidate">Go to Dashboard</Link>
          </div>
        </div>
        <Table columns={columns} data={data} />
      </Card>
    </div>
  );
}
