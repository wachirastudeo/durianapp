import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  PenLine, 
  Banknote, 
  MoreHorizontal
} from 'lucide-react';
import HomePage from './pages/HomePage';
import OrchardPage from './pages/OrchardPage';
import WorkLogPage from './pages/WorkLogPage';
import FinancePage from './pages/FinancePage';
import SettingsPage from './pages/SettingsPage';
import TreeRecordPage from './pages/TreeRecordPage';
import TaskPlannerPage from './pages/TaskPlannerPage';
import ReportPage from './pages/ReportPage';

function App() {
  return (
    <Router>
      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/orchard" element={<OrchardPage />} />
          <Route path="/logs" element={<WorkLogPage />} />
          <Route path="/finances" element={<FinancePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/tree/:id" element={<TreeRecordPage />} />
          <Route path="/planner" element={<TaskPlannerPage />} />
          <Route path="/reports" element={<ReportPage />} />
        </Routes>
      </div>

      <nav className="bottom-nav">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={22} />
          <span>หน้าหลัก</span>
        </NavLink>
        
        <NavLink to="/orchard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Map size={22} />
          <span>ผังแปลง</span>
        </NavLink>

        {/* Center action-like item if needed, but keeping it simple for now */}
        <NavLink to="/logs" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <PenLine size={22} />
          <span>จดบันทึก</span>
        </NavLink>
        
        <NavLink to="/finances" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Banknote size={22} />
          <span>บัญชีสวน</span>
        </NavLink>
        
        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <MoreHorizontal size={22} />
          <span>เพิ่มเติม</span>
        </NavLink>
      </nav>
    </Router>
  );
}

export default App;
