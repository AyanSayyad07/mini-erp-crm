import React, { useState, useEffect } from 'react';
import { Search, Plus, Users, Filter, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { exportToCSV } from '../utils/export';
import Skeleton from '../components/Skeleton';

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', mobile: '', email: '', business_name: '', gst_number: '', 
    customer_type: 'Retail', address: '', status: 'Lead', follow_up_date: '', notes: ''
  });
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const canAddCustomer = ['Admin', 'Sales'].includes(user.role);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/customers', { params: { search, status } });
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search, status]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/customers', formData);
      setIsModalOpen(false);
      fetchCustomers();
      toast.success('Customer created successfully!');
      // Reset form
      setFormData({
        name: '', mobile: '', email: '', business_name: '', gst_number: '', 
        customer_type: 'Retail', address: '', status: 'Lead', follow_up_date: '', notes: ''
      });
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error creating customer');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Users size={28} color="var(--accent-secondary)" /> Customers</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn" onClick={() => exportToCSV(customers, 'customers.csv')} style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-dark)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={18} /> Export CSV
          </button>
          {canAddCustomer && (
            <button className="btn" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={18} /> Add Customer
            </button>
          )}
        </div>
      </div>

      <div className="card" style={{ marginBottom: '25px', display: 'flex', gap: '15px', alignItems: 'center', padding: '15px 20px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input 
            type="text" 
            className="modern-input"
            placeholder="Search name, mobile, business..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>
        <div style={{ position: 'relative', width: '200px' }}>
          <Filter size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <select 
            className="modern-input"
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            style={{ paddingLeft: '40px', appearance: 'none' }}
          >
            <option value="">All Statuses</option>
            <option value="Lead">Lead</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Business</th>
              <th>Mobile</th>
              <th>Type</th>
              <th>Status</th>
              <th>Follow Up</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i}>
                  <td><Skeleton width="150px" height="20px" /></td>
                  <td><Skeleton width="120px" height="20px" /></td>
                  <td><Skeleton width="100px" height="20px" /></td>
                  <td><Skeleton width="60px" height="20px" /></td>
                  <td><Skeleton width="80px" height="24px" borderRadius="12px" /></td>
                  <td><Skeleton width="100px" height="20px" /></td>
                </tr>
              ))
            ) : (
              customers.map((c) => (
                <tr key={c.id}>
                  <td>
                    <strong>{c.name}</strong><br/>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{c.email}</span>
                  </td>
                  <td>{c.business_name || '-'}</td>
                  <td>{c.mobile}</td>
                  <td>{c.customer_type}</td>
                  <td>
                    <span className={`badge ${c.status === 'Active' ? 'badge-success' : c.status === 'Inactive' ? 'badge-danger' : 'badge-info'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td>{c.follow_up_date ? new Date(c.follow_up_date).toLocaleDateString() : '-'}</td>
                </tr>
              ))
            )}
            {!loading && customers.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)' }}>
                    <Users size={48} style={{ opacity: 0.2, marginBottom: '10px' }} />
                    <p style={{ fontSize: '16px', fontWeight: 500 }}>No customers found</p>
                    <p style={{ fontSize: '14px', marginTop: '5px' }}>Try adjusting your search or add a new customer.</p>
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
            <h3 style={{ marginBottom: '20px' }}>Add New Customer</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', gap: '15px' }}>
                <input type="text" className="modern-input" name="name" placeholder="Name *" required value={formData.name} onChange={handleInputChange} />
                <input type="text" className="modern-input" name="mobile" placeholder="Mobile *" required value={formData.mobile} onChange={handleInputChange} />
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <input type="email" className="modern-input" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
                <input type="text" className="modern-input" name="business_name" placeholder="Business Name" value={formData.business_name} onChange={handleInputChange} />
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <input type="text" className="modern-input" name="gst_number" placeholder="GST Number" value={formData.gst_number} onChange={handleInputChange} />
                <select name="customer_type" className="modern-input" value={formData.customer_type} onChange={handleInputChange}>
                  <option value="Retail">Retail</option>
                  <option value="Wholesale">Wholesale</option>
                  <option value="Distributor">Distributor</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <select name="status" className="modern-input" value={formData.status} onChange={handleInputChange}>
                  <option value="Lead">Lead</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <input type="date" className="modern-input" name="follow_up_date" value={formData.follow_up_date} onChange={handleInputChange} />
              </div>
              <textarea name="address" className="modern-input" placeholder="Address" value={formData.address} onChange={handleInputChange} style={{ minHeight: '60px' }} />
              <textarea name="notes" className="modern-input" placeholder="Notes" value={formData.notes} onChange={handleInputChange} style={{ minHeight: '60px' }} />
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn" style={{ backgroundColor: 'var(--text-muted)' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn">Save Customer</button>
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
  width: '600px', maxHeight: '90vh', overflowY: 'auto'
};

export default Customers;
