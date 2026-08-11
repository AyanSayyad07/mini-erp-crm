import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Package, FileText, ArrowUpRight, ArrowDownRight, Clock, Activity, PieChart as PieChartIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useTheme } from '../hooks/useTheme';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const kpiData = [
    { title: 'Total Customers', value: '1,284', change: '+12.5%', isUp: true, icon: Users, color: '#3b82f6', show: true },
    { title: 'Monthly Revenue', value: '$45,231', change: '+8.2%', isUp: true, icon: DollarSign, color: '#10b981', show: user?.role !== 'Warehouse' },
    { title: 'Active Products', value: '852', change: '-2.4%', isUp: false, icon: Package, color: '#f59e0b', show: true },
    { title: 'Open Challans', value: '34', change: '+18.1%', isUp: true, icon: FileText, color: '#8b5cf6', show: true }
  ].filter(k => k.show);

  const recentActivity = [
    { id: 1, action: 'New customer added', target: 'Acme Corp', time: '2 hours ago', icon: Users },
    { id: 2, action: 'Challan created', target: '#CHL-2023-089', time: '5 hours ago', icon: FileText },
    { id: 3, action: 'Stock updated', target: 'SKU-LPT-001 (+50)', time: 'Yesterday', icon: Package },
    { id: 4, action: 'Payment received', target: '$5,000 from Smith Ltd', time: 'Yesterday', icon: DollarSign }
  ];

  const revenueData = [
    { name: 'Jan', revenue: 32000 }, { name: 'Feb', revenue: 35000 },
    { name: 'Mar', revenue: 30000 }, { name: 'Apr', revenue: 41000 },
    { name: 'May', revenue: 39000 }, { name: 'Jun', revenue: 45231 },
  ];

  const customerData = [
    { name: 'Active', value: 850 },
    { name: 'Lead', value: 300 },
    { name: 'Inactive', value: 134 }
  ];
  const COLORS = ['#10b981', '#3b82f6', '#f43f5e'];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const textColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';

  return (
    <div style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', color: 'var(--text-dark)' }}>
          Good afternoon{user ? `, ${user.role}` : ''}!
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '5px' }}>Here is what's happening with your operations today.</p>
      </div>

      <motion.div 
        variants={containerVariants} initial="hidden" animate="show"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}
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

      <div className="dashboard-grid">
        {user?.role !== 'Warehouse' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
            <h3 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-dark)' }}>
              <Activity size={20} color="var(--accent-primary)" /> Revenue Overview
            </h3>
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <Line type="monotone" dataKey="revenue" stroke="var(--accent-primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--accent-primary)', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  <CartesianGrid stroke={gridColor} strokeDasharray="5 5" vertical={false} />
                  <XAxis dataKey="name" stroke={textColor} tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke={textColor} tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-dark)' }}
                    itemStyle={{ color: 'var(--accent-primary)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
          <h3 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-dark)' }}>
            <PieChartIcon size={20} color="var(--accent-secondary)" /> Customer Distribution
          </h3>
          <div style={{ height: '250px', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={customerData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {customerData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-dark)' }} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: 'var(--text-dark)', fontSize: '13px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card">
          <h3 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-dark)' }}>
            <Clock size={20} color="#f59e0b" /> Recent Activity
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

      <style>{`
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: ${user?.role !== 'Warehouse' ? '2fr 1fr' : '1fr 1fr'};
          }
          .dashboard-grid > div:nth-child(3) {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
