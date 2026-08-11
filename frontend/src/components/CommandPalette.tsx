import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LayoutDashboard, Users, Package, FileText, Shield, Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || '';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const allCommands = [
    { name: 'Dashboard', icon: LayoutDashboard, action: () => navigate('/') },
    ...( ['Admin', 'Sales'].includes(role) ? [{ name: 'Customers', icon: Users, action: () => navigate('/customers') }] : [] ),
    ...( ['Admin', 'Warehouse'].includes(role) ? [{ name: 'Products', icon: Package, action: () => navigate('/products') }] : [] ),
    ...( ['Admin', 'Sales', 'Accounts'].includes(role) ? [{ name: 'Sales Challans', icon: FileText, action: () => navigate('/challans') }] : [] ),
    ...( role === 'Admin' ? [{ name: 'User Management', icon: Shield, action: () => navigate('/users') }] : [] ),
    { name: `Toggle ${theme === 'dark' ? 'Light' : 'Dark'} Mode`, icon: theme === 'dark' ? Sun : Moon, action: toggleTheme },
  ];

  const filteredCommands = allCommands.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleExecute = (index: number) => {
    if (filteredCommands[index]) {
      filteredCommands[index].action();
      setIsOpen(false);
    }
  };

  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleExecute(selectedIndex);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
          display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '10vh',
          backdropFilter: 'blur(5px)'
        }}
        onClick={() => setIsOpen(false)}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="card"
          style={{ width: '100%', maxWidth: '500px', padding: 0, overflow: 'hidden' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid var(--border-color)' }}>
            <Search size={20} color="var(--text-muted)" style={{ marginRight: '10px' }} />
            <input 
              ref={inputRef}
              type="text" 
              placeholder="Type a command or search..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleMenuKeyDown}
              style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-dark)', fontSize: '16px', outline: 'none' }}
            />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', backgroundColor: 'var(--hover-bg)', padding: '2px 6px', borderRadius: '4px' }}>ESC</span>
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '10px 0' }}>
            {filteredCommands.length > 0 ? (
              filteredCommands.map((cmd, index) => {
                const Icon = cmd.icon;
                const isSelected = index === selectedIndex;
                return (
                  <div 
                    key={cmd.name}
                    onClick={() => handleExecute(index)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    style={{
                      padding: '12px 20px',
                      display: 'flex', alignItems: 'center', gap: '15px',
                      backgroundColor: isSelected ? 'var(--hover-bg)' : 'transparent',
                      color: isSelected ? 'var(--accent-primary)' : 'var(--text-dark)',
                      cursor: 'pointer',
                      transition: 'background-color 0.1s'
                    }}
                  >
                    <Icon size={18} />
                    <span style={{ fontWeight: 500 }}>{cmd.name}</span>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No commands found.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CommandPalette;
