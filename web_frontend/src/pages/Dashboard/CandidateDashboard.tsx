import React from 'react';
import Stepper from '../../components/common/Stepper';

const CandidateDashboard: React.FC = () => {
  const steps = [
    { key: 'profile', label: 'Profile' },
    { key: 'instructions', label: 'Instructions' },
    { key: 'test', label: 'Test' },
    { key: 'summary', label: 'Summary' },
  ];
  return (
    <div className="container">
      <h1 className="h1">Candidate Dashboard</h1>
      <p className="muted">Welcome! Follow the steps to complete your assessment.</p>
      <div className="card" style={{ padding: 16, marginTop: 12 }}>
        <Stepper steps={steps} activeIndex={0} />
        <div style={{ marginTop: 12 }}>
          <div className="badge">Status: Ready</div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
