import React from 'react';
import Card from '../../components/common/Card';
import KPIGrid from '../../components/common/KPIGrid';

const AdminDashboard = () => {
  return (
    <div className="container" style={{ display: 'grid', gap: 'var(--space-5)' }}>
      <KPIGrid />
      <Card title="Recent Activity">
        <div>Coming soon...</div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
