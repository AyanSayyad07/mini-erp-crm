import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Package, FileText, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const kpiData = [
    { title: 'Total Customers', value: '1,284', change: '+12.5%', isUp: true, icon: Users, color: '#3b82f6' },
    { title: 'Monthly Revenue', value: '$45,231', change: '+8.2%', isUp: true, icon: DollarSign, color: '#10b981' },
    { title: 'Active Products', value: '852', change: '-2.4%', isUp: false, icon: Package, color: '#f59e0b' },
    { title: 'Open Challans', value: '34', change: '+18.1%', isUp: true, icon: FileText, color: '#8b5cf6' }
  ];

  const recentActivity = [
    { id: 1, action: 'New customer added', target: 'Acme Corp', time: '2 hours ago', icon: Users },
    { id: 2, action: 'Challan created', target: '#CHL-2023-089', time: '5 hours ago', icon: FileText },
    { id: 3, action: 'Stock updated', target: 'SKU-LPT-001 (+50)', time: 'Yesterday', icon: Package },
    { id: 4, action: 'Payment received', target: '$5,000 from Smith Ltd', time: 'Yesterday', icon: DollarSign }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', color: 'var(--text-dark)' }}>
          Good afternoon{user ? `, ${user.role}` : ''}!
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '5px' }}>Here is what's happening with your operations today.</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}
      >
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div key={index} variants={itemVariants} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>{kpi.title}</p>
                  <h3 style={{ fontSize: '28px', color: 'var(--text-dark)', marginTop: '5px' }}>{kpi.value}</h3>
                </div>
                <div style={{ padding: '10px', backgroundColor: `${kpi.color}15`, borderRadius: '10px', color: kpi.color }}>
                  <Icon size={24} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: 500, color: kpi.isUp ? '#10b981' : '#ef4444' }}>
                {kpi.isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                <span>{kpi.change}</span>
                <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: '5px' }}>vs last month</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={20} color="var(--accent-secondary)" /> Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <div style={{ padding: '8px', backgroundColor: 'var(--hover-bg)', borderRadius: '8px', color: 'var(--accent-primary)', marginTop: '2px' }}>
                    <Icon size={18} />
                  </div>
                  <div style={{ flex: 1, borderBottom: index < recentActivity.length - 1 ? '1px solid var(--border-color)' : 'none', paddingBottom: index < recentActivity.length - 1 ? '15px' : '0' }}>
                    <p style={{ fontSize: '14px', color: 'var(--text-dark)', fontWeight: 500 }}>
                      {activity.action} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>— {activity.target}</span>
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
