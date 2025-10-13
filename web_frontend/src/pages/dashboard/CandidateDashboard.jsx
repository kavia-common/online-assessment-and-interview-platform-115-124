import React from 'react';
import Card from '../../components/common/Card';
import KPIGrid from '../../components/common/KPIGrid';

const CandidateDashboard = () => {
  return (
    <div className="container" style={{ display: 'grid', gap: 'var(--space-5)' }}>
      <KPIGrid />
      <Card title="Next Steps">
        <div>Complete your profile and start tests.</div>
      </Card>
    </div>
  );
};

export default CandidateDashboard;
