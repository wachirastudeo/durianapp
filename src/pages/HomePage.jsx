import React from 'react';
import { CloudRain, Sun, Calendar, ChevronRight, Clock, Droplets, FlaskConical, Shovel, Trees } from 'lucide-react';
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
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>สวัสดีครับ 👋</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 600 }}>ยินดีต้อนรับสู่สวนทุเรียนของคุณ</p>
      </header>

      {/* Weather Widget */}
      <section className="weather-card card" style={{ border: 'none', marginBottom: '2rem', background: 'linear-gradient(135deg, var(--primary) 0%, #1b5e20 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem' }}>พยากรณ์อากาศ</h2>
            <p style={{ opacity: 0.9, fontWeight: 600 }}>อำเภอแกลง, ระยอง</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800 }}>32°C</div>
            <p style={{ fontWeight: 700 }}>แดดจัด</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Sun size={28} />
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 600 }}>วันนี้</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>แดดจัด / 34°</div>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <CloudRain size={28} />
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 600 }}>พรุ่งนี้</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>ฝนตก / 28°</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="card" onClick={() => navigate('/orchard')} style={{ cursor: 'pointer', textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}><Trees size={32} style={{ margin: '0 auto' }} /></div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900 }}>{trees.length}</div>
          <div style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 700 }}>ทุเรียนทั้งหมด</div>
        </div>
        <div className="card" onClick={() => navigate('/planner')} style={{ cursor: 'pointer', textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ color: 'var(--accent)', marginBottom: '0.75rem' }}><Calendar size={32} style={{ margin: '0 auto' }} /></div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900 }}>{pendingTasks.length}</div>
          <div style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 700 }}>งานวันนี้</div>
        </div>
      </div>

      {/* Upcoming Tasks */}
      <section style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>📌 งานที่ต้องทำวันนี้</h2>
          <button onClick={() => navigate('/planner')} className="btn-ghost" style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 800 }}>ดูทั้งหมด</button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {todaysTasks.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)', border: '2px dashed var(--border)' }}>
              <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>พักผ่อนได้! วันนี้ไม่มีงานค้าง</p>
            </div>
          ) : (
            todaysTasks.slice(0, 3).map(item => (
              <div 
                key={item.id} 
                className="card" 
                style={{ 
                  padding: '1.25rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1.25rem', 
                  opacity: item.status === 'done' ? 0.6 : 1,
                  border: '2px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)'
                }}
                onClick={() => navigate('/planner')}
              >
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '16px', 
                  background: 'rgba(76, 175, 80, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  flexShrink: 0
                }}>
                  {getTaskIcon(item.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', textDecoration: item.status === 'done' ? 'line-through' : 'none' }}>{item.title}</div>
                  <div style={{ fontSize: '1rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, marginTop: '4px' }}>
                    <Clock size={16} /> {item.time} น.
                  </div>
                </div>
                <ChevronRight size={28} color="var(--text-muted)" />
              </div>
            ))
          )}
        </div>
      </section>

      {/* Recent Activity Shortcut */}
      <button 
        onClick={() => navigate('/logs')}
        className="card"
        style={{ width: '100%', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '2px solid var(--primary)', background: 'rgba(76, 175, 80, 0.05)', cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '10px', borderRadius: '12px' }}><FlaskConical size={24} /></div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>บันทึกการทำงาน</div>
            <div style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: 600 }}>ดูประวัติการใส่ปุ๋ย/ฉีดยา</div>
          </div>
        </div>
        <ChevronRight size={28} color="var(--primary)" />
      </button>
    </div>
  );
};

export default HomePage;
