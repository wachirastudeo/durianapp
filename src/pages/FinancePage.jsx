import { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, BarChart2, X, Check, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useStorage';

const INCOME_CATS = ['ขายผลผลิต', 'ขายกิ่งพันธุ์', 'เงินอุดหนุน', 'อื่นๆ'];
const EXPENSE_CATS = ['ปุ๋ย/ยา', 'ค่าแรง', 'เชื้อเพลิง', 'อุปกรณ์', 'น้ำ/ไฟ', 'อื่นๆ'];

const formatDate = (d) => {
  const [y, m, day] = d.split('-');
  const months = ['', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  return `${parseInt(day)} ${months[parseInt(m)]} ${parseInt(y) + 543}`;
};

const FinancePage = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useLocalStorage('durian_finance', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabFilter, setTabFilter] = useState('all');
  const [form, setForm] = useState({
    type: 'income',
    category: 'ขายผลผลิต',
    title: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const filtered = transactions.filter(t => tabFilter === 'all' || t.type === tabFilter)
    .sort((a, b) => b.date.localeCompare(a.date));

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.amount) return;
    setTransactions([{ id: Date.now(), ...form, amount: parseFloat(form.amount) }, ...transactions]);
    setIsModalOpen(false);
    setForm({ type: 'income', category: 'ขายผลผลิต', title: '', amount: '', date: new Date().toISOString().slice(0, 10) });
  };

  const handleDelete = (id) => {
    if (!window.confirm('ลบรายการนี้ใช่ไหม?')) return;
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const cats = form.type === 'income' ? INCOME_CATS : EXPENSE_CATS;

  return (
    <div className="fade-in" style={{ paddingBottom: '100px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 600 }}>บัญชีสวน</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => navigate('/reports')} className="btn btn-ghost" style={{ width: '48px', height: '48px', borderRadius: '12px', border: '2px solid var(--border)', padding: 0 }}><BarChart2 size={24} /></button>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary" style={{ width: '48px', height: '48px', borderRadius: '12px', padding: 0 }}><Plus size={28} /></button>
        </div>
      </header>

      {/* Summary Card */}
      <section className="card" style={{ background: 'var(--primary)', color: 'white', marginBottom: '2rem', padding: '2rem 1.5rem', borderRadius: '32px', boxShadow: '0 15px 30px -5px rgba(46, 125, 50, 0.4)', border: 'none' }}>
        <div style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '0.5rem', fontWeight: 600 }}>ยอดเงินคงเหลือ</div>
        <div style={{ fontSize: '2.8rem', fontWeight: 700, marginBottom: '2rem', letterSpacing: '-1px' }}>
          ฿{balance.toLocaleString('th-TH', { minimumFractionDigits: 0 })}
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.15)', padding: '16px', borderRadius: '20px', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: '0.85rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontWeight: 700 }}><TrendingUp size={16} /> รายรับ</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>฿{totalIncome.toLocaleString()}</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.15)', padding: '16px', borderRadius: '20px', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: '0.85rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontWeight: 700 }}><TrendingDown size={16} /> รายจ่าย</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>฿{totalExpense.toLocaleString()}</div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--background-alt)', padding: '6px', borderRadius: '18px' }}>
        {[
          { id: 'all', label: 'ทั้งหมด', color: 'var(--primary)' },
          { id: 'income', label: 'รายรับ', color: 'var(--success)' },
          { id: 'expense', label: 'รายจ่าย', color: 'var(--danger)' }
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setTabFilter(tab.id)} 
            style={{
              flex: 1, padding: '12px 8px', borderRadius: '14px', border: 'none',
              background: tabFilter === tab.id ? 'white' : 'transparent',
              color: tabFilter === tab.id ? tab.color : 'var(--text-muted)',
              fontWeight: 600, cursor: 'pointer', fontSize: '1rem',
              boxShadow: tabFilter === tab.id ? 'var(--shadow-xs)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <Wallet size={56} style={{ opacity: 0.2, marginBottom: '1.5rem', margin: '0 auto' }} />
            <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>ยังไม่มีรายการบัญชี</p>
          </div>
        ) : (
          filtered.map(t => (
            <div key={t.id} className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: t.type === 'income' ? 'var(--success-bg)' : 'var(--danger-bg)', color: t.type === 'income' ? 'var(--success)' : 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {t.type === 'income' ? <ArrowUpRight size={28} /> : <ArrowDownRight size={28} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '4px' }}>{t.title}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.category} • {formatDate(t.date)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: '1.2rem', color: t.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                  {t.type === 'income' ? '+' : '-'}฿{t.amount.toLocaleString()}
                </div>
                <button onClick={() => handleDelete(t.id)} className="btn-ghost" style={{ padding: '4px', color: 'var(--danger)', marginTop: '4px' }}><Trash2 size={20} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 600 }}>บันทึกรายการใหม่</h2>
              <button onClick={() => setIsModalOpen(false)} className="btn-ghost" style={{ padding: '8px' }}><X size={32}/></button>
            </div>

            {/* Type Toggle Chips */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', background: 'var(--background-alt)', padding: '6px', borderRadius: '18px' }}>
              {[
                { id: 'income', label: 'รายรับ (💰)', color: 'var(--success)' },
                { id: 'expense', label: 'รายจ่าย (💸)', color: 'var(--danger)' }
              ].map(type => (
                <button 
                  key={type.id} 
                  onClick={() => setForm({ ...form, type: type.id, category: type.id === 'income' ? INCOME_CATS[0] : EXPENSE_CATS[0] })} 
                  style={{
                    flex: 1, padding: '14px 8px', borderRadius: '14px', border: 'none', cursor: 'pointer',
                    background: form.type === type.id ? 'white' : 'transparent',
                    color: form.type === type.id ? type.color : 'var(--text-muted)',
                    fontWeight: 600, fontSize: '1rem',
                    boxShadow: form.type === type.id ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  {type.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleAdd}>
              <div className="input-group">
                <label>หมวดหมู่</label>
                <select 
                  value={form.category} 
                  onChange={e => setForm({ ...form, category: e.target.value })}
                >
                  {cats.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>รายละเอียดรายการ *</label>
                <input 
                  required 
                  type="text" 
                  value={form.title} 
                  onChange={e => setForm({ ...form, title: e.target.value })} 
                  placeholder={form.type === 'income' ? 'เช่น ขายทุเรียน 500 กก.' : 'เช่น ซื้อปุ๋ยสูตรเสมอ 10 ถุง'} 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label>จำนวนเงิน (บาท) *</label>
                  <input 
                    required 
                    type="number" 
                    min="0" 
                    step="1" 
                    value={form.amount} 
                    onChange={e => setForm({ ...form, amount: e.target.value })} 
                    placeholder="0" 
                    style={{ fontSize: '1.3rem', fontWeight: 700, color: form.type === 'income' ? 'var(--success)' : 'var(--danger)' }}
                  />
                </div>
                <div className="input-group">
                  <label>วันที่</label>
                  <input 
                    type="date" 
                    value={form.date} 
                    onChange={e => setForm({ ...form, date: e.target.value })} 
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem', padding: '1rem', fontSize: '1.25rem' }}>
                <Check size={28} /> บันทึกรายการ
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancePage;
