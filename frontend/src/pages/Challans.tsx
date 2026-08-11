import React, { useState, useEffect } from 'react';
import { FileText, Plus, X, Search, FileSignature } from 'lucide-react';
import api from '../services/api';

const Challans: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('history');
  
  // History State
  const [challans, setChallans] = useState<any[]>([]);
  const [selectedChallan, setSelectedChallan] = useState<any>(null);

  // Create State
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [formData, setFormData] = useState({ customer_id: '', status: 'Draft' });
  const [items, setItems] = useState<any[]>([{ product_id: '', quantity: 1, unit_price: 0 }]);

  useEffect(() => {
    fetchChallans();
    fetchCustomersAndProducts();
  }, []);

  const fetchChallans = async () => {
    try {
      const res = await api.get('/challans');
      setChallans(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCustomersAndProducts = async () => {
    try {
      const custRes = await api.get('/customers', { params: { limit: 100 } });
      setCustomers(custRes.data.data);
      const prodRes = await api.get('/products', { params: { limit: 100 } });
      setProducts(prodRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const openChallanDetails = async (id: string) => {
    try {
      const res = await api.get(`/challans/${id}`);
      setSelectedChallan(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === 'product_id') {
      const product = products.find(p => p.id === Number(value));
      if (product) newItems[index].unit_price = Number(product.unit_price);
    }
    setItems(newItems);
  };

  const addItemRow = () => {
    setItems([...items, { product_id: '', quantity: 1, unit_price: 0 }]);
  };

  const removeItemRow = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleCreateChallan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payloadItems = items.map(i => ({ product_id: Number(i.product_id), quantity: Number(i.quantity) }));
      await api.post('/challans', {
        customer_id: Number(formData.customer_id),
        status: formData.status,
        items: payloadItems
      });
      alert('Challan created successfully!');
      setFormData({ customer_id: '', status: 'Draft' });
      setItems([{ product_id: '', quantity: 1, unit_price: 0 }]);
      fetchChallans();
      setActiveTab('history');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Error creating challan');
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  const totalQty = items.reduce((sum, item) => sum + Number(item.quantity), 0);

  return (
    <div>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
        <button 
          className="btn" 
          style={{ 
            backgroundColor: activeTab === 'history' ? 'var(--accent-primary)' : 'transparent', 
            color: activeTab === 'history' ? '#fff' : 'var(--text-muted)',
            boxShadow: activeTab === 'history' ? 'var(--shadow-sm)' : 'none',
            display: 'flex', alignItems: 'center', gap: '8px'
          }} 
          onClick={() => setActiveTab('history')}
        >
          <FileText size={18} /> Challan History
        </button>
        <button 
          className="btn" 
          style={{ 
            backgroundColor: activeTab === 'create' ? 'var(--accent-primary)' : 'transparent', 
            color: activeTab === 'create' ? '#fff' : 'var(--text-muted)',
            boxShadow: activeTab === 'create' ? 'var(--shadow-sm)' : 'none',
            display: 'flex', alignItems: 'center', gap: '8px'
          }} 
          onClick={() => setActiveTab('create')}
        >
          <Plus size={18} /> Create New Challan
        </button>
      </div>

      {activeTab === 'history' && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Challan #</th>
                <th>Customer</th>
                <th>Total Qty</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {challans.map((c) => (
                <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => openChallanDetails(c.id)}>
                  <td><strong>{c.challan_number}</strong></td>
                  <td>{c.customer_name || '-'}</td>
                  <td>{c.total_quantity}</td>
                  <td>
                    <span className={`badge ${c.status === 'Confirmed' ? 'badge-success' : 'badge-info'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td>{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {challans.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)' }}>
                      <FileSignature size={48} style={{ opacity: 0.2, marginBottom: '10px' }} />
                      <p style={{ fontSize: '16px', fontWeight: 500 }}>No challans generated yet</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileSignature size={24} color="var(--accent-secondary)" /> New Sales Challan
          </h2>
          <form onSubmit={handleCreateChallan} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 2 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '14px', color: 'var(--text-muted)' }}>Customer</label>
                <select className="modern-input" required value={formData.customer_id} onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}>
                  <option value="">Select Customer...</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name} - {c.business_name}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '14px', color: 'var(--text-muted)' }}>Status</label>
                <select className="modern-input" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <option value="Draft">Draft</option>
                  <option value="Confirmed">Confirmed</option>
                </select>
              </div>
            </div>

            <div style={{ border: '1px solid var(--border-color)', padding: '20px', borderRadius: '8px', backgroundColor: 'var(--hover-bg)' }}>
              <h4 style={{ marginBottom: '15px', color: 'var(--text-dark)' }}>Challan Items</h4>
              {items.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '15px', marginBottom: '15px', alignItems: 'center' }}>
                  <select className="modern-input" required value={item.product_id} onChange={(e) => handleItemChange(index, 'product_id', e.target.value)} style={{ flex: 2 }}>
                    <option value="">Select Product...</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.current_stock})</option>)}
                  </select>
                  <input type="number" className="modern-input" required min="1" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} style={{ flex: 1 }} placeholder="Qty" />
                  <div style={{ width: '100px', padding: '10px', backgroundColor: '#fff', borderRadius: '8px', textAlign: 'right', fontWeight: 500, border: '1px solid var(--border-color)' }}>
                    ${(item.quantity * item.unit_price).toFixed(2)}
                  </div>
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItemRow(index)} style={{ padding: '10px', cursor: 'pointer', backgroundColor: 'var(--danger-bg)', border: 'none', color: 'var(--danger-text)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addItemRow} className="btn" style={{ marginTop: '10px', backgroundColor: 'var(--accent-secondary)' }}>+ Add Item Row</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '18px', padding: '15px', backgroundColor: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <strong style={{ color: 'var(--text-dark)' }}>Total Qty: {totalQty} &nbsp;|&nbsp; Est. Total: <span style={{ color: 'var(--accent-primary)' }}>${totalAmount.toFixed(2)}</span></strong>
            </div>

            <button type="submit" className="btn" style={{ padding: '12px', fontSize: '16px' }}>Submit Challan</button>
          </form>
        </div>
      )}

      {selectedChallan && (
        <div style={modalOverlayStyle} onClick={() => setSelectedChallan(null)}>
          <div className="card" style={modalContentStyle} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><FileSignature size={24} color="var(--accent-primary)" /> Challan #{selectedChallan.challan_number}</h2>
              <button onClick={() => setSelectedChallan(null)} style={{ border: 'none', background: 'var(--hover-bg)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={18} color="var(--text-muted)" />
              </button>
            </div>
            <div style={{ display: 'flex', gap: '40px', marginBottom: '20px', backgroundColor: 'var(--bg-color)', padding: '15px', borderRadius: '8px' }}>
              <div style={{ flex: 1 }}>
                <p style={{ marginBottom: '8px' }}><strong style={{ color: 'var(--text-muted)' }}>Customer:</strong><br/>{selectedChallan.customer_name}</p>
                <p style={{ marginBottom: '8px' }}><strong style={{ color: 'var(--text-muted)' }}>Mobile:</strong><br/>{selectedChallan.mobile}</p>
                <p><strong style={{ color: 'var(--text-muted)' }}>Status:</strong><br/><span className={`badge ${selectedChallan.status === 'Confirmed' ? 'badge-success' : 'badge-info'}`}>{selectedChallan.status}</span></p>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ marginBottom: '8px' }}><strong style={{ color: 'var(--text-muted)' }}>Date:</strong><br/>{new Date(selectedChallan.created_at).toLocaleString()}</p>
                <p><strong style={{ color: 'var(--text-muted)' }}>Total Items:</strong><br/>{selectedChallan.total_quantity}</p>
              </div>
            </div>
            <h4 style={{ marginBottom: '10px', color: 'var(--text-dark)' }}>Items Snapshot</h4>
            <div className="table-container" style={{ boxShadow: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Unit Price</th>
                    <th>Quantity</th>
                    <th style={{ textAlign: 'right' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedChallan.items.map((i: any) => (
                    <tr key={i.id}>
                      <td>{i.product_name_snapshot}</td>
                      <td>${Number(i.unit_price_snapshot).toFixed(2)}</td>
                      <td>{i.quantity}</td>
                      <td style={{ textAlign: 'right', fontWeight: 500 }}>${(Number(i.unit_price_snapshot) * i.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
  width: '650px', maxHeight: '90vh', overflowY: 'auto'
};

export default Challans;
