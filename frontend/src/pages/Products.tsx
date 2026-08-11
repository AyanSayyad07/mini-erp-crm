import React, { useState, useEffect } from 'react';
import { Search, Plus, Package, Filter } from 'lucide-react';
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Package size={28} color="var(--accent-secondary)" /> Products
        </h2>
        <button className="btn" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="card" style={{ marginBottom: '25px', display: 'flex', gap: '15px', alignItems: 'center', padding: '15px 20px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input 
            type="text" 
            className="modern-input"
            placeholder="Search name or SKU..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>
        <div style={{ position: 'relative', width: '200px' }}>
          <Filter size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input 
            type="text" 
            className="modern-input"
            placeholder="Category Filter..." 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>
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
                      <span className="badge badge-danger" style={{ marginLeft: '10px', fontSize: '11px', padding: '4px 8px' }}>
                        Low Stock
                      </span>
                    )}
                  </td>
                  <td>{p.location || '-'}</td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)' }}>
                    <Package size={48} style={{ opacity: 0.2, marginBottom: '10px' }} />
                    <p style={{ fontSize: '16px', fontWeight: 500 }}>No products found</p>
                    <p style={{ fontSize: '14px', marginTop: '5px' }}>Try adjusting your search or add a new product.</p>
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
            <h3 style={{ marginBottom: '20px' }}>Add New Product</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', gap: '15px' }}>
                <input type="text" className="modern-input" name="name" placeholder="Name *" required value={formData.name} onChange={handleInputChange} />
                <input type="text" className="modern-input" name="sku" placeholder="SKU *" required value={formData.sku} onChange={handleInputChange} />
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <input type="text" className="modern-input" name="category" placeholder="Category" value={formData.category} onChange={handleInputChange} />
                <input type="number" className="modern-input" name="unit_price" placeholder="Unit Price *" required step="0.01" value={formData.unit_price} onChange={handleInputChange} />
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <input type="number" className="modern-input" name="current_stock" placeholder="Initial Stock" value={formData.current_stock} onChange={handleInputChange} />
                <input type="number" className="modern-input" name="min_stock_alert" placeholder="Min Stock Alert" value={formData.min_stock_alert} onChange={handleInputChange} />
              </div>
              <input type="text" className="modern-input" name="location" placeholder="Location (e.g., Aisle 4)" value={formData.location} onChange={handleInputChange} />
              
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
  backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
  backdropFilter: 'blur(5px)'
};

const modalContentStyle: React.CSSProperties = {
  width: '500px', maxHeight: '90vh', overflowY: 'auto'
};

export default Products;
