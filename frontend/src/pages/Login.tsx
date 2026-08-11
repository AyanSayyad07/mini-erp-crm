import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import api from '../services/api';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password_hash: password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const prefill = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('password123');
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      backgroundColor: 'var(--bg-color)',
      overflow: 'hidden'
    }}>
      {/* Animated Graphic Side */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
        color: 'white',
        position: 'relative',
        transition: 'background 0.5s ease'
      }}>
        {/* Theme Toggle on Login Page */}
        <button 
          onClick={toggleTheme} 
          style={{ 
            position: 'absolute', top: '30px', left: '30px', zIndex: 10,
            background: 'rgba(255, 255, 255, 0.2)', border: 'none', cursor: 'pointer', 
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '40px', height: '40px', borderRadius: '50%', backdropFilter: 'blur(5px)'
          }}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{ zIndex: 2, textAlign: 'center' }}
        >
          <img src="/logo.svg" alt="Loop Logo" style={{ width: '80px', height: '80px', marginBottom: '20px', opacity: 0.9 }} />
          <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '10px' }}>Loop Distribution.co</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>Secure. Fast. Intuitive.</p>
        </motion.div>
        
        {/* Abstract Floating Circles */}
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', top: '20%', left: '20%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}
        />
        <motion.div 
          animate={{ y: [0, 30, 0], opacity: [0.2, 0.5, 0.2] }} 
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{ position: 'absolute', bottom: '20%', right: '20%', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}
        />
      </div>

      {/* Login Form Side */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}>
        <motion.div 
          className="card" 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ width: '100%', maxWidth: '420px', padding: '40px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--hover-bg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', marginBottom: '16px' }}>
              <User size={24} />
            </div>
            <h2 style={{ color: 'var(--text-dark)', fontSize: '24px' }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '5px' }}>Please enter your details to sign in.</p>
          </div>
          
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ backgroundColor: '#fce8e6', color: '#c5221f', padding: '10px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center', fontSize: '14px', fontWeight: 500 }}>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-dark)', marginBottom: '6px' }}>Email Address</label>
              <input 
                type="email" 
                className="modern-input"
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-dark)', marginBottom: '6px' }}>Password</label>
              <input 
                type="password" 
                className="modern-input"
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="btn" type="submit" style={{ width: '100%', padding: '12px', fontSize: '16px', marginTop: '10px' }}>Sign In</button>
          </form>

          <div style={{ marginTop: '40px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '15px', textAlign: 'center' }}>Or continue with a test account</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button onClick={() => prefill('admin@test.com')} style={testBtnStyle}>Admin</button>
              <button onClick={() => prefill('sales@test.com')} style={testBtnStyle}>Sales</button>
              <button onClick={() => prefill('warehouse@test.com')} style={testBtnStyle}>Warehouse</button>
              <button onClick={() => prefill('accounts@test.com')} style={testBtnStyle}>Accounts</button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const testBtnStyle = {
  padding: '8px',
  fontSize: '13px',
  backgroundColor: 'var(--bg-color)',
  border: '1px solid var(--border-color)',
  color: 'var(--text-dark)',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
};

export default Login;
