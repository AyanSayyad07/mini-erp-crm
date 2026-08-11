import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Products: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', sku: '', category: '', unit_price: '', current_stock: '', min_stock_alert: '', location: ''
  });

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products', { params: { search, category, limit: 100 } });
      setProducts(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/products', {
        ...formData,
        unit_price: Number(formData.unit_price),
        current_stock: Number(formData.current_stock),
        min_stock_alert: Number(formData.min_stock_alert)
      });
      setIsModalOpen(false);
      fetchProducts();
      setFormData({ name: '', sku: '', category: '', unit_price: '', current_stock: '', min_stock_alert: '', location: '' });
    } catch (err) {
      console.error(err);
      alert('Error creating product');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Products</h2>
        <button className="btn" onClick={() => setIsModalOpen(true)}>+ Add Product</button>
      </div>

      <div className="card" style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
        <input 
          type="text" 
          placeholder="Search name or SKU..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px', flex: 1, borderRadius: '4px', border: '1px solid var(--border-color)', outline: 'none' }}
        />
        <input 
          type="text" 
          placeholder="Category..." 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', outline: 'none' }}
        />
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Category</th>
              <th>Unit Price</th>
              <th>Stock</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const lowStock = p.current_stock <= p.min_stock_alert;
              return (
                <tr key={p.id}>
                  <td><strong>{p.sku}</strong></td>
                  <td>{p.name}</td>
                  <td>{p.category || '-'}</td>
                  <td>${Number(p.unit_price).toFixed(2)}</td>
                  <td>
                    {p.current_stock}
                    {lowStock && (
                      <span style={{ 
                        marginLeft: '10px', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', 
                        backgroundColor: '#fce8e6', color: '#c5221f', fontWeight: 'bold' 
                      }}>
                        Low Stock
                      </span>
                    )}
                  </td>
                  <td>{p.location || '-'}</td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center' }}>No products found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div className="card" style={modalContentStyle}>
            <h3 style={{ marginBottom: '20px' }}>Add New Product</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', gap: '15px' }}>
                <input type="text" name="name" placeholder="Name *" required value={formData.name} onChange={handleInputChange} style={inputStyle} />
                <input type="text" name="sku" placeholder="SKU *" required value={formData.sku} onChange={handleInputChange} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleInputChange} style={inputStyle} />
                <input type="number" name="unit_price" placeholder="Unit Price *" required step="0.01" value={formData.unit_price} onChange={handleInputChange} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <input type="number" name="current_stock" placeholder="Initial Stock" value={formData.current_stock} onChange={handleInputChange} style={inputStyle} />
                <input type="number" name="min_stock_alert" placeholder="Min Stock Alert" value={formData.min_stock_alert} onChange={handleInputChange} style={inputStyle} />
              </div>
              <input type="text" name="location" placeholder="Location (e.g., Aisle 4)" value={formData.location} onChange={handleInputChange} style={inputStyle} />
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn" style={{ backgroundColor: 'var(--text-muted)' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn">Save Product</button>
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
  width: '500px', maxHeight: '90vh', overflowY: 'auto'
};

const inputStyle = {
  padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', flex: 1, outline: 'none'
};

export default Products;
