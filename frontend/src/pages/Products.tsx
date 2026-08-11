import React from 'react';

const Products: React.FC = () => {
  return (
    <div style={{ padding: '30px', backgroundColor: 'var(--bg-color)', minHeight: '100%' }}>
      <h1>Products</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Manage your inventory here.</p>
    </div>
  );
};

export default Products;
