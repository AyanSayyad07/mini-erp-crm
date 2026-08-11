import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', mobile: '', email: '', business_name: '', gst_number: '', 
    customer_type: 'Retail', address: '', status: 'Lead', follow_up_date: '', notes: ''
  });

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers', { params: { search, status, limit: 100 } });
      setCustomers(res.data.data);
    } catch (err) {
      console.error(err);
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
      // Reset form
      setFormData({
        name: '', mobile: '', email: '', business_name: '', gst_number: '', 
        customer_type: 'Retail', address: '', status: 'Lead', follow_up_date: '', notes: ''
      });
    } catch (err) {
      console.error(err);
      alert('Error creating customer');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Customers</h2>
        <button className="btn" onClick={() => setIsModalOpen(true)}>+ Add Customer</button>
      </div>

      <div className="card" style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
        <input 
          type="text" 
          placeholder="Search name, mobile, business..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px', flex: 1, borderRadius: '4px', border: '1px solid var(--border-color)', outline: 'none' }}
        />
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', outline: 'none' }}
        >
          <option value="">All Statuses</option>
          <option value="Lead">Lead</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
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
            {customers.map((c) => (
              <tr key={c.id}>
                <td>
                  <strong>{c.name}</strong><br/>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{c.email}</span>
                </td>
                <td>{c.business_name || '-'}</td>
                <td>{c.mobile}</td>
                <td>{c.customer_type}</td>
                <td>
                  <span style={{
                    padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600,
                    backgroundColor: c.status === 'Active' ? '#e6f4ea' : c.status === 'Lead' ? '#e8f0fe' : '#fce8e6',
                    color: c.status === 'Active' ? '#137333' : c.status === 'Lead' ? '#1967d2' : '#c5221f'
                  }}>
                    {c.status}
                  </span>
                </td>
                <td>{c.follow_up_date ? new Date(c.follow_up_date).toLocaleDateString() : '-'}</td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center' }}>No customers found</td></tr>
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
                <input type="text" name="name" placeholder="Name *" required value={formData.name} onChange={handleInputChange} style={inputStyle} />
                <input type="text" name="mobile" placeholder="Mobile *" required value={formData.mobile} onChange={handleInputChange} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} style={inputStyle} />
                <input type="text" name="business_name" placeholder="Business Name" value={formData.business_name} onChange={handleInputChange} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <input type="text" name="gst_number" placeholder="GST Number" value={formData.gst_number} onChange={handleInputChange} style={inputStyle} />
                <select name="customer_type" value={formData.customer_type} onChange={handleInputChange} style={inputStyle}>
                  <option value="Retail">Retail</option>
                  <option value="Wholesale">Wholesale</option>
                  <option value="Distributor">Distributor</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <select name="status" value={formData.status} onChange={handleInputChange} style={inputStyle}>
                  <option value="Lead">Lead</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <input type="date" name="follow_up_date" value={formData.follow_up_date} onChange={handleInputChange} style={inputStyle} />
              </div>
              <textarea name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} style={{ ...inputStyle, minHeight: '60px' }} />
              <textarea name="notes" placeholder="Notes" value={formData.notes} onChange={handleInputChange} style={{ ...inputStyle, minHeight: '60px' }} />
              
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
  backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
};

const modalContentStyle: React.CSSProperties = {
  width: '600px', maxHeight: '90vh', overflowY: 'auto'
};

const inputStyle = {
  padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', flex: 1, outline: 'none'
};

export default Customers;
