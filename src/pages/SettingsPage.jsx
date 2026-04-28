import React from 'react';
import { User, TreePine, Bell, Shield, LogOut, ChevronRight, Download, Upload } from 'lucide-react';

const SettingsPage = () => {
  const sections = [
    { 
      title: 'โปรไฟล์และสวน',
      items: [
        { icon: <User size={20} />, label: 'ข้อมูลส่วนตัว', value: 'สมชาย รักสวน' },
        { icon: <TreePine size={20} />, label: 'ข้อมูลสวนทุเรียน', value: '3 แปลง / 195 ต้น' }
      ]
    },
    {
      title: 'การแจ้งเตือน',
      items: [
        { icon: <Bell size={20} />, label: 'ตั้งค่าการแจ้งเตือน', value: 'เปิด' }
      ]
    },
    {
      title: 'ข้อมูลและระบบ',
      items: [
        { icon: <Download size={20} />, label: 'สำรองข้อมูล (Export)', value: '' },
        { icon: <Upload size={20} />, label: 'นำเข้าข้อมูล (Import)', value: '' },
        { icon: <Shield size={20} />, label: 'ความเป็นส่วนตัว', value: '' }
      ]
    }
  ];

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>ตั้งค่า</h1>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {sections.map((section, idx) => (
          <div key={idx}>
            <h2 style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.75rem', paddingLeft: '4px' }}>
              {section.title}
            </h2>
            <div className="card" style={{ padding: '0' }}>
              {section.items.map((item, i) => (
                <div 
                  key={i} 
                  style={{ 
                    padding: '1rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem',
                    borderBottom: i === section.items.length - 1 ? 'none' : '1px solid var(--border)'
                  }}
                >
                  <div style={{ color: 'var(--primary)' }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: '0.9375rem' }}>{item.label}</div>
                    {item.value && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.value}</div>}
                  </div>
                  <ChevronRight size={18} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          </div>
        ))}

        <button className="btn btn-ghost" style={{ color: 'var(--danger)', justifyContent: 'center', marginTop: '1rem' }}>
          <LogOut size={20} />
          <span>ออกจากระบบ</span>
        </button>
        
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '1rem' }}>
          เวอร์ชัน 1.0.0
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
