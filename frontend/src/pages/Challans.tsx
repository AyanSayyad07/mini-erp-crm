import React, { useState, useEffect } from 'react';
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
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <button className="btn" style={{ backgroundColor: activeTab === 'history' ? 'var(--accent-primary)' : 'var(--card-bg)', color: activeTab === 'history' ? '#fff' : 'var(--text-dark)' }} onClick={() => setActiveTab('history')}>Challan History</button>
        <button className="btn" style={{ backgroundColor: activeTab === 'create' ? 'var(--accent-primary)' : 'var(--card-bg)', color: activeTab === 'create' ? '#fff' : 'var(--text-dark)' }} onClick={() => setActiveTab('create')}>Create New Challan</button>
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
                    <span style={{
                      padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600,
                      backgroundColor: c.status === 'Confirmed' ? '#e6f4ea' : '#e8f0fe',
                      color: c.status === 'Confirmed' ? '#137333' : '#1967d2'
                    }}>
                      {c.status}
                    </span>
                  </td>
                  <td>{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {challans.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center' }}>No challans found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="card">
          <h2 style={{ marginBottom: '20px' }}>New Sales Challan</h2>
          <form onSubmit={handleCreateChallan} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Customer</label>
                <select required value={formData.customer_id} onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })} style={inputStyle}>
                  <option value="">Select Customer...</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name} - {c.business_name}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={inputStyle}>
                  <option value="Draft">Draft</option>
                  <option value="Confirmed">Confirmed</option>
                </select>
              </div>
            </div>

            <div style={{ border: '1px solid var(--border-color)', padding: '15px', borderRadius: '4px' }}>
              <h4 style={{ marginBottom: '15px' }}>Items</h4>
              {items.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '15px', marginBottom: '10px', alignItems: 'center' }}>
                  <select required value={item.product_id} onChange={(e) => handleItemChange(index, 'product_id', e.target.value)} style={{ ...inputStyle, flex: 2 }}>
                    <option value="">Select Product...</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.current_stock})</option>)}
                  </select>
                  <input type="number" required min="1" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder="Qty" />
                  <div style={{ flex: 1, padding: '10px', backgroundColor: 'var(--bg-color)', borderRadius: '4px', textAlign: 'right' }}>
                    ${(item.quantity * item.unit_price).toFixed(2)}
                  </div>
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItemRow(index)} style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#fce8e6', border: 'none', color: '#c5221f', borderRadius: '4px' }}>X</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addItemRow} className="btn" style={{ marginTop: '10px', backgroundColor: 'var(--accent-secondary)' }}>+ Add Item Row</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '18px' }}>
              <strong>Total Qty: {totalQty} &nbsp;|&nbsp; Est. Total: ${totalAmount.toFixed(2)}</strong>
            </div>

            <button type="submit" className="btn" style={{ padding: '12px', fontSize: '16px' }}>Submit Challan</button>
          </form>
        </div>
      )}

      {selectedChallan && (
        <div style={modalOverlayStyle} onClick={() => setSelectedChallan(null)}>
          <div className="card" style={modalContentStyle} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>Challan {selectedChallan.challan_number}</h2>
              <button onClick={() => setSelectedChallan(null)} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>&times;</button>
            </div>
            <div style={{ display: 'flex', gap: '40px', marginBottom: '20px' }}>
              <div>
                <p><strong>Customer:</strong> {selectedChallan.customer_name}</p>
                <p><strong>Mobile:</strong> {selectedChallan.mobile}</p>
                <p><strong>Status:</strong> {selectedChallan.status}</p>
              </div>
              <div>
                <p><strong>Date:</strong> {new Date(selectedChallan.created_at).toLocaleString()}</p>
                <p><strong>Total Items:</strong> {selectedChallan.total_quantity}</p>
              </div>
            </div>
            <h4>Items Snapshot</h4>
            <table className="table" style={{ marginTop: '10px' }}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Unit Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedChallan.items.map((i: any) => (
                  <tr key={i.id}>
                    <td>{i.product_name_snapshot}</td>
                    <td>${Number(i.unit_price_snapshot).toFixed(2)}</td>
                    <td>{i.quantity}</td>
                    <td>${(Number(i.unit_price_snapshot) * i.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
  padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', outline: 'none', width: '100%', boxSizing: 'border-box'
};

export default Challans;
