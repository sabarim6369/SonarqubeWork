import './sidebar.css';
import { LayoutDashboard, Users, LogOut, BookOpen, ArrowLeft, ArrowRight, GraduationCap, Trophy } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import RAMPeXLogo from '../../assets/icons/logo-CXQZ-lcC.png';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname.startsWith(path);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('Token');
    console.log("Logged Out");
    window.location.href = "/login"
  };

  return (
    <div className={`sidebar-container ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-top">
        <div className="sidebar-header">
          <div className="sidebar-toggle-btn" onClick={toggleSidebar}>
            {isOpen ? (
              <ArrowLeft color="white" size="1.2em" />
            ) : (
              <ArrowRight color="#9CA3AF" size="1.2em" />
            )}
          </div>
          {isOpen && <span className='rampex-logo-sidebar-container' >
            <img src={RAMPeXLogo} alt="Logo" className='rampex-logo-sidebar' />
          </span>}
        </div>
        {isOpen && (
          <div className="sidebar-links">
            <div
              className={`sidebar-link ${isActive('/admin') ? 'sidebar-link-active' : ''}`}
              onClick={() => handleNavigation('/admin')}
            >
              <LayoutDashboard
                color={isActive('/admin') ? 'white' : '#9CA3AF'}
                size="1.5em"
              />
              Dashboard
            </div>
            <div
              className={`sidebar-link ${isActive('/trainers') ? 'sidebar-link-active' : ''}`}
              onClick={() => handleNavigation('/trainers')}
            >
              <Users
                color={isActive('/trainers') ? 'white' : '#9CA3AF'}
                size="1.5em"
              />
              Trainers
            </div>
            <div
              className={`sidebar-link ${isActive('/programs') ? 'sidebar-link-active' : ''}`}
              onClick={() => handleNavigation('/programs')}
            >
              <BookOpen
                color={isActive('/programs') ? 'white' : '#9CA3AF'}
                size="1.5em"
              />
              Programs
            </div>
            <div
              className={`sidebar-link ${isActive('/colleges') ? 'sidebar-link-active' : ''}`}
              onClick={() => handleNavigation('/colleges')}
            >
              <GraduationCap
                color={isActive('/colleges') ? 'white' : '#9CA3AF'}
                size="1.5em"
              />
              Colleges
            </div>
            <div
              className={`sidebar-link ${isActive('/problems') ? 'sidebar-link-active' : ''}`}
              onClick={() => handleNavigation('/problems')}
            >
              <Trophy
                color={isActive('/problems') ? 'white' : '#9CA3AF'}
                size="1.3em"
              />
              Problems
            </div>
          </div>
        )}
      </div>
      {isOpen && (
        <div className="sidebar-bottom">
          <div
            className={`sidebar-link sidebar-logout-link`}
            onClick={handleLogout}
          >
            <LogOut color="#9CA3AF" size="1.5em" />
            Log Out
          </div>
        </div>
      )}
    </div>
  );
}
