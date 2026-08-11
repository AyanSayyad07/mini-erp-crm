import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-color)' }}>
      <div className="card" style={{ width: '400px', padding: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--accent-secondary)' }}>Welcome to Mini ERP</h2>
        {error && <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center', fontSize: '14px' }}>{error}</div>}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', outline: 'none' }}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', outline: 'none' }}
            required
          />
          <button className="btn" type="submit">Log In</button>
        </form>

        <div style={{ marginTop: '30px' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '10px', textAlign: 'center' }}>Quick Test Logins</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            <button onClick={() => prefill('admin@test.com')} style={testBtnStyle}>Admin</button>
            <button onClick={() => prefill('sales@test.com')} style={testBtnStyle}>Sales</button>
            <button onClick={() => prefill('warehouse@test.com')} style={testBtnStyle}>Warehouse</button>
            <button onClick={() => prefill('accounts@test.com')} style={testBtnStyle}>Accounts</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const testBtnStyle = {
  padding: '6px 12px',
  fontSize: '12px',
  backgroundColor: 'var(--hover-bg)',
  border: '1px solid var(--accent-primary)',
  color: 'var(--text-dark)',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default Login;
