import React from 'react';

const EmployeeDashboard: React.FC = () => {
  return (
    <div className="container">
      <h1 className="h1">Employee Dashboard</h1>
      <p className="muted">Review candidate tests, participate in interviews, and chat with HR/Admin.</p>
      <div className="card" style={{ padding: 16, marginTop: 12 }}>
        <ul>
          <li>Assigned Reviews</li>
          <li>Interview schedule</li>
          <li>Chat</li>
        </ul>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
