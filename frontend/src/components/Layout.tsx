import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '260px', 
        backgroundColor: 'var(--sidebar-bg)', 
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '30px 24px 20px' }}>
          <h2 style={{ color: 'var(--accent-secondary)' }}>Mini ERP</h2>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <NavLink to="/" style={navLinkStyle} end>Dashboard</NavLink>
          <NavLink to="/customers" style={navLinkStyle}>Customers</NavLink>
          <NavLink to="/products" style={navLinkStyle}>Products</NavLink>
          <NavLink to="/challans" style={navLinkStyle}>Sales Challans</NavLink>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Navbar */}
        <header style={{ 
          height: '70px', 
          backgroundColor: 'var(--card-bg)', 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: '0 30px'
        }}>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                <strong style={{ color: 'var(--text-dark)' }}>{user.role}</strong> | {user.email}
              </span>
              <button className="btn" style={{ padding: '8px 16px', fontSize: '14px' }} onClick={handleLogout}>Logout</button>
            </div>
          )}
        </header>
        
        {/* Page Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
