import React from 'react';

const HRDashboard: React.FC = () => {
  return (
    <div className="container">
      <h1 className="h1">HR Dashboard</h1>
      <p className="muted">Set up tests, manage candidates, monitor sessions, and analyze results.</p>
      <div className="card" style={{ padding: 16, marginTop: 12 }}>
        <ul>
          <li>Test Setup & Configuration</li>
          <li>Bulk Upload</li>
          <li>Monitoring</li>
          <li>Emails & Results</li>
        </ul>
      </div>
    </div>
  );
};

export default HRDashboard;
