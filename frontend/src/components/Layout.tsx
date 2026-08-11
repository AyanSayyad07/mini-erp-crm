import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Package, FileText, LogOut, Sun, Moon, Menu, X, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import CommandPalette from './CommandPalette';

const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  padding: '16px 24px',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
  textDecoration: 'none',
  fontWeight: isActive ? 600 : 500,
  backgroundColor: isActive ? 'var(--sidebar-active)' : 'transparent',
  borderRight: isActive ? '4px solid var(--accent-primary)' : '4px solid transparent',
  transition: 'all 0.3s ease',
  fontSize: '15px'
});

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <CommandPalette />
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }}
        />
      )}

      {/* Sidebar */}
      <aside 
        className="sidebar"
        style={{ 
          width: '260px', 
          backgroundColor: 'var(--sidebar-bg)', 
          borderRight: '1px solid var(--border-glass)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 50,
          position: 'fixed',
          top: 0, bottom: 0, left: 0,
          transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(0)',
          transition: 'transform 0.3s ease',
        }}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.svg" alt="Loop Distribution.co Logo" style={{ width: '32px', height: '32px' }} />
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '-0.5px' }}>Loop Distribution.co</h2>
          </div>
          <button className="mobile-close" onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
        </div>
        
        <nav style={{ flex: 1, paddingTop: '20px', display: 'flex', flexDirection: 'column' }}>
          <NavLink to="/" style={navLinkStyle} end onClick={() => setIsMobileMenuOpen(false)}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          {['Admin', 'Sales'].includes(user.role) && (
            <NavLink to="/customers" style={navLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>
              <Users size={20} /> Customers
            </NavLink>
          )}
          {['Admin', 'Warehouse'].includes(user.role) && (
            <NavLink to="/products" style={navLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>
              <Package size={20} /> Products
            </NavLink>
          )}
          {['Admin', 'Sales', 'Accounts'].includes(user.role) && (
            <NavLink to="/challans" style={navLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>
              <FileText size={20} /> Sales Challans
            </NavLink>
          )}
          {user.role === 'Admin' && (
            <NavLink to="/users" style={navLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>
              <Shield size={20} /> Users
            </NavLink>
          )}
        </nav>
        
        <div style={{ padding: '20px', borderTop: '1px solid var(--border-glass)' }}>
          <button 
            onClick={handleLogout}
            style={{ 
              width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              backgroundColor: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '260px' }} className="main-content">
        <header style={{ 
          height: '70px', 
          backgroundColor: 'var(--sidebar-bg)', 
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 30px',
          boxShadow: 'var(--shadow-sm)',
          zIndex: 5,
          gap: '20px'
        }}>
          <button className="mobile-open" onClick={() => setIsMobileMenuOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--text-dark)', cursor: 'pointer' }}>
            <Menu size={24} />
          </button>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginLeft: 'auto' }}>
            <button 
              onClick={toggleTheme} 
              style={{ 
                background: 'transparent', border: 'none', cursor: 'pointer', 
                color: 'var(--text-muted)', display: 'flex', alignItems: 'center' 
              }}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', borderLeft: '1px solid var(--border-color)', paddingLeft: '20px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                  <strong style={{ color: 'var(--text-dark)' }}>{user.role}</strong> | {user.email}
                </span>
              </div>
            )}
          </div>
        </header>

        <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .sidebar {
            transform: ${isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)'} !important;
          }
          .main-content {
            margin-left: 0 !important;
          }
          .mobile-close {
            display: block !important;
          }
          .mobile-open {
            display: block !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-close {
            display: none !important;
          }
          .mobile-open {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
