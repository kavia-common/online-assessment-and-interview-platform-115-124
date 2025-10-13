import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="container">
      <h1 className="h1">Admin Dashboard</h1>
      <p className="muted">Manage question banks, users, reports, and system maintenance.</p>
      <div className="card" style={{ padding: 16, marginTop: 12 }}>
        <ul>
          <li>Question Bank management</li>
          <li>User administration</li>
          <li>Reports and exports</li>
          <li>Backup/Restore</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
