import React, { useState } from 'react';
import { Search, Bell, Plus, Minus, Square, X } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import useStore from '../store/useStore';
import './Header.css';

const Header = ({ onNewIdea, onLoginClick, onToggleSidebar, onToggleZenMode, onClosePanels, isSidebarCollapsed, isZenMode }) => {
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const searchQuery = useStore(state => state.searchQuery);
  const setSearchQuery = useStore(state => state.setSearchQuery);
  const user = useStore(state => state.user);
  const signOut = useStore(state => state.signOut);

  return (
    <header className="app-header">
      <div className="header-search">
        <Search size={18} className="search-icon" />
        <input 
          type="text" 
          placeholder="아이디어, 주제, 사람 검색..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span className="search-shortcut">⌘K</span>
      </div>
      
      <div className="header-actions">
        <div className="live-status">
          <span className="live-dot"></span>
          <span className="live-text">LIVE</span>
          <span className="live-count">시스템 정상</span>
        </div>
        
        <button className="btn-primary" onClick={onNewIdea}>
          <Plus size={16} />
          <span className="btn-text">새 아이디어</span>
        </button>
        
        <div className="action-icons">
          <button 
            className={`icon-btn ${isNotiOpen ? 'active-noti' : ''}`}
            onClick={() => setIsNotiOpen(!isNotiOpen)}
          >
            <Bell size={20} />
          </button>
          
          {user ? (
            <div className="user-profile-head">
              <div className="user-avatar" onClick={signOut} title="로그아웃">
                {user.email[0].toUpperCase()}
              </div>
            </div>
          ) : (
            <button className="login-trigger-btn" onClick={onLoginClick}>
              로그인
            </button>
          )}
        </div>
        
        <div className="window-controls">
          <button 
            title={isSidebarCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
            onClick={onToggleSidebar}
          >
            <Minus size={16} />
          </button>
          <button 
            title={isZenMode ? "젠 모드 해제" : "젠 모드 (몰입)"}
            onClick={onToggleZenMode}
          >
            <Square size={14} className={isZenMode ? 'fill-current' : ''} />
          </button>
          <button 
            title="패널 닫기"
            onClick={onClosePanels}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {isNotiOpen && (
        <NotificationDropdown onClose={() => setIsNotiOpen(false)} />
      )}
    </header>
  );
};

export default Header;
