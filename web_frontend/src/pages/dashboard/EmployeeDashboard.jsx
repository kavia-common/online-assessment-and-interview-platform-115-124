import React from 'react';
import Card from '../../components/common/Card';
import KPIGrid from '../../components/common/KPIGrid';

const EmployeeDashboard = () => {
  return (
    <div className="container" style={{ display: 'grid', gap: 'var(--space-5)' }}>
      <KPIGrid />
      <Card title="Assigned Tasks">
        <div>Review candidate tests.</div>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;
