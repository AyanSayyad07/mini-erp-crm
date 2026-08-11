import React from 'react';

const Customers: React.FC = () => {
  return (
    <div style={{ padding: '30px', backgroundColor: 'var(--bg-color)', minHeight: '100%' }}>
      <h1>Customers</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Manage your CRM contacts here.</p>
    </div>
  );
};

export default Customers;
