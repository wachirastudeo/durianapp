import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, QrCode, Save, Trash2, Plus, Calendar, Clock, ChevronDown, ChevronUp, Edit2, Check, X, AlertCircle, Camera, Image as ImageIcon, Download, Share2 } from 'lucide-react';
import { useLocalStorage } from '../hooks/useStorage';
import { QRCodeCanvas } from 'qrcode.react';

const DURIAN_STAGES = [
  { id: 'egg', label: 'ไข่ปลา/ตาปู', color: '#818cf8' },
  { id: 'rat_foot', label: 'เหยียดตีนหนู', color: '#60a5fa' },
  { id: 'eggplant', label: 'มะเขือพวง', color: '#34d399' },
  { id: 'bloom', label: 'ดอกบาน', color: '#fbbf24' },
  { id: 'fruit_set', label: 'หางแย้', color: '#f87171' },
  { id: 'chicken_egg', label: 'ผลเล็ก (ไข่ไก่)', color: '#f472b6' },
  { id: 'middle_fruit', label: 'ผลกลาง', color: '#fb923c' },
  { id: 'expanding', label: 'ผลใหญ่ (เบ่งพู)', color: '#4ade80' },
  { id: 'fruit', label: 'แก่จัด/เก็บเกี่ยว', color: '#a78bfa' },
];

const VARIETY_CONFIG = {
  'หมอนทอง': { days: 120, group: 'หนัก' },
  'ชะนี': { days: 110, group: 'กลาง' },
  'พวงมณี': { days: 95, group: 'เบา' },
  'กระดุม': { days: 90, group: 'เบา' },
  'มูซานคิง': { days: 100, group: 'เบา' },
  'หนามดำ (โอวฉี่)': { days: 100, group: 'เบา' },
  'อื่นๆ': { days: 120, group: 'กำหนดเอง' }
};

const VARIETIES = Object.keys(VARIETY_CONFIG);

const stageInfo = (id) => DURIAN_STAGES.find(s => s.id === id) || { label: id, color: '#cbd5e1' };

// Helper to calculate harvest date
const calculateHarvestDate = (bloomDate, variety, customDays) => {
  if (!bloomDate) return null;
  const date = new Date(bloomDate);
  const days = variety === 'อื่นๆ' ? (parseInt(customDays) || 120) : (VARIETY_CONFIG[variety]?.days || 120);
  date.setDate(date.getDate() + days);
  return { date: date.toISOString().slice(0, 10), days };
};

// ---- Sub-component: Edit a single timeline event ----
const TimelineEntry = ({ entry, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ stage: entry.stage, date: entry.date, note: entry.note || '' });
  const info = stageInfo(entry.stage);

  const handleSave = () => {
    onUpdate(entry.id, form);
    setEditing(false);
  };

  if (editing) {
    return (
      <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '1rem', border: '2px solid var(--primary)' }}>
        <div className="input-group" style={{ marginBottom: '0.75rem' }}>
          <label style={{ fontSize: '0.75rem' }}>ระยะ</label>
          <select value={form.stage} onChange={e => setForm({ ...form, stage: e.target.value })} style={{ padding: '8px' }}>
            {DURIAN_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
        <div className="input-group" style={{ marginBottom: '0.75rem' }}>
          <label style={{ fontSize: '0.75rem' }}>วันที่พบระยะนี้</label>
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={{ padding: '8px' }} />
        </div>
        <div className="input-group" style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.75rem' }}>หมายเหตุ</label>
          <input type="text" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder="เพิ่มเติม เช่น สมบูรณ์ดี" style={{ padding: '8px' }} />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleSave} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '8px' }}>
            <Check size={16} /> บันทึก
          </button>
          <button onClick={() => setEditing(false)} className="btn-ghost" style={{ padding: '8px 16px', borderRadius: '14px' }}>
            ยกเลิก
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', position: 'relative' }}>
      {/* Timeline dot */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: info.color, boxShadow: `0 0 0 3px ${info.color}33`, zIndex: 1, marginTop: '4px' }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, background: '#f8fafc', borderRadius: '12px', padding: '0.75rem 1rem', border: `1px solid ${info.color}44` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: info.color }}>{info.label}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontWeight: 600 }}>
              <Calendar size={13} /> {entry.date}
            </div>
            {entry.note && <div style={{ fontSize: '0.95rem', color: '#1e293b', marginTop: '6px', fontWeight: 500 }}>📝 {entry.note}</div>}
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={() => { setForm({ stage: entry.stage, date: entry.date, note: entry.note || '' }); setEditing(true); }} className="btn-ghost" style={{ padding: '4px', color: 'var(--text-muted)' }}>
              <Edit2 size={14} />
            </button>
            <button onClick={() => onDelete(entry.id)} className="btn-ghost" style={{ padding: '4px', color: 'var(--danger)' }}>
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---- Sub-component: One batch ----
const BatchCard = ({ batch, variety, customDays, onUpdate, onDelete, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen);
  const [showAddStage, setShowAddStage] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(batch.name);
  const [addForm, setAddForm] = useState({ stage: 'egg', date: new Date().toISOString().slice(0, 10), note: '' });

  const currentStageId = batch.timeline?.[0]?.stage || batch.currentStage || 'egg';
  const currentStageInfo = stageInfo(currentStageId);
  const timeline = batch.timeline || [];

  // Find bloom date from timeline
  const bloomEntry = timeline.find(e => e.stage === 'bloom');
  const harvestInfo = calculateHarvestDate(bloomEntry?.date, variety, customDays);

  const addStageEntry = () => {
    if (!addForm.date) return;
    const newEntry = {
      id: Date.now(),
      stage: addForm.stage,
      label: stageInfo(addForm.stage).label,
      date: addForm.date,
      note: addForm.note
    };
    const newTimeline = [newEntry, ...timeline].sort((a, b) => new Date(b.date) - new Date(a.date));
    onUpdate(batch.id, { timeline: newTimeline, currentStage: newTimeline[0].stage });
    setAddForm({ stage: 'egg', date: new Date().toISOString().slice(0, 10), note: '' });
    setShowAddStage(false);
  };

  const updateEntry = (entryId, updates) => {
    const updated = timeline.map(e => e.id === entryId ? { ...e, ...updates, label: stageInfo(updates.stage || e.stage).label } : e)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    onUpdate(batch.id, { timeline: updated, currentStage: updated[0]?.stage });
  };

  const deleteEntry = (entryId) => {
    if (!window.confirm('ลบรายการระยะนี้?')) return;
    const updated = timeline.filter(e => e.id !== entryId);
    onUpdate(batch.id, { timeline: updated, currentStage: updated[0]?.stage || batch.currentStage });
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', borderLeft: `5px solid ${currentStageInfo.color}` }}>
      {/* Batch header */}
      <div style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1 }} onClick={() => !isEditingName && setOpen(!open)}>
          {isEditingName ? (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }} onClick={e => e.stopPropagation()}>
              <input 
                type="text" 
                value={tempName} 
                onChange={e => setTempName(e.target.value)} 
                autoFocus
                style={{ padding: '6px 10px', fontSize: '1.2rem', fontWeight: 800, borderRadius: '10px', border: '2px solid var(--primary)' }}
              />
              <button onClick={() => { onUpdate(batch.id, { name: tempName }); setIsEditingName(false); }} className="btn btn-primary" style={{ padding: '8px' }}><Check size={18}/></button>
              <button onClick={() => { setTempName(batch.name); setIsEditingName(false); }} className="btn-ghost" style={{ padding: '8px' }}><X size={18}/></button>
            </div>
          ) : (
            <div style={{ fontWeight: 800, fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {batch.name}
              <button onClick={(e) => { e.stopPropagation(); setIsEditingName(true); }} className="btn-ghost" style={{ padding: '4px', opacity: 0.5 }}><Edit2 size={16} /></button>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.9rem', padding: '4px 12px', borderRadius: '10px', background: currentStageInfo.color + '20', color: currentStageInfo.color, fontWeight: 800 }}>
              {currentStageInfo.label}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
              <Calendar size={13} /> {batch.date}
            </span>
            {batch.fruits > 0 && (
              <span style={{ fontSize: '1rem', color: 'var(--primary)', fontWeight: 800 }}>🟢 {batch.fruits} ลูก</span>
            )}
          </div>
          {harvestInfo && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', color: '#b45309', fontSize: '1rem', fontWeight: 800 }}>
              <AlertCircle size={14} /> เก็บเกี่ยว: {new Date(harvestInfo.date).toLocaleDateString('th-TH')}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={(e) => { e.stopPropagation(); onDelete(batch.id); }} className="btn-ghost" style={{ color: 'var(--danger)', padding: '4px' }}>
            <Trash2 size={16} />
          </button>
          {open ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
        </div>
      </div>

      {open && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '1rem 1.25rem' }}>
          {/* Harvest Prediction Alert */}
          {harvestInfo && (
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '10px 14px', marginBottom: '1.25rem', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ background: '#fbbf24', padding: '8px', borderRadius: '50%', color: 'white' }}><Calendar size={18} /></div>
              <div>
                <div style={{ fontSize: '0.9rem', color: '#92400e', fontWeight: 700 }}>พยากรณ์วันเก็บเกี่ยว ({harvestInfo.days} วันหลังดอกบาน)</div>
                <div style={{ fontSize: '1.3rem', color: '#b45309', fontWeight: 900 }}>{new Date(harvestInfo.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
            </div>
          )}



          {/* Add stage */}
          {showAddStage ? (
            <div style={{ background: 'rgba(46,125,50,0.04)', border: '2px solid var(--primary)', borderRadius: '14px', padding: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', color: 'var(--primary)' }}>+ เพิ่มระยะใหม่</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.9rem' }}>ระยะ</label>
                  <select value={addForm.stage} onChange={e => setAddForm({ ...addForm, stage: e.target.value })} style={{ padding: '8px' }}>
                    {DURIAN_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.9rem' }}>วันที่พบระยะนี้</label>
                  <input type="date" value={addForm.date} onChange={e => setAddForm({ ...addForm, date: e.target.value })} style={{ padding: '8px' }} />
                </div>
              </div>
              <div className="input-group" style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.9rem' }}>หมายเหตุ (ไม่บังคับ)</label>
                <input type="text" value={addForm.note} onChange={e => setAddForm({ ...addForm, note: e.target.value })} placeholder="เช่น สมบูรณ์ดี" style={{ padding: '8px' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={addStageEntry} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '12px' }}>
                  <Check size={20} /> บันทึกระยะ
                </button>
                <button onClick={() => setShowAddStage(false)} className="btn-ghost" style={{ padding: '12px 20px', borderRadius: '14px' }}>
                  <X size={20} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddStage(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '14px', borderRadius: '14px', border: '2.5px dashed var(--primary)', background: 'transparent', color: 'var(--primary)', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', marginBottom: '1.25rem', justifyContent: 'center' }}
            >
              <Plus size={20} /> บันทึกระยะถัดไป
            </button>
          )}

          {/* Timeline */}
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} /> ประวัติระยะทั้งหมด
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '4px' }}>
            {timeline.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '1rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '16px' }}>
                ยังไม่มีบันทึกระยะ
              </div>
            )}
            {timeline.map((entry, idx) => (
              <div key={entry.id} style={{ position: 'relative' }}>
                {idx < timeline.length - 1 && (
                  <div style={{ position: 'absolute', left: '6px', top: '24px', bottom: '-16px', width: '2px', background: '#cbd5e1', zIndex: 0 }} />
                )}
                <TimelineEntry entry={entry} onUpdate={updateEntry} onDelete={deleteEntry} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ---- Main Page ----
const TreeRecordPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [trees, setTrees] = useLocalStorage('durian_trees', []);
  const [plots] = useLocalStorage('durian_plots', []);
  const [isSaved, setIsSaved] = useState(false);
  const [showFullQR, setShowFullQR] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowFullQR(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const treeIndex = trees.findIndex(t => t.id === id);
  const existingTree = trees[treeIndex];

  const [treeData, setTreeData] = useState({ id: '', variety: 'หมอนทอง', age: '', customDays: 120, status: 'ปกติ', batches: [], image: null });

  useEffect(() => {
    if (existingTree) {
      setTreeData({ ...existingTree, batches: existingTree.batches || [], customDays: existingTree.customDays || 120, image: existingTree.image || null, age: existingTree.age || '' });
    }
  }, [id]);

  const handleSave = () => {
    if (treeIndex > -1) {
      const updatedTrees = [...trees];
      updatedTrees[treeIndex] = { ...updatedTrees[treeIndex], ...treeData };
      setTrees(updatedTrees);
      
      // Show success feedback instead of navigating out
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const downloadQRCode = () => {
    const qrCanvas = document.getElementById('tree-qr');
    if (qrCanvas) {
      // Create a temporary canvas to combine QR and Text
      const combinedCanvas = document.createElement('canvas');
      const ctx = combinedCanvas.getContext('2d');
      const padding = 40;
      const textSpace = 100;
      
      combinedCanvas.width = qrCanvas.width + (padding * 2);
      combinedCanvas.height = qrCanvas.height + (padding * 2) + textSpace;
      
      // Draw white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);
      
      // Draw QR Code
      ctx.drawImage(qrCanvas, padding, padding);
      
      // Draw Text
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'center';
      
      // Tree ID
      ctx.font = 'bold 32px Kanit, sans-serif';
      ctx.fillText(`ต้น #${treeData.id}`, combinedCanvas.width / 2, qrCanvas.height + padding + 40);
      
      // Variety
      ctx.font = '24px Kanit, sans-serif';
      ctx.fillText(treeData.variety, combinedCanvas.width / 2, qrCanvas.height + padding + 80);
      
      // Download
      const pngUrl = combinedCanvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      let downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `QR_Tree_${treeData.id}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTreeData({ ...treeData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const addNewBatch = () => {
    const today = new Date().toISOString().slice(0, 10);
    const newBatch = {
      id: Date.now(),
      name: `รุ่นที่ ${treeData.batches.length + 1}`,
      currentStage: 'egg',
      fruits: 0,
      date: today,
      timeline: []
    };
    setTreeData({ ...treeData, batches: [newBatch, ...treeData.batches] });
  };

  const updateBatch = (batchId, updates) => {
    setTreeData(prev => ({
      ...prev,
      batches: prev.batches.map(b => b.id === batchId ? { ...b, ...updates } : b)
    }));
  };

  const deleteBatch = (batchId) => {
    if (window.confirm('ลบรุ่นนี้ทั้งหมด?')) {
      setTreeData(prev => ({ ...prev, batches: prev.batches.filter(b => b.id !== batchId) }));
    }
  };

  if (!existingTree) return null;

  const plot = plots.find(p => p.id === existingTree.plotId);

  return (
    <div className="fade-in" style={{ paddingBottom: '9rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
        <button onClick={() => navigate(-1)} className="btn-ghost" style={{ padding: '8px' }}><ArrowLeft size={28} /></button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>ต้น #{treeData.id}</h1>
          {plot && <p style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>{plot.name}</p>}
        </div>
      </div>

      {/* Hero Section: Compact Side by Side */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'stretch' }}>
        {/* Compact Image */}
        <div style={{ position: 'relative', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div 
            onClick={() => fileInputRef.current.click()}
            style={{ 
              width: '120px', 
              height: '140px', 
              background: '#f1f5f9', 
              borderRadius: '24px', 
              overflow: 'hidden', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer',
              border: '2px dashed var(--border)'
            }}
          >
            {treeData.image ? (
              <img src={treeData.image} alt="Tree" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '5px' }}>
                <Camera size={32} style={{ opacity: 0.5, marginBottom: '4px' }} />
                <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>เพิ่มรูป</div>
              </div>
            )}
          </div>
          
          {/* Real QR Code Button */}
          <div 
            onClick={() => setShowFullQR(true)}
            style={{ 
              background: 'white', 
              padding: '10px', 
              borderRadius: '16px', 
              border: '2px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <QRCodeCanvas value={window.location.origin + '/tree/' + treeData.id} size={50} level="H" />
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
        </div>

        {/* Info Part - Grid 2 columns for better space usage */}
        <div className="card" style={{ flex: 1, padding: '1rem', display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>สายพันธุ์:</span>
            <select
              value={treeData.variety}
              onChange={e => setTreeData({ ...treeData, variety: e.target.value })}
              style={{ fontSize: '1.1rem', padding: '8px 10px', borderRadius: '12px', fontWeight: 800, width: '100%', background: '#f8fafc' }}
            >
              {VARIETIES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 800 }}>สุขภาพ:</span>
              <select
                value={treeData.status}
                onChange={e => setTreeData({ ...treeData, status: e.target.value })}
                style={{ fontSize: '1rem', padding: '8px 4px', borderRadius: '10px', fontWeight: 800, width: '100%', background: '#f8fafc', border: '2px solid var(--border)' }}
              >
                <option value="ปกติ">ปกติ</option>
                <option value="ต้องการน้ำ">ขาดน้ำ</option>
                <option value="ป่วย/เป็นโรค">เป็นโรค</option>
                <option value="ออกดอก">ดอก</option>
                <option value="ติดผล">ติดผล</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 800 }}>อายุต้น:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input 
                  type="number" 
                  value={treeData.age} 
                  onChange={e => setTreeData({ ...treeData, age: e.target.value })} 
                  style={{ width: '100%', padding: '8px 2px', fontSize: '1.2rem', fontWeight: 800, textAlign: 'center', borderRadius: '10px', background: '#f8fafc', border: '2px solid var(--border)' }}
                />
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', whiteSpace: 'nowrap' }}>ปี</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 800 }}>จำนวนลูก:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input 
                  type="number" 
                  value={treeData.fruits} 
                  onChange={e => setTreeData({ ...treeData, fruits: e.target.value })} 
                  style={{ width: '100%', padding: '8px 2px', fontSize: '1.2rem', fontWeight: 800, textAlign: 'center', borderRadius: '10px', background: '#f8fafc', border: '2px solid var(--border)' }}
                />
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', whiteSpace: 'nowrap' }}>ลูก</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Batch list */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>รุ่นดอก/ผล ({treeData.batches.length})</h2>
        <button onClick={addNewBatch} className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '14px', fontSize: '1rem' }}>
          <Plus size={20} /> เพิ่มรุ่น
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {treeData.batches.map((batch, idx) => (
          <BatchCard
            key={batch.id}
            batch={batch}
            variety={treeData.variety}
            customDays={treeData.customDays}
            onUpdate={updateBatch}
            onDelete={deleteBatch}
            defaultOpen={idx === 0}
          />
        ))}
        {treeData.batches.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)', background: '#f8fafc', borderRadius: '24px', border: '3px dashed var(--border)' }}>
            <QrCode size={50} style={{ opacity: 0.15, marginBottom: '1rem' }} />
            <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>ยังไม่มีข้อมูลรุ่นดอก</p>
            <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>กด "เพิ่มรุ่น" เพื่อเริ่มบันทึกพัฒนาการ</p>
          </div>
        )}
      </div>

      {/* Success Toast */}
      {isSaved && (
        <div style={{ position: 'fixed', bottom: '10rem', left: '50%', transform: 'translateX(-50%)', background: 'rgba(46,125,50,0.95)', color: 'white', padding: '12px 28px', borderRadius: '40px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', zIndex: 2000, boxShadow: '0 15px 30px rgba(0,0,0,0.2)' }} className="fade-in">
          <Check size={22} /> บันทึกสำเร็จ
        </div>
      )}

      {/* Save FAB */}
      <div style={{ position: 'fixed', bottom: '5.5rem', left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 1000 }}>
        <button
          onClick={handleSave}
          className="btn btn-primary"
          style={{
            padding: '1.25rem 3rem',
            borderRadius: '50px',
            boxShadow: '0 20px 35px rgba(46, 125, 50, 0.4)',
            fontSize: '1.2rem',
            fontWeight: 800,
            gap: '12px',
            background: isSaved ? '#1b5e20' : 'var(--primary)',
            transition: 'all 0.3s'
          }}
        >
          {isSaved ? <Check size={24} /> : <Save size={24} />}
          {isSaved ? 'เรียบร้อย!' : 'บันทึกข้อมูล'}
        </button>
      </div>

      {/* QR Fullscreen Modal */}
      {showFullQR && (
        <div className="modal-overlay" style={{ alignItems: 'center' }}>
          <div className="modal-content" style={{ textAlign: 'center', borderRadius: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>QR Code ประจำต้น</h2>
              <button onClick={() => setShowFullQR(false)} className="btn-ghost" style={{ padding: '8px' }}><X size={28}/></button>
            </div>
            
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', display: 'inline-block', boxShadow: 'var(--shadow-md)', marginBottom: '1.5rem' }}>
              <QRCodeCanvas id="tree-qr" value={window.location.origin + '/tree/' + treeData.id} size={250} level="H" includeMargin={true} />
              <div style={{ marginTop: '1rem', fontWeight: 800, fontSize: '1.4rem' }}>#{treeData.id}</div>
              <div style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 600 }}>{treeData.variety}</div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button className="btn btn-ghost" style={{ padding: '12px', border: '2px solid var(--border)' }} onClick={downloadQRCode}>
                <Download size={20} /> โหลดรูป
              </button>
              <button className="btn btn-primary" style={{ padding: '12px' }} onClick={() => setShowFullQR(false)}>
                ตกลง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreeRecordPage;
