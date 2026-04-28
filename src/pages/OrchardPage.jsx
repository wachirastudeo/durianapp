import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Map, TreePine, ChevronRight, QrCode, X, Trash2, Edit2, Check, LayoutGrid, CheckSquare, Square, MousePointer2, Calendar, Camera, Printer, Edit } from 'lucide-react';
import { useLocalStorage } from '../hooks/useStorage';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QRCodeCanvas } from 'qrcode.react';

const INITIAL_PLOTS = [
  { id: 1, name: 'แปลงหน้าบ้าน', variety: 'หมอนทอง', area: '2 ไร่' },
  { id: 2, name: 'แปลงริมคลอง', variety: 'ก้านยาว', area: '1.5 ไร่' },
  { id: 3, name: 'แปลงเขาสวนหลวง', variety: 'หมอนทอง, มูซานคิง', area: '5 ไร่' },
];
const INITIAL_TREES = [
  { id: 'TR-001', plotId: 1, variety: 'หมอนทอง', fruits: 25, status: 'ติดผล', age: '12', batches: [] },
  { id: 'TR-002', plotId: 1, variety: 'หมอนทอง', fruits: 18, status: 'ปกติ', age: '10', batches: [] },
];

const VARIETY_CONFIG = {
  'หมอนทอง': { days: 120 },
  'ชะนี': { days: 110 },
  'พวงมณี': { days: 95 },
  'กระดุม': { days: 90 },
  'มูซานคิง': { days: 100 },
  'หนามดำ': { days: 100 },
  'อื่นๆ': { days: 120 }
};

const BATCH_COLORS = [
  { bg: 'linear-gradient(135deg, #fffbeb 0%, #fff7ed 100%)', border: '#fdba74', text: '#92400e', icon: '#f59e0b', dot: '#fed7aa', label: '#b45309', dark: '#451a03' },
  { bg: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)', border: '#c7d2fe', text: '#3730a3', icon: '#6366f1', dot: '#e0e7ff', label: '#4338ca', dark: '#1e1b4b' },
  { bg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', border: '#6ee7b7', text: '#065f46', icon: '#10b981', dot: '#a7f3d0', label: '#047857', dark: '#064e3b' },
  { bg: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)', border: '#f9a8d4', text: '#9d174d', icon: '#ec4899', dot: '#fbcfe8', label: '#be185d', dark: '#500724' },
];

const STATUS_OPTS = ['ปกติ', 'ต้องการน้ำ', 'ป่วย/เป็นโรค', 'ออกดอก', 'ติดผล'];
const DURIAN_STAGES = [
  { id: 'none', label: '-- ไม่ระบุระยะ --' },
  { id: 'egg', label: 'ไข่ปลา/ตาปู' },
  { id: 'rat_foot', label: 'เหยียดตีนหนู' },
  { id: 'eggplant', label: 'มะเขือพวง' },
  { id: 'bloom', label: 'ดอกบาน' },
  { id: 'fruit_set', label: 'หางแย้' },
  { id: 'chicken_egg', label: 'ผลเล็ก (ไข่ปลา)' },
  { id: 'middle_fruit', label: 'ผลกลาง' },
  { id: 'expanding', label: 'ผลใหญ่ (เบ่งพู)' },
  { id: 'fruit', label: 'แก่จัด/เก็บเกี่ยว' },
];

const statusStyle = (s) => {
  const m = {
    'ปกติ': { bg: 'var(--success-bg)', color: 'var(--success)' },
    'ต้องการน้ำ': { bg: 'rgba(251,191,36,0.15)', color: '#d97706' },
    'ป่วย/เป็นโรค': { bg: 'var(--danger-bg)', color: 'var(--danger)' },
    'ออกดอก': { bg: 'rgba(139,92,246,0.1)', color: '#7c3aed' },
    'ติดผล': { bg: 'var(--primary-glow)', color: 'var(--primary)' },
  };
  return m[s] || { bg: 'var(--background)', color: 'var(--text-muted)' };
};

const OrchardPage = () => {
  const navigate = useNavigate();
  const [plots, setPlots] = useLocalStorage('durian_plots', INITIAL_PLOTS);
  const [trees, setTrees] = useLocalStorage('durian_trees', INITIAL_TREES);
  const [selectedPlotId, setSelectedPlotId] = useLocalStorage('last_selected_plot_id', null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedPlot = plots.find(p => p.id === selectedPlotId);
  const setSelectedPlot = (plot) => setSelectedPlotId(plot ? plot.id : null);

  // Bulk Mode States
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [isBulkModal, setIsBulkModal] = useState(false);
  const [selectedTreeIds, setSelectedTreeIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState('ปกติ');
  const [bulkStage, setBulkStage] = useState('none');
  const [bulkTargetBatch, setBulkTargetBatch] = useState('latest'); 
  const [bulkDate, setBulkDate] = useState(new Date().toISOString().slice(0, 10));

  const [isPlotModal, setIsPlotModal] = useState(false);
  const [editPlot, setEditPlot] = useState(null);
  const [plotForm, setPlotForm] = useState({ name: '', variety: '', area: '' });

  const [isTreeModal, setIsTreeModal] = useState(false);
  const [editTree, setEditTree] = useState(null);
  const [treeForm, setTreeForm] = useState({ id: 'TR-', variety: 'หมอนทอง', fruits: 0, status: 'ปกติ', count: 1, age: '' });

  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setIsPlotModal(false);
        setIsTreeModal(false);
        setIsScannerOpen(false);
        setIsBulkMode(false);
        setIsBulkModal(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const openAddPlot = () => { setEditPlot(null); setPlotForm({ name: '', variety: '', area: '' }); setIsPlotModal(true); };
  const openEditPlot = (e, p) => { e.stopPropagation(); setEditPlot(p); setPlotForm({ name: p.name, variety: p.variety, area: p.area }); setIsPlotModal(true); };

  const savePlot = (e) => {
    e.preventDefault();
    if (!plotForm.name.trim()) return;
    if (editPlot) {
      setPlots(plots.map(p => p.id === editPlot.id ? { ...p, ...plotForm } : p));
    } else {
      setPlots([...plots, { id: Date.now(), ...plotForm }]);
    }
    setIsPlotModal(false);
  };

  const deletePlot = (e, id) => {
    e.stopPropagation();
    if (!window.confirm('ลบแปลงนี้ใช่ไหม? ต้นทุเรียนในแปลงจะถูกลบด้วย')) return;
    setPlots(plots.filter(p => p.id !== id));
    setTrees(trees.filter(t => t.plotId !== id));
    if (selectedPlot?.id === id) setSelectedPlot(null);
  };

  const openAddTree = () => { 
    setEditTree(null); 
    setTreeForm({ id: 'TR-', variety: selectedPlot?.variety || 'หมอนทอง', fruits: 0, status: 'ปกติ', count: 1, age: '' }); 
    setIsTreeModal(true); 
  };
  const openEditTree = (e, t) => { e.stopPropagation(); setEditTree(t); setTreeForm({ id: t.id, variety: t.variety, fruits: t.fruits, status: t.status, count: 1, age: t.age || '' }); setIsTreeModal(true); };

  const saveTree = (e) => {
    e.preventDefault();
    if (!treeForm.id.trim()) return;

    if (editTree) {
      setTrees(trees.map(t => t.id === editTree.id ? { ...t, variety: treeForm.variety, fruits: parseInt(treeForm.fruits) || 0, status: treeForm.status, age: treeForm.age } : t));
    } else {
      const count = parseInt(treeForm.count) || 1;
      const newTreesList = [];
      const prefix = treeForm.id;
      const existingIds = trees.map(t => t.id);
      
      let added = 0;
      let attempt = 1;
      while (added < count && attempt < 1000) {
        const paddedNum = attempt.toString().padStart(3, '0');
        const newId = prefix.includes('-') ? `${prefix}${paddedNum}` : `${prefix}${attempt}`;
        
        if (!existingIds.includes(newId)) {
          newTreesList.push({
            id: newId,
            plotId: selectedPlot.id,
            variety: treeForm.variety || 'ไม่ระบุ',
            fruits: 0,
            status: treeForm.status,
            age: treeForm.age,
            batches: []
          });
          added++;
        }
        attempt++;
      }
      setTrees([...trees, ...newTreesList]);
    }
    setIsTreeModal(false);
  };

  const deleteTree = (e, treeId) => {
    e.stopPropagation();
    if (!window.confirm('ลบต้นทุเรียนนี้ใช่ไหม?')) return;
    setTrees(trees.filter(t => t.id !== treeId));
  };

  const plotTrees = trees.filter(t => t.plotId === selectedPlot?.id);

  const getPlotHarvestSummary = () => {
    const allBlooms = [];
    plotTrees.forEach(tree => {
      (tree.batches || []).forEach(batch => {
        const bloomEntry = (batch.timeline || []).find(e => e.stage === 'bloom');
        if (bloomEntry) {
          allBlooms.push({ date: new Date(bloomEntry.date), variety: tree.variety });
        }
      });
    });

    if (allBlooms.length === 0) return [];
    const batches = [];
    allBlooms.sort((a, b) => a.date - b.date).forEach(bloom => {
      let foundBatch = batches.find(b => Math.abs(b.startDate - bloom.date) < 10 * 24 * 60 * 60 * 1000);
      if (foundBatch) {
        if (bloom.date < foundBatch.startDate) foundBatch.startDate = bloom.date;
      } else {
        batches.push({ startDate: bloom.date, variety: bloom.variety });
      }
    });

    return batches.map((b, i) => {
      const days = VARIETY_CONFIG[b.variety]?.days || 120;
      const harvestDate = new Date(b.startDate);
      harvestDate.setDate(harvestDate.getDate() + days);
      return { id: i + 1, bloom: b.startDate, harvest: harvestDate };
    });
  };

  const harvestBatches = getPlotHarvestSummary();

  const toggleTreeSelection = (id) => {
    if (selectedTreeIds.includes(id)) {
      setSelectedTreeIds(selectedTreeIds.filter(tid => tid !== id));
    } else {
      setSelectedTreeIds([...selectedTreeIds, id]);
    }
  };

  const selectAll = () => {
    if (selectedTreeIds.length === plotTrees.length) {
      setSelectedTreeIds([]);
    } else {
      setSelectedTreeIds(plotTrees.map(t => t.id));
    }
  };

  const handleBulkApply = () => {
    if (selectedTreeIds.length === 0) {
      alert('กรุณาเลือกต้นทุเรียนที่ต้องการอัปเดต');
      return;
    }

    const newTrees = trees.map(t => {
      if (selectedTreeIds.includes(t.id)) {
        const updatedTree = { ...t, status: bulkStatus };
        if (bulkStage !== 'none') {
          const stageLabel = DURIAN_STAGES.find(s => s.id === bulkStage)?.label;
          const newEntry = { id: Date.now(), stage: bulkStage, label: stageLabel, date: bulkDate, note: 'บันทึกยกแปลง' };
          
          let updatedBatches = [...(t.batches || [])];
          if (bulkTargetBatch === 'new') {
            updatedBatches.unshift({ id: Date.now(), name: `รุ่น ${updatedBatches.length + 1}`, currentStage: bulkStage, date: bulkDate, fruits: 0, timeline: [newEntry] });
          } else {
            let targetIdx = bulkTargetBatch === 'latest' ? 0 : updatedBatches.findIndex(b => b.name.includes(bulkTargetBatch));
            if (targetIdx !== -1 && updatedBatches[targetIdx]) {
              const targetBatch = { ...updatedBatches[targetIdx] };
              targetBatch.timeline = [newEntry, ...(targetBatch.timeline || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
              targetBatch.currentStage = targetBatch.timeline[0].stage;
              updatedBatches[targetIdx] = targetBatch;
            } else {
              updatedBatches.unshift({ id: Date.now(), name: 'รุ่น 1', currentStage: bulkStage, date: bulkDate, fruits: 0, timeline: [newEntry] });
            }
          }
          updatedTree.batches = updatedBatches;
        }
        return updatedTree;
      }
      return t;
    });

    setTrees(newTrees);
    setIsBulkMode(false);
    setIsBulkModal(false);
    setSelectedTreeIds([]);
    alert(`อัปเดตทุเรียน ${selectedTreeIds.length} ต้น เรียบร้อยแล้ว`);
  };

  const filteredPlots = plots.filter(p => p.name.includes(searchQuery) || p.variety.includes(searchQuery));

  return (
    <div className="fade-in" style={{ paddingBottom: '100px' }}>
      {!selectedPlot ? (
        <>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '1.7rem', fontWeight: 600 }}>ผังแปลงทุเรียน</h1>
            <div style={{ display: 'flex', gap: '8px' }}>
               <button onClick={() => setIsScannerOpen(true)} className="btn btn-ghost" style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'white', border: '2px solid var(--border)', padding: 0 }}>
                <QrCode size={24} color="var(--primary)" />
              </button>
              <button onClick={openAddPlot} className="btn btn-primary" style={{ padding: '0.75rem 1rem', borderRadius: '14px' }}>
                <Plus size={24} /><span>เพิ่มแปลง</span>
              </button>
            </div>
          </header>

          <div className="input-group" style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <Search size={22} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="ค้นหาชื่อแปลง หรือสายพันธุ์..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ paddingLeft: '45px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'แปลง', value: plots.length, unit: 'แปลง', color: 'var(--primary)' },
              { label: 'ทุเรียน', value: trees.length, unit: 'ต้น', color: 'var(--accent)' },
              { label: 'ปกติ', value: trees.filter(t => t.status === 'ปกติ' || t.status === 'ติดผล').length, unit: 'ต้น', color: 'var(--success)' },
            ].map((s, i) => (
              <div key={i} className="card" style={{ padding: '1rem', textAlign: 'center', borderBottom: `4px solid ${s.color}` }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredPlots.map(plot => (
              <div key={plot.id} className="card" onClick={() => setSelectedPlot(plot)} style={{ cursor: 'pointer', borderLeft: '6px solid var(--primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>{plot.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                      <Map size={18} /><span>{plot.area}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ background: 'var(--primary-glow)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)' }}>{plot.variety}</span>
                    <button onClick={e => openEditPlot(e, plot)} className="btn-ghost" style={{ padding: '8px' }}><Edit size={20} /></button>
                    <button onClick={e => deletePlot(e, plot.id)} className="btn-ghost" style={{ padding: '8px', color: 'var(--danger)' }}><Trash2 size={20} /></button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', paddingTop: '1rem', borderTop: '1.5px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TreePine size={24} color="var(--primary)" />
                    <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>{trees.filter(t => t.plotId === plot.id).length}</span>
                    <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 700 }}>ต้น</span>
                  </div>
                  <button className="btn-ghost" style={{ marginLeft: 'auto', fontSize: '1.1rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    เปิดดู <ChevronRight size={22} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {isPlotModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>{editPlot ? 'แก้ไขข้อมูลแปลง' : 'เพิ่มแปลงใหม่'}</h2>
                  <button onClick={() => setIsPlotModal(false)} className="btn-ghost" style={{ padding: '8px' }}><X size={32} /></button>
                </div>
                <form onSubmit={savePlot}>
                  <div className="input-group">
                    <label>ชื่อแปลง *</label>
                    <input required type="text" value={plotForm.name} onChange={e => setPlotForm({ ...plotForm, name: e.target.value })} placeholder="เช่น แปลงริมคลอง" />
                  </div>
                  <div className="input-group">
                    <label>สายพันธุ์หลัก</label>
                    <input type="text" value={plotForm.variety} onChange={e => setPlotForm({ ...plotForm, variety: e.target.value })} placeholder="เช่น หมอนทอง" />
                  </div>
                  <div className="input-group">
                    <label>พื้นที่</label>
                    <input type="text" value={plotForm.area} onChange={e => setPlotForm({ ...plotForm, area: e.target.value })} placeholder="เช่น 1 ไร่" />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem', padding: '1rem', fontSize: '1.2rem' }}>
                    <Check size={24} /> {editPlot ? 'บันทึกการแก้ไข' : 'ยืนยันเพิ่มแปลง'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <button onClick={() => {setSelectedPlot(null); setIsBulkMode(false);}} className="btn-ghost" style={{ padding: '10px', borderRadius: '14px', background: 'white', border: '2px solid var(--border)' }}>
              <ChevronRight size={28} style={{ transform: 'rotate(180deg)' }} />
            </button>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>{selectedPlot.name}</h1>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 700 }}>{plotTrees.length} ต้น</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button 
                onClick={() => {
                  setSelectedTreeIds(plotTrees.map(t => t.id));
                  setIsBulkModal(true);
                  setIsBulkMode(true);
                }} 
                className="btn" 
                style={{ 
                  padding: '12px 18px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', 
                  background: 'var(--accent)',
                  color: 'black',
                  fontWeight: 600, boxShadow: '0 8px 20px rgba(255, 179, 0, 0.3)'
                }}
              >
                <CheckSquare size={24} />
                <span>จัดการยกแปลง</span>
              </button>
              <button onClick={() => window.print()} className="btn btn-ghost" style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'white', border: '2px solid var(--border)', padding: 0 }}><Printer size={24} /></button>
              <button onClick={openAddTree} className="btn btn-primary" style={{ width: '52px', height: '52px', borderRadius: '16px', padding: 0 }}><Plus size={32} /></button>
            </div>
          </header>

          {harvestBatches.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {harvestBatches.map((batch, idx) => {
                const colors = BATCH_COLORS[idx % BATCH_COLORS.length];
                return (
                  <div key={batch.id} className="card" style={{ background: colors.bg, border: `2px solid ${colors.border}`, padding: '1.5rem', borderRadius: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                      <div style={{ background: colors.icon, color: 'white', padding: '6px 12px', borderRadius: '12px', fontWeight: 700, fontSize: '1.1rem' }}>รุ่น {batch.id}</div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: colors.text }}>แผนเก็บเกี่ยว</h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: colors.label }}>🌸 ดอกบาน</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 900, color: colors.dark }}>{batch.bloom.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}</div>
                      </div>
                      <div style={{ borderLeft: `2px solid ${colors.dot}`, paddingLeft: '1rem' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: colors.label }}>📦 เก็บเกี่ยว</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 700, color: colors.dark }}>{batch.harvest.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {isBulkMode && !isBulkModal && (
            <div style={{ background: 'var(--primary)', color: 'white', padding: '1rem', borderRadius: '20px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 25px rgba(46, 125, 50, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={selectAll} className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px', borderRadius: '12px', fontWeight: 800, border: 'none' }}>
                  {selectedTreeIds.length === plotTrees.length ? 'ยกเลิกเลือก' : 'เลือกทั้งหมด'}
                </button>
                <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>เลือก {selectedTreeIds.length} ต้น</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => setIsBulkModal(true)} 
                  className="btn" 
                  disabled={selectedTreeIds.length === 0}
                  style={{ background: white, color: 'var(--primary)', padding: '8px 20px', borderRadius: '12px', fontWeight: 700, opacity: selectedTreeIds.length === 0 ? 0.6 : 1, border: 'none' }}
                >
                  บันทึกข้อมูล
                </button>
                <button onClick={() => {setIsBulkMode(false); setSelectedTreeIds([]);}} className="btn-ghost" style={{ padding: '8px', color: 'white', background: 'transparent', border: 'none' }}><X size={24}/></button>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {plotTrees.map(tree => {
              const badge = statusStyle(tree.status);
              const isSelected = selectedTreeIds.includes(tree.id);
              return (
                <div key={tree.id} className="card" onClick={() => isBulkMode ? toggleTreeSelection(tree.id) : navigate(`/tree/${tree.id}`)} style={{ padding: '1.25rem', border: isSelected ? '3px solid var(--primary)' : '1.5px solid var(--border-light)', background: isSelected ? 'var(--primary-glow)' : 'white', borderRadius: '24px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ background: isSelected ? 'var(--primary)' : 'var(--background)', color: isSelected ? 'white' : 'var(--primary)', padding: '10px', borderRadius: '14px' }}>
                      {isBulkMode ? (isSelected ? <CheckSquare size={26} /> : <Square size={26} />) : <QrCode size={24} />}
                    </div>
                    <div style={{ padding: '6px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, background: badge.bg, color: badge.color }}>{tree.status}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '2px' }}>#{tree.id}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '12px' }}>{tree.variety} {tree.age && `(${tree.age} ปี)`}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1.5px solid var(--border-light)' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>{tree.fruits} ลูก</span>
                    {!isBulkMode && (
                      <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                        <button onClick={e => openEditTree(e, tree)} className="btn-ghost" style={{ padding: '6px' }}><Edit size={20}/></button>
                        <button onClick={e => deleteTree(e, tree.id)} className="btn-ghost" style={{ padding: '6px', color: 'var(--danger)' }}><Trash2 size={20}/></button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {isTreeModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>{editTree ? 'แก้ไขข้อมูลต้น' : 'เพิ่มต้นใหม่'}</h2>
              <button onClick={() => setIsTreeModal(false)} className="btn-ghost" style={{ padding: '8px' }}><X size={32} /></button>
            </div>
            <form onSubmit={saveTree}>
              <div className="input-group"><label>รหัสต้นทุเรียน *</label><input required type="text" value={treeForm.id} onChange={e => setTreeForm({ ...treeForm, id: e.target.value })} disabled={!!editTree} /></div>
              {!editTree && <div className="input-group"><label>จำนวนต้น *</label><input required type="number" min="1" value={treeForm.count} onChange={e => setTreeForm({ ...treeForm, count: e.target.value })} /></div>}
              <div className="input-group"><label>อายุต้น (ปี)</label><input type="number" value={treeForm.age} onChange={e => setTreeForm({ ...treeForm, age: e.target.value })} /></div>
              <div className="input-group"><label>สายพันธุ์</label><select value={treeForm.variety} onChange={e => setTreeForm({ ...treeForm, variety: e.target.value })}>{['หมอนทอง', 'ชะนี', 'พวงมณี', 'กระดุม', 'อื่นๆ'].map(v => <option key={v} value={v}>{v}</option>)}</select></div>
              <div className="input-group"><label>สถานะ</label><select value={treeForm.status} onChange={e => setTreeForm({ ...treeForm, status: e.target.value })}>{STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.2rem', marginTop: '1rem' }}><Check size={24}/> ยืนยัน</button>
            </form>
          </div>
        </div>
      )}

      {isScannerOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}><h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>สแกน QR Code</h2><button onClick={() => setIsScannerOpen(false)} className="btn-ghost"><X size={32}/></button></div>
            <div id="reader"></div>
          </div>
        </div>
      )}

      {/* Print Section */}
      <div id="print-section" className="print-only">
        {plotTrees.map(tree => (
          <div key={tree.id} style={{ border: '3px solid black', padding: '20px', textAlign: 'center', marginBottom: '20px', breakInside: 'avoid', borderRadius: '20px' }}>
            <div style={{ fontSize: '24pt', fontWeight: 700 }}>#{tree.id}</div>
            <QRCodeCanvas value={window.location.origin + '/tree/' + tree.id} size={250} level="H" includeMargin={true} />
            <div style={{ fontSize: '18pt', fontWeight: 800 }}>{tree.variety}</div>
          </div>
        ))}
      </div>
      {/* Bulk Management Modal */}
      {isBulkModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ border: '4px solid var(--primary)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>🌿 บันทึกยกแปลง</h2>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 700 }}>{selectedTreeIds.length === trees.filter(t => t.plotId === selectedPlot?.id).length ? 'ทุกต้นในแปลงนี้' : `${selectedTreeIds.length} ต้นที่เลือก`}</p>
              </div>
              <button 
                onClick={() => {setIsBulkModal(false); setIsBulkMode(false); setSelectedTreeIds([]);}} 
                className="btn-ghost" 
                style={{ padding: '12px', borderRadius: '50%', background: 'var(--background)' }}
              >
                <X size={32} />
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleBulkApply(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <LayoutGrid size={22} /> เลือกรุ่น (Batch)
                </label>
                <select 
                  value={bulkTargetBatch} 
                  onChange={e => setBulkTargetBatch(e.target.value)}
                  style={{ padding: '1rem', fontSize: '1.2rem', fontWeight: 600 }}
                >
                  <option value="latest">รุ่นล่าสุด (อัปเดตต่อเนื่อง)</option>
                  <option value="1">รุ่นที่ 1</option>
                  <option value="2">รุ่นที่ 2</option>
                  <option value="new">+ สร้างรุ่นใหม่แยกต่างหาก</option>
                </select>
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MousePointer2 size={22} /> สถานะสุขภาพต้น
                </label>
                <select 
                  value={bulkStatus} 
                  onChange={e => setBulkStatus(e.target.value)}
                  style={{ padding: '1rem', fontSize: '1.2rem', fontWeight: 600 }}
                >
                  {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={22} /> ระยะดอก/ผลปัจจุบัน
                </label>
                <select 
                  value={bulkStage} 
                  onChange={e => setBulkStage(e.target.value)}
                  style={{ padding: '1rem', fontSize: '1.2rem', fontWeight: 600 }}
                >
                  {DURIAN_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>

              <div className="input-group" style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={22} /> วันที่บันทึก
                </label>
                <input 
                  type="date" 
                  value={bulkDate} 
                  onChange={e => setBulkDate(e.target.value)} 
                  style={{ padding: '1rem', fontSize: '1.2rem', fontWeight: 600 }}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ 
                  width: '100%', 
                  padding: '1.5rem', 
                  fontSize: '1.5rem', 
                  borderRadius: '24px', 
                  boxShadow: 'var(--shadow-primary)',
                  marginTop: '1rem',
                  border: 'none'
                }}
              >
                <Check size={32} /> บันทึกทั้งหมด
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrchardPage;
