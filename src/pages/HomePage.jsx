import { CloudRain, Sun, Calendar, ChevronRight, Clock, Droplets, FlaskConical, Shovel, Trees, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useStorage';

const HomePage = () => {
  const navigate = useNavigate();
  const [tasks] = useLocalStorage('durian_tasks', []);
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

      {/* Weather Widget */}
      <section className="card" style={{ 
        border: 'none', 
        marginBottom: '1.5rem', 
        padding: '1rem',
        background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 50%, #1e3a8a 100%)',
        color: 'white',
        boxShadow: '0 8px 32px rgba(37, 99, 235, 0.3)',
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
        
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.15)', position: 'relative', zIndex: 1 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '8px 10px', borderRadius: 'var(--radius)' }}>
            <Sun size={20} style={{ opacity: 0.9 }} />
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 500, opacity: 0.8 }}>วันนี้</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>แดดจัด / 34°</div>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '8px 10px', borderRadius: 'var(--radius)' }}>
            <CloudRain size={20} style={{ opacity: 0.9 }} />
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 500, opacity: 0.8 }}>พรุ่งนี้</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>ฝนตก / 28°</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" onClick={() => navigate('/orchard')} style={{ 
          cursor: 'pointer', 
          textAlign: 'center', 
          padding: '1.25rem',
          background: 'linear-gradient(135deg, rgba(26, 138, 62, 0.08) 0%, transparent 100%)',
          borderLeft: '4px solid var(--primary)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all var(--duration) var(--ease-out)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ 
            marginBottom: '0.75rem',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
            borderRadius: 'var(--radius)',
            color: 'white',
            margin: '0 auto 0.75rem'
          }}>
            <Trees size={24} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>{trees.length}</div>
          <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.5rem' }}>ทุเรียนทั้งหมด</div>
        </div>
        <div className="card" onClick={() => navigate('/planner')} style={{ 
          cursor: 'pointer', 
          textAlign: 'center', 
          padding: '1.25rem',
          background: 'linear-gradient(135deg, rgba(240, 165, 0, 0.08) 0%, transparent 100%)',
          borderLeft: '4px solid var(--accent)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all var(--duration) var(--ease-out)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ 
            marginBottom: '0.75rem',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
            borderRadius: 'var(--radius)',
            color: 'white',
            margin: '0 auto 0.75rem'
          }}>
            <Calendar size={24} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>{pendingTasks.length}</div>
          <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.5rem' }}>งานวันนี้</div>
        </div>
      </div>

      {/* Upcoming Tasks */}
      <section style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
              borderRadius: 'var(--radius-sm)',
              color: 'white'
            }}>
              <Sparkles size={16} />
            </div>
            งานที่ต้องทำวันนี้
          </h2>
          <button onClick={() => navigate('/planner')} className="btn-ghost" style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600, padding: '6px 12px', borderRadius: 'var(--radius)', background: 'rgba(26, 138, 62, 0.1)', border: 'none', cursor: 'pointer' }}>ดูทั้งหมด →</button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {todaysTasks.length === 0 ? (
            <div className="card" style={{ 
              padding: '1.5rem 1rem',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(34, 165, 91, 0.08) 0%, transparent 100%)',
              border: '1.5px dashed var(--border-light)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{ 
                fontSize: '2.5rem',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}>🎉</div>
              <div>
                <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--success)', marginBottom: '0.25rem' }}>พักผ่อนได้!</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>วันนี้ไม่มีงานค้าง 😊</p>
              </div>
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
                  gap: '1rem', 
                  opacity: item.status === 'done' ? 0.6 : 1,
                  cursor: 'pointer',
                  background: item.status === 'done' ? 'rgba(34, 165, 91, 0.04)' : 'var(--surface)',
                  borderLeft: item.status === 'done' ? '4px solid var(--success)' : '4px solid var(--accent)',
                  transition: 'all var(--duration) var(--ease-out)'
                }}
                onClick={() => navigate('/planner')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderLeftColor = item.status === 'done' ? 'var(--success)' : 'var(--accent)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderLeftColor = item.status === 'done' ? 'var(--success)' : 'var(--accent)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: 'var(--radius)', 
                  background: item.status === 'done' 
                    ? 'linear-gradient(135deg, var(--success), rgba(34, 165, 91, 0.6))' 
                    : 'linear-gradient(135deg, var(--accent), rgba(240, 165, 0, 0.6))',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  flexShrink: 0,
                  fontSize: '1.2rem',
                  fontWeight: 700
                }}>
                  {item.status === 'done' ? '✓' : getTaskIcon(item.type)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', textDecoration: item.status === 'done' ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', opacity: item.status === 'done' ? 0.7 : 1 }}>{item.title}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500, marginTop: '4px' }}>
                    <Clock size={14} /> {item.time} น.
                  </div>
                </div>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--background-alt)',
                  color: 'var(--text-muted)',
                  flexShrink: 0
                }}>
                  <ChevronRight size={18} />
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Recent Activity Shortcut */}
      <button 
        onClick={() => navigate('/logs')}
        className="card"
        style={{ 
          width: '100%', 
          padding: '1.25rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderLeft: '4px solid var(--primary)', 
          background: 'linear-gradient(135deg, rgba(26, 138, 62, 0.08) 0%, transparent 100%)',
          cursor: 'pointer', 
          textAlign: 'left',
          border: 'none',
          fontSize: '1rem',
          fontFamily: 'inherit',
          transition: 'all var(--duration) var(--ease-out)',
          marginBottom: '2rem'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', 
            color: 'white', 
            padding: '10px', 
            borderRadius: 'var(--radius)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FlaskConical size={18} />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)' }}>บันทึกการทำงาน</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '1px' }}>ดูประวัติการใส่ปุ๋ย/ฉีดยา</div>
          </div>
        </div>
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: 'rgba(26, 138, 62, 0.1)',
          color: 'var(--primary)',
          transition: 'transform var(--duration)',
          flexShrink: 0
        }}>
          <ChevronRight size={16} />
        </div>
      </button>
    </div>
  );
};

export default HomePage;
