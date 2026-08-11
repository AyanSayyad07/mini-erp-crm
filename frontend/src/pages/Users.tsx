import React, { useState, useEffect } from 'react';
import { Shield, Plus, Users as UsersIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const Users: React.FC = () => {
  const [usersList, setUsersList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', role: 'Sales' });

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsersList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users', formData);
      setIsModalOpen(false);
      fetchUsers();
      toast.success('User created successfully!');
      setFormData({ email: '', password: '', role: 'Sales' });
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error creating user');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={28} color="var(--accent-secondary)" /> User Management
        </h2>
        <button className="btn" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add User
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td><strong>{u.email}</strong></td>
                <td>
                  <span className={`badge ${u.role === 'Admin' ? 'badge-danger' : u.role === 'Sales' ? 'badge-info' : 'badge-success'}`}>
                    {u.role}
                  </span>
                </td>
                <td>{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {usersList.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)' }}>
                    <UsersIcon size={48} style={{ opacity: 0.2, marginBottom: '10px' }} />
                    <p style={{ fontSize: '16px', fontWeight: 500 }}>No users found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div className="card" style={modalContentStyle}>
            <h3 style={{ marginBottom: '20px' }}>Add New User</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="email" className="modern-input" name="email" placeholder="Email Address *" required value={formData.email} onChange={handleInputChange} />
              <input type="password" className="modern-input" name="password" placeholder="Password *" required value={formData.password} onChange={handleInputChange} />
              <select name="role" className="modern-input" value={formData.role} onChange={handleInputChange}>
                <option value="Admin">Admin</option>
                <option value="Sales">Sales</option>
                <option value="Warehouse">Warehouse</option>
                <option value="Accounts">Accounts</option>
              </select>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn" style={{ backgroundColor: 'var(--text-muted)' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn">Save User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
  backdropFilter: 'blur(5px)'
};

const modalContentStyle: React.CSSProperties = {
  width: '500px', maxHeight: '90vh', overflowY: 'auto'
};

export default Users;
