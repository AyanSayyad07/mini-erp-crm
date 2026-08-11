import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Package, FileText, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  padding: '16px 24px',
  textDecoration: 'none',
  color: isActive ? 'var(--text-dark)' : 'var(--text-muted)',
  backgroundColor: isActive ? 'var(--sidebar-active)' : 'transparent',
  borderRight: isActive ? '4px solid var(--accent-primary)' : '4px solid transparent',
  fontWeight: isActive ? 600 : 400,
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
});

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'transparent' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '260px', 
        backgroundColor: 'var(--sidebar-bg)', 
        borderRight: '1px solid rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-md)',
        zIndex: 10
      }}>
        <div style={{ padding: '30px 24px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LayoutDashboard size={20} color="white" />
          </div>
          <h2 style={{ color: 'var(--accent-secondary)', fontSize: '20px' }}>Mini ERP</h2>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', flex: 1, marginTop: '10px' }}>
          <NavLink to="/" style={navLinkStyle} end><LayoutDashboard size={20} /> Dashboard</NavLink>
          <NavLink to="/customers" style={navLinkStyle}><Users size={20} /> Customers</NavLink>
          <NavLink to="/products" style={navLinkStyle}><Package size={20} /> Products</NavLink>
          <NavLink to="/challans" style={navLinkStyle}><FileText size={20} /> Sales Challans</NavLink>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Navbar */}
        <header style={{ 
          height: '70px', 
          backgroundColor: 'var(--sidebar-bg)', 
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: '0 30px',
          boxShadow: 'var(--shadow-sm)',
          zIndex: 5
        }}>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                <strong style={{ color: 'var(--text-dark)' }}>{user.role}</strong> | {user.email}
              </span>
              <button className="btn" style={{ padding: '8px 16px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </header>
        
        {/* Page Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{ minHeight: '100%' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Layout;
