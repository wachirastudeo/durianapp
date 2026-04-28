import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, TrendingUp, TrendingDown, Info } from 'lucide-react';
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>รายงานและสถิติ</h1>
        </div>
      </header>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ background: 'var(--card-bg)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            รายรับรวมปีนี้ <Info size={12} />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--success)' }}>฿125,400</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <TrendingUp size={12} /> +15% จากปีที่แล้ว
          </div>
        </div>
        <div className="card" style={{ background: 'var(--card-bg)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            รายจ่ายรวมปีนี้ <Info size={12} />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--danger)' }}>฿42,300</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <TrendingDown size={12} /> -5% จากปีที่แล้ว
          </div>
        </div>
      </div>

      {/* Finance Chart */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>รายรับ-รายจ่าย (6 เดือนล่าสุด)</h2>
        <div className="card" style={{ height: '300px', padding: '1rem 1rem 1rem 0' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <RechartsTooltip 
                cursor={{ fill: 'var(--background)' }}
                contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--card-bg)' }}
              />
              <Bar dataKey="income" name="รายรับ" fill="var(--success)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="รายจ่าย" fill="var(--danger)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Yield Chart */}
      <section>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>แนวโน้มผลผลิต (กก.)</h2>
        <div className="card" style={{ height: '250px', padding: '1rem 1rem 1rem 0' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={yieldData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <RechartsTooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--card-bg)' }}
              />
              <Line type="monotone" dataKey="weight" name="ผลผลิต (กก.)" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default ReportPage;
