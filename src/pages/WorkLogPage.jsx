import React, { useState, useEffect } from 'react';
import { Plus, Filter, Droplets, FlaskConical, Scissors, Shovel, X, Check, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { useLocalStorage } from '../hooks/useStorage';

const ACTIVITY_TYPES = [
  { value: 'watering', label: 'รดน้ำ', icon: <Droplets size={24} />, color: '#3b82f6' },
  { value: 'fertilizer', label: 'ใส่ปุ๋ย', icon: <Shovel size={24} />, color: '#f59e0b' },
  { value: 'spraying', label: 'ฉีดยา', icon: <FlaskConical size={24} />, color: '#8b5cf6' },
  { value: 'pruning', label: 'ตัดหญ้า/แต่งกิ่ง', icon: <Scissors size={24} />, color: '#10b981' },
];

const WorkLogPage = () => {
  const [logs, setLogs] = useLocalStorage('durian_worklogs', []);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    type: 'watering',
    plot: '',
    date: new Date().toISOString().slice(0, 10),
    notes: '',
  });

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    const act = ACTIVITY_TYPES.find(a => a.value === form.type);
    const log = {
      id: Date.now(),
      type: form.type,
      activity: act?.label || form.type,
      plot: form.plot,
      date: new Date(form.date).toISOString(),
      notes: form.notes,
    };
    setLogs([log, ...logs]);
    setIsModalOpen(false);
    setForm({ type: 'watering', plot: '', date: new Date().toISOString().slice(0, 10), notes: '' });
  };

  const handleDelete = (id) => {
    if (!window.confirm('ลบรายการนี้ใช่ไหม?')) return;
    setLogs(logs.filter(l => l.id !== id));
  };

  const filtered = logs.filter(l => activeFilter === 'all' || l.type === activeFilter);

  return (
    <div className="fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 600 }}>บันทึกงานสวน</h1>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary" style={{ padding: '0.75rem 1.25rem', borderRadius: '12px' }}>
          <Plus size={24} /><span>บันทึกงาน</span>
        </button>
      </header>

      {/* Filters - Horizontal Scrollable */}
      <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1.25rem', marginBottom: '0.5rem', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <button
          onClick={() => setActiveFilter('all')}
          className="btn"
          style={{
            whiteSpace: 'nowrap', padding: '10px 20px', borderRadius: '12px',
            background: activeFilter === 'all' ? 'var(--primary)' : 'white',
            color: activeFilter === 'all' ? 'white' : 'var(--text-main)',
            border: activeFilter === 'all' ? 'none' : '2px solid var(--border)',
            fontWeight: 500,
          }}
        >
          ทั้งหมด
        </button>
        {ACTIVITY_TYPES.map(a => (
          <button
            key={a.value}
            onClick={() => setActiveFilter(a.value)}
            className="btn"
            style={{
              whiteSpace: 'nowrap', padding: '10px 20px', borderRadius: '12px',
              background: activeFilter === a.value ? a.color : 'white',
              color: activeFilter === a.value ? 'white' : 'var(--text-main)',
              border: activeFilter === a.value ? 'none' : '2px solid var(--border)',
              fontWeight: 500,
            }}
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Log List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <Filter size={48} style={{ opacity: 0.2, marginBottom: '1.5rem', margin: '0 auto' }} />
            <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>ยังไม่มีรายการบันทึก</p>
            <p style={{ fontSize: '1rem', marginTop: '0.5rem' }}>กดปุ่มสีเขียวด้านบนเพื่อเพิ่มงานชิ้นแรก!</p>
          </div>
        ) : (
          filtered.map(log => {
            const typeInfo = ACTIVITY_TYPES.find(a => a.value === log.type);
            return (
              <div key={log.id} className="card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', borderLeft: `6px solid ${typeInfo?.color || 'var(--primary)'}` }}>
                <div style={{ 
                  width: '56px', height: '56px', borderRadius: '16px', 
                  background: `${typeInfo?.color || 'var(--primary)'}18`, 
                  color: typeInfo?.color || 'var(--primary)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                }}>
                  {typeInfo?.icon || <Check size={28} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-main)' }}>{log.activity}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1rem', color: 'var(--text-main)', fontWeight: 600, marginTop: '2px' }}>
                        <MapPin size={16} color="var(--primary)" /> {log.plot}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} /> {format(new Date(log.date), 'd MMM yy', { locale: th })}
                      </div>
                    </div>
                  </div>
                  
                  {log.notes && (
                    <div style={{ 
                      fontSize: '1rem', 
                      background: 'var(--background)', 
                      padding: '12px', 
                      borderRadius: '12px', 
                      color: 'var(--text-main)',
                      fontWeight: 500,
                      border: '1px solid var(--border-light)',
                      marginTop: '0.5rem'
                    }}>
                      {log.notes}
                    </div>
                  )}
                </div>
                <button onClick={() => handleDelete(log.id)} className="btn-ghost" style={{ padding: '8px', color: 'var(--danger)', flexShrink: 0 }}>
                  <X size={24} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>บันทึกงานสวนใหม่</h2>
              <button onClick={() => setIsModalOpen(false)} className="btn-ghost" style={{ padding: '8px' }}><X size={28} /></button>
            </div>
            <form onSubmit={handleAdd}>
              <div className="input-group">
                <label>ประเภทงาน *</label>
                <select 
                  value={form.type} 
                  onChange={e => setForm({ ...form, type: e.target.value })}
                >
                  {ACTIVITY_TYPES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>แปลงที่ทำงาน *</label>
                <input 
                  required 
                  type="text" 
                  value={form.plot} 
                  onChange={e => setForm({ ...form, plot: e.target.value })} 
                  placeholder="เช่น แปลงหน้าบ้าน" 
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
              <div className="input-group">
                <label>หมายเหตุ / รายละเอียด</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  placeholder="ระบุข้อมูลเพิ่มเติม..."
                  rows={3}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem', padding: '1rem', fontSize: '1.2rem' }}>
                <Check size={24} /><span>บันทึกข้อมูลงาน</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkLogPage;
