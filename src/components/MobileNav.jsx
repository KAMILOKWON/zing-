import React from 'react';
import { Home, Compass, Plus, Folder, User } from 'lucide-react';
import useStore from '../store/useStore';
import './MobileNav.css';

const MobileNav = ({ onNewIdea }) => {
  const activeTab = useStore(state => state.activeTab);
  const setActiveTab = useStore(state => state.setActiveTab);

  return (
    <nav className="mobile-nav">
      <button 
        className={`mobile-nav-item ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => setActiveTab('home')}
      >
        <Home size={22} />
        <span>홈</span>
      </button>
      <button 
        className={`mobile-nav-item ${activeTab === 'feed' ? 'active' : ''}`}
        onClick={() => setActiveTab('feed')}
      >
        <Compass size={22} />
        <span>피드</span>
      </button>
      <button className="mobile-nav-fab" onClick={onNewIdea}>
        <Plus size={28} />
      </button>
      <button 
        className={`mobile-nav-item ${activeTab === 'explore' ? 'active' : ''}`}
        onClick={() => setActiveTab('explore')}
      >
        <Folder size={22} />
        <span>폴더</span>
      </button>
      <button 
        className={`mobile-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
        onClick={() => setActiveTab('settings')}
      >
        <User size={22} />
        <span>징거</span>
      </button>
    </nav>
  );
};

export default MobileNav;
