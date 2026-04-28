import React from 'react';
import { User, TreePine, Bell, Shield, LogOut, ChevronRight, Download, Upload, Settings } from 'lucide-react';

const SettingsPage = () => {
  const sections = [
    { 
      title: 'โปรไฟล์และสวน',
      items: [
        { icon: <User size={20} />, label: 'ข้อมูลส่วนตัว', value: 'สมชาย รักสวน', color: '#3b82f6' },
        { icon: <TreePine size={20} />, label: 'ข้อมูลสวนทุเรียน', value: '3 แปลง / 195 ต้น', color: 'var(--primary)' }
      ]
    },
    {
      title: 'การแจ้งเตือน',
      items: [
        { icon: <Bell size={20} />, label: 'ตั้งค่าการแจ้งเตือน', value: 'เปิด', color: 'var(--accent)' }
      ]
    },
    {
      title: 'ข้อมูลและระบบ',
      items: [
        { icon: <Download size={20} />, label: 'สำรองข้อมูล (Export)', value: '', color: 'var(--success)' },
        { icon: <Upload size={20} />, label: 'นำเข้าข้อมูล (Import)', value: '', color: '#8b5cf6' },
        { icon: <Shield size={20} />, label: 'ความเป็นส่วนตัว', value: '', color: 'var(--text-muted)' }
      ]
    }
  ];

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.25rem' }}>
          <Settings size={22} color="var(--primary)" />
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>ตั้งค่า</h1>
        </div>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 500, paddingLeft: '32px' }}>จัดการโปรไฟล์และข้อมูลสวน</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {sections.map((section, idx) => (
          <div key={idx}>
            <h2 style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              marginBottom: '0.6rem',
              paddingLeft: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              {section.title}
            </h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {section.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    borderBottom: i === section.items.length - 1 ? 'none' : '1px solid var(--border-light)',
                    cursor: 'pointer',
                    transition: 'background var(--duration-fast)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--background)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-sm)',
                    background: `${item.color}15`,
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-main)' }}>{item.label}</div>
                    {item.value && <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>{item.value}</div>}
                  </div>
                  <ChevronRight size={18} color="var(--border)" />
                </div>
              ))}
            </div>
          </div>
        ))}

        <button className="btn btn-ghost" style={{ color: 'var(--danger)', justifyContent: 'center', marginTop: '0.5rem', padding: '1rem', border: '2px solid rgba(229,62,62,0.15)' }}>
          <LogOut size={20} />
          <span>ออกจากระบบ</span>
        </button>
        
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', paddingBottom: '1rem' }}>
          สมุดสวนทุเรียนดิจิทัล · เวอร์ชัน 1.0.0
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
