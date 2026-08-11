import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div style={{ padding: '30px', backgroundColor: 'var(--bg-color)', minHeight: '100%' }}>
      <h1>Dashboard</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Welcome to the peaceful Operations Portal.</p>
    </div>
  );
};

export default Dashboard;
