import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, TrendingUp, TrendingDown, Info, BarChart3, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const ReportPage = () => {
  const navigate = useNavigate();

  const financeData = [
    { month: 'ม.ค.', income: 4000, expense: 2400 },
    { month: 'ก.พ.', income: 3000, expense: 1398 },
    { month: 'มี.ค.', income: 2000, expense: 9800 },
    { month: 'เม.ย.', income: 27800, expense: 3908 },
    { month: 'พ.ค.', income: 18900, expense: 4800 },
    { month: 'มิ.ย.', income: 23900, expense: 3800 },
  ];

  const yieldData = [
    { year: '2565', weight: 4000 },
    { year: '2566', weight: 4500 },
    { year: '2567', weight: 4800 },
    { year: '2568', weight: 5200 },
    { year: '2569', weight: 6000 },
  ];

  return (
    <div className="fade-in" style={{ paddingBottom: '80px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ padding: '0.5rem', marginLeft: '-0.5rem' }}>
            <ChevronLeft size={24} />
          </button>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>รายงานและสถิติ</h1>
        </div>
      </header>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700 }}>
            รายรับรวมปีนี้ <Info size={14} />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--success)' }}>฿125,400</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700 }}>
            <TrendingUp size={14} /> +15% จากปีที่แล้ว
          </div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700 }}>
            รายจ่ายรวมปีนี้ <Info size={14} />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--danger)' }}>฿42,300</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700 }}>
            <TrendingDown size={14} /> -5% จากปีที่แล้ว
          </div>
        </div>
      </div>

      {/* Finance Chart */}
      <section style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ background: 'var(--success-bg)', padding: '6px', borderRadius: '8px' }}>
            <BarChart3 size={20} color="var(--success)" />
          </div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>รายรับ-รายจ่าย (6 เดือนล่าสุด)</h2>
        </div>
        <div className="card" style={{ height: '300px', padding: '1.5rem 1rem 1rem 0' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)', fontWeight: 700 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)', fontWeight: 700 }} />
              <RechartsTooltip 
                cursor={{ fill: 'var(--background)' }}
                contentStyle={{ borderRadius: '16px', border: '1px solid var(--border-light)', background: 'white', boxShadow: 'var(--shadow-md)', fontWeight: 700 }}
              />
              <Bar dataKey="income" name="รายรับ" fill="var(--success)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" name="รายจ่าย" fill="var(--danger)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Yield Chart */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ background: 'var(--primary-glow)', padding: '6px', borderRadius: '8px' }}>
            <PieChart size={20} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>แนวโน้มผลผลิต (กก.)</h2>
        </div>
        <div className="card" style={{ height: '250px', padding: '1.5rem 1rem 1rem 0' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={yieldData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)', fontWeight: 700 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)', fontWeight: 700 }} />
              <RechartsTooltip 
                contentStyle={{ borderRadius: '16px', border: '1px solid var(--border-light)', background: 'white', boxShadow: 'var(--shadow-md)', fontWeight: 700 }}
              />
              <Line type="monotone" dataKey="weight" name="ผลผลิต (กก.)" stroke="var(--primary)" strokeWidth={4} dot={{ r: 5, fill: 'var(--primary)', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default ReportPage;
