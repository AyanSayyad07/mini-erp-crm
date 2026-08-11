import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  padding: '16px 24px',
  textDecoration: 'none',
  color: isActive ? 'var(--text-dark)' : 'var(--text-muted)',
  backgroundColor: isActive ? 'var(--sidebar-active)' : 'transparent',
  borderRight: isActive ? '4px solid var(--accent-primary)' : '4px solid transparent',
  fontWeight: isActive ? 600 : 400,
  transition: 'all 0.2s ease',
  display: 'block'
});

const Layout: React.FC = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '260px', 
        backgroundColor: 'var(--sidebar-bg)', 
        borderRight: '1px solid var(--border-color)',
        padding: '30px 0',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h2 style={{ padding: '0 24px', marginBottom: '40px', color: 'var(--accent-secondary)' }}>Mini ERP</h2>
        <nav style={{ display: 'flex', flexDirection: 'column' }}>
          <NavLink to="/" style={navLinkStyle} end>Dashboard</NavLink>
          <NavLink to="/customers" style={navLinkStyle}>Customers</NavLink>
          <NavLink to="/products" style={navLinkStyle}>Products</NavLink>
          <NavLink to="/challans" style={navLinkStyle}>Sales Challans</NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
