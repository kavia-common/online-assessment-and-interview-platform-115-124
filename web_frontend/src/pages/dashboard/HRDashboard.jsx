import React from 'react';
import Card from '../../components/common/Card';
import KPIGrid from '../../components/common/KPIGrid';

const HRDashboard = () => {
  return (
    <div className="container" style={{ display: 'grid', gap: 'var(--space-5)' }}>
      <KPIGrid />
      <Card title="Overview">
        <div>Monitor tests and configure patterns.</div>
      </Card>
    </div>
  );
};

export default HRDashboard;
