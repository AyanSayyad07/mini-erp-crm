import React, { useState, useEffect } from 'react';
import { FileText, Plus, X, FileSignature, Download, LayoutTemplate, List } from 'lucide-react';
import toast from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Confetti from 'react-confetti';
import api from '../services/api';
import { generateInvoicePDF } from '../utils/pdf';

const COLUMNS = ['Draft', 'Confirmed', 'Delivered', 'Paid'];

const Challans: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('history');
  const [viewMode, setViewMode] = useState<'list' | 'board'>('board');
  
  // History State
  const [challans, setChallans] = useState<any[]>([]);
  const [selectedChallan, setSelectedChallan] = useState<any>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Create State
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [formData, setFormData] = useState({ customer_id: '', status: 'Draft' });
  const [items, setItems] = useState<any[]>([{ product_id: '', quantity: 1, unit_price: 0 }]);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const canCreateChallan = ['Admin', 'Sales'].includes(user.role);

  useEffect(() => {
    fetchChallans();
    fetchCustomersAndProducts();
  }, []);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

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
      setCustomers(custRes.data.data || custRes.data);
      const prodRes = await api.get('/products', { params: { limit: 100 } });
      setProducts(prodRes.data.data || prodRes.data);
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
      toast.success('Challan created successfully!');
      setFormData({ customer_id: '', status: 'Draft' });
      setItems([{ product_id: '', quantity: 1, unit_price: 0 }]);
      fetchChallans();
      setActiveTab('history');
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error creating challan');
    }
  };

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    
    // Optimistic UI update
    const previousChallans = [...challans];
    const updatedChallans = challans.map(c => {
      if (c.id === Number(draggableId)) {
        return { ...c, status: newStatus };
      }
      return c;
    });
    setChallans(updatedChallans);

    if (newStatus === 'Delivered' || newStatus === 'Paid') {
      setShowConfetti(true);
    }

    try {
      await api.put(`/challans/${draggableId}/status`, { status: newStatus });
      toast.success(`Challan moved to ${newStatus}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
      setChallans(previousChallans); // Rollback
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  const totalQty = items.reduce((sum, item) => sum + Number(item.quantity), 0);

  const renderKanbanBoard = () => {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
          {COLUMNS.map(col => {
            const colChallans = challans.filter(c => c.status === col || (!COLUMNS.includes(c.status) && col === 'Draft'));
            return (
              <Droppable key={col} droppableId={col}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      flex: 1,
                      minWidth: '280px',
                      backgroundColor: snapshot.isDraggingOver ? 'var(--hover-bg)' : 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '15px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '15px',
                      transition: 'background-color 0.2s ease',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '15px', color: 'var(--text-dark)' }}>
                      {col} <span style={{ backgroundColor: 'var(--bg-color)', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>{colChallans.length}</span>
                    </h3>
                    
                    <div style={{ minHeight: '100px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {colChallans.map((c, index) => (
                        <Draggable key={c.id.toString()} draggableId={c.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => openChallanDetails(c.id)}
                              style={{
                                padding: '15px',
                                backgroundColor: 'var(--bg-color)',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                cursor: 'grab',
                                boxShadow: snapshot.isDragging ? 'var(--shadow-lg)' : 'none',
                                transform: snapshot.isDragging ? 'scale(1.02)' : 'scale(1)',
                                ...provided.draggableProps.style
                              }}
                            >
                              <div style={{ fontWeight: 600, color: 'var(--text-dark)', marginBottom: '5px' }}>{c.challan_number}</div>
                              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>{c.customer_name || 'Unknown'}</div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                                <span style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>Qty: {c.total_quantity}</span>
                                <span style={{ color: 'var(--text-muted)' }}>{new Date(c.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    );
  };

  const renderTableView = () => (
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
                <span className={`badge ${c.status === 'Confirmed' || c.status === 'Paid' ? 'badge-success' : c.status === 'Delivered' ? 'badge-info' : 'badge-warning'}`}>
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
  );

  return (
    <div>
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={500} />}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
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
          {canCreateChallan && (
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
          )}
        </div>

        {activeTab === 'history' && (
          <div style={{ display: 'flex', backgroundColor: 'var(--hover-bg)', padding: '4px', borderRadius: '8px' }}>
            <button onClick={() => setViewMode('board')} style={{ padding: '6px 12px', border: 'none', background: viewMode === 'board' ? 'var(--card-bg)' : 'transparent', color: viewMode === 'board' ? 'var(--text-dark)' : 'var(--text-muted)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: viewMode === 'board' ? 'var(--shadow-sm)' : 'none', transition: 'all 0.2s' }}>
              <LayoutTemplate size={16} /> Board
            </button>
            <button onClick={() => setViewMode('list')} style={{ padding: '6px 12px', border: 'none', background: viewMode === 'list' ? 'var(--card-bg)' : 'transparent', color: viewMode === 'list' ? 'var(--text-dark)' : 'var(--text-muted)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: viewMode === 'list' ? 'var(--shadow-sm)' : 'none', transition: 'all 0.2s' }}>
              <List size={16} /> List
            </button>
          </div>
        )}
      </div>

      {activeTab === 'history' && (
        viewMode === 'board' ? renderKanbanBoard() : renderTableView()
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
                  <div style={{ width: '100px', padding: '10px', backgroundColor: '#fff', borderRadius: '8px', textAlign: 'right', fontWeight: 500, border: '1px solid var(--border-color)', color: '#000' }}>
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
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn" onClick={() => generateInvoicePDF(selectedChallan)} style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-dark)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', fontSize: '14px' }}>
                  <Download size={16} /> Download PDF
                </button>
                <button onClick={() => setSelectedChallan(null)} style={{ border: 'none', background: 'var(--hover-bg)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={18} color="var(--text-muted)" />
                </button>
              </div>
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
