import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, CheckCircle2, Circle, Clock, ChevronLeft, ChevronRight, Plus, X, Check, Trash2 } from 'lucide-react';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { th } from 'date-fns/locale';
import { useLocalStorage } from '../hooks/useStorage';

const TASK_TYPES = [
  { value: 'watering', label: 'รดน้ำ', color: '#3b82f6' },
  { value: 'fertilizer', label: 'ใส่ปุ๋ย', color: '#f59e0b' },
  { value: 'spraying', label: 'พ่นยา', color: '#8b5cf6' },
  { value: 'maintenance', label: 'ตัดหญ้า/บำรุงรักษา', color: '#10b981' },
  { value: 'harvest', label: 'เก็บเกี่ยว', color: '#ef4444' },
  { value: 'other', label: 'อื่นๆ', color: '#6b7280' },
];

const getTypeColor = (type) => TASK_TYPES.find(t => t.value === type)?.color || 'var(--primary)';
const getTypeLabel = (type) => TASK_TYPES.find(t => t.value === type)?.label || type;

const TaskPlannerPage = () => {
  const [tasks, setTasks] = useLocalStorage('durian_tasks', []);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', time: '08:00', type: 'watering', date: new Date().toISOString().slice(0, 10) });

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const days = Array.from({ length: 7 }).map((_, i) => addDays(new Date(), i - 3));
  const selectedDateStr = selectedDate.toISOString().slice(0, 10);
  const todaysTasks = tasks.filter(t => t.date === selectedDateStr).sort((a, b) => a.time.localeCompare(b.time));

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'done' ? 'pending' : 'done' } : t));
  };

  const deleteTask = (id) => {
    if (!window.confirm('ลบงานนี้ใช่ไหม?')) return;
    setTasks(tasks.filter(t => t.id !== id));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setTasks([...tasks, { id: Date.now(), ...form, status: 'pending' }]);
    setIsModalOpen(false);
    setForm({ title: '', time: '08:00', type: 'watering', date: selectedDateStr });
  };

  const doneCount = todaysTasks.filter(t => t.status === 'done').length;

  return (
    <div className="fade-in" style={{ paddingBottom: '100px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 600 }}>แผนงานสวน</h1>
        <button onClick={() => { setForm({ title: '', time: '08:00', type: 'watering', date: selectedDateStr }); setIsModalOpen(true); }} className="btn btn-primary" style={{ width: '48px', height: '48px', borderRadius: '50%', padding: 0 }}>
          <Plus size={28} />
        </button>
      </header>

      {/* Calendar Strip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', background: 'white', padding: '1rem', borderRadius: '24px', border: '2px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <button onClick={() => setSelectedDate(subDays(selectedDate, 1))} className="btn-ghost" style={{ padding: '8px' }}><ChevronLeft size={24} /></button>
        <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
          {days.map((day, i) => {
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            const dayStr = day.toISOString().slice(0, 10);
            const hasTasks = tasks.some(t => t.date === dayStr);
            
            return (
              <div 
                key={i} 
                onClick={() => setSelectedDate(day)} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                  padding: '10px 4px', 
                  borderRadius: '16px', 
                  background: isSelected ? 'var(--primary)' : 'transparent', 
                  color: isSelected ? 'white' : 'var(--text-main)', 
                  minWidth: '45px',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 600, opacity: isSelected ? 1 : 0.6, marginBottom: '4px' }}>
                  {format(day, 'EEE', { locale: th })}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{format(day, 'd')}</div>
                {isToday && !isSelected && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--primary)', marginTop: '4px' }} />}
                {hasTasks && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isSelected ? 'white' : 'var(--accent)', position: 'absolute', top: '4px', right: '4px' }} />}
              </div>
            );
          })}
        </div>
        <button onClick={() => setSelectedDate(addDays(selectedDate, 1))} className="btn-ghost" style={{ padding: '8px' }}><ChevronRight size={24} /></button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'var(--primary-glow)', padding: '8px', borderRadius: '12px' }}>
            <CalendarIcon size={24} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600 }}>
            {isSameDay(selectedDate, new Date()) ? 'งานวันนี้' : `งานวันที่ ${format(selectedDate, 'd MMM yy', { locale: th })}`}
          </h2>
        </div>
        {todaysTasks.length > 0 && (
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>{doneCount}/{todaysTasks.length} สำเร็จ</span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {todaysTasks.length === 0 ? (
          <div className="empty-state">
            <Clock size={48} style={{ opacity: 0.2, marginBottom: '1.5rem', margin: '0 auto' }} />
            <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>ยังไม่มีแผนงานสำหรับวันนี้</p>
            <button 
              onClick={() => { setForm({ title: '', time: '08:00', type: 'watering', date: selectedDateStr }); setIsModalOpen(true); }} 
              className="btn btn-primary" 
              style={{ marginTop: '1.5rem', padding: '0.8rem 1.5rem', borderRadius: '16px' }}
            >
              <Plus size={20} /><span>เริ่มวางแผนงาน</span>
            </button>
          </div>
        ) : (
          todaysTasks.map(task => (
            <div 
              key={task.id} 
              className="card" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1.25rem', 
                opacity: task.status === 'done' ? 0.6 : 1,
                borderLeft: `6px solid ${getTypeColor(task.type)}`,
                padding: '1.25rem'
              }}
            >
              <button 
                onClick={() => toggleTask(task.id)} 
                style={{ cursor: 'pointer', color: task.status === 'done' ? 'var(--primary)' : 'var(--border)', background: 'none', border: 'none', padding: 0, flexShrink: 0 }}
              >
                {task.status === 'done' ? <CheckCircle2 size={32} /> : <Circle size={32} />}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 700, textDecoration: task.status === 'done' ? 'line-through' : 'none', color: 'var(--text-main)' }}>{task.title}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.85rem', padding: '2px 10px', borderRadius: '8px', background: `${getTypeColor(task.type)}18`, color: getTypeColor(task.type), fontWeight: 600 }}>{getTypeLabel(task.type)}</span>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                    <Clock size={16} /> {task.time} น.
                  </div>
                </div>
              </div>
              <button onClick={() => deleteTask(task.id)} className="btn-ghost" style={{ padding: '8px', color: 'var(--danger)', flexShrink: 0 }}><Trash2 size={24} /></button>
            </div>
          ))
        )}
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>เพิ่มแผนงานใหม่</h2>
              <button onClick={() => setIsModalOpen(false)} className="btn-ghost" style={{ padding: '8px' }}><X size={28} /></button>
            </div>
            <form onSubmit={addTask}>
              <div className="input-group">
                <label>ชื่องาน *</label>
                <input 
                  required 
                  type="text" 
                  value={form.title} 
                  onChange={e => setForm({ ...form, title: e.target.value })} 
                  placeholder="เช่น รดน้ำแปลง A, ใส่ปุ๋ย..." 
                />
              </div>
              <div className="input-group">
                <label>ประเภทงาน</label>
                <select 
                  value={form.type} 
                  onChange={e => setForm({ ...form, type: e.target.value })}
                >
                  {TASK_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label>วันที่</label>
                  <input 
                    type="date" 
                    value={form.date} 
                    onChange={e => setForm({ ...form, date: e.target.value })} 
                  />
                </div>
                <div className="input-group">
                  <label>เวลา</label>
                  <input 
                    type="time" 
                    value={form.time} 
                    onChange={e => setForm({ ...form, time: e.target.value })} 
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem', padding: '1rem', fontSize: '1.2rem' }}>
                <Check size={24} /><span>บันทึกแผนงาน</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskPlannerPage;
