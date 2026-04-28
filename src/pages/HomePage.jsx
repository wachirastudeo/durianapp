import React from 'react';
import { CloudRain, Sun, Calendar, ChevronRight, Clock, Droplets, FlaskConical, Shovel, Trees, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useStorage';

const HomePage = () => {
  const navigate = useNavigate();
  const [tasks] = useLocalStorage('durian_tasks', []);
  const [logs] = useLocalStorage('durian_worklogs', []);
  const [trees] = useLocalStorage('durian_trees', []);
  
  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysTasks = tasks.filter(t => t.date === todayStr);
  const pendingTasks = todaysTasks.filter(t => t.status === 'pending');
  
  const getTaskIcon = (type) => {
    switch (type) {
      case 'watering': return <Droplets size={24} />;
      case 'fertilizer': return <Shovel size={24} />;
      case 'spraying': return <FlaskConical size={24} />;
      default: return <Calendar size={24} />;
    }
  };

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 600 }}>สวัสดีครับ</h1>
          <span style={{ fontSize: '2rem' }}>👋</span>
        </div>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>ยินดีต้อนรับสู่สวนทุเรียนของคุณ</p>
      </header>

      {/* Weather Widget */}
      <section className="card" style={{ 
        border: 'none', 
        marginBottom: '2rem', 
        background: 'linear-gradient(135deg, #1a8a3e 0%, #0d6b30 50%, #145a2a 100%)',
        color: 'white',
        boxShadow: '0 8px 32px rgba(26, 138, 62, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative shimmer overlay */}
        <div className="shimmer-bg" style={{ position: 'absolute', inset: 0, opacity: 0.3, pointerEvents: 'none' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.25rem', opacity: 0.95 }}>พยากรณ์อากาศ</h2>
            <p style={{ opacity: 0.8, fontWeight: 500, fontSize: '0.95rem' }}>อำเภอแกลง, ระยอง</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2.8rem', fontWeight: 700, lineHeight: 1 }}>32°C</div>
            <p style={{ fontWeight: 600, opacity: 0.9, marginTop: '4px' }}>แดดจัด</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.15)', position: 'relative', zIndex: 1 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '10px 12px', borderRadius: 'var(--radius)' }}>
            <Sun size={24} style={{ opacity: 0.9 }} />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 500, opacity: 0.8 }}>วันนี้</div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>แดดจัด / 34°</div>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '10px 12px', borderRadius: 'var(--radius)' }}>
            <CloudRain size={24} style={{ opacity: 0.9 }} />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 500, opacity: 0.8 }}>พรุ่งนี้</div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>ฝนตก / 28°</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" onClick={() => navigate('/orchard')} style={{ cursor: 'pointer', textAlign: 'center', padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}><Trees size={28} style={{ margin: '0 auto' }} /></div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{trees.length}</div>
          <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 600 }}>ทุเรียนทั้งหมด</div>
        </div>
        <div className="card" onClick={() => navigate('/planner')} style={{ cursor: 'pointer', textAlign: 'center', padding: '1.5rem', borderLeft: '4px solid var(--accent)' }}>
          <div style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}><Calendar size={28} style={{ margin: '0 auto' }} /></div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)' }}>{pendingTasks.length}</div>
          <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 600 }}>งานวันนี้</div>
        </div>
      </div>

      {/* Upcoming Tasks */}
      <section style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="var(--accent)" /> งานที่ต้องทำวันนี้
          </h2>
          <button onClick={() => navigate('/planner')} className="btn-ghost" style={{ fontSize: '0.95rem', color: 'var(--primary)', fontWeight: 700, padding: '6px 12px', borderRadius: 'var(--radius-sm)' }}>ดูทั้งหมด</button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {todaysTasks.length === 0 ? (
            <div className="empty-state">
              <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>พักผ่อนได้! วันนี้ไม่มีงานค้าง 🎉</p>
            </div>
          ) : (
            todaysTasks.slice(0, 3).map(item => (
              <div 
                key={item.id} 
                className="card" 
                style={{ 
                  padding: '1rem 1.25rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  opacity: item.status === 'done' ? 0.55 : 1,
                  cursor: 'pointer'
                }}
                onClick={() => navigate('/planner')}
              >
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: 'var(--radius)', 
                  background: 'var(--success-bg)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  flexShrink: 0
                }}>
                  {getTaskIcon(item.type)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', textDecoration: item.status === 'done' ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500, marginTop: '2px' }}>
                    <Clock size={14} /> {item.time} น.
                  </div>
                </div>
                <ChevronRight size={22} color="var(--text-muted)" />
              </div>
            ))
          )}
        </div>
      </section>

      {/* Recent Activity Shortcut */}
      <button 
        onClick={() => navigate('/logs')}
        className="card"
        style={{ width: '100%', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid var(--primary)', background: 'var(--surface)', cursor: 'pointer', textAlign: 'left' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: 'white', padding: '10px', borderRadius: 'var(--radius)' }}><FlaskConical size={22} /></div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary)' }}>บันทึกการทำงาน</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>ดูประวัติการใส่ปุ๋ย/ฉีดยา</div>
          </div>
        </div>
        <ChevronRight size={24} color="var(--primary)" />
      </button>
    </div>
  );
};

export default HomePage;
