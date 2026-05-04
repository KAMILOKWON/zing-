import React from 'react';
import { Home, Compass, Sparkles, Bell, User, Settings, Folder, Plus, FileText, LayoutGrid, X, Shield } from 'lucide-react';
import useStore from '../store/useStore';
import './Sidebar.css';

const Sidebar = ({ isCollapsed, onIdeaClick }) => {
  const ideas = useStore(state => state.ideas);
  const filter = useStore(state => state.filter);
  const setFilter = useStore(state => state.setFilter);
  const activeTab = useStore(state => state.activeTab);
  const setActiveTab = useStore(state => state.setActiveTab);
  const folders = useStore(state => state.folders);
  const addFolder = useStore(state => state.addFolder);
  const deleteFolder = useStore(state => state.deleteFolder);
  const recentViewedIds = useStore(state => state.recentViewedIds);
  const isAdmin = useStore(state => state.isAdmin);

  const [isAddingFolder, setIsAddingFolder] = React.useState(false);
  const [newFolderName, setNewFolderName] = React.useState('');

  const recentIdeas = recentViewedIds
    .map(id => ideas.find(i => i.id === id))
    .filter(Boolean)
    .slice(0, 5);
  return (
    <aside className={`sidebar-container ${isCollapsed ? 'collapsed' : ''}`}>
      {/* LNB (Left Navigation Bar) */}
      <nav className="lnb">
        <div className="logo-container">
          <img src="/logo.png" alt="Zing!" className="logo-image" />
        </div>
        
        <div className="lnb-menu">
          <button 
            className={`lnb-item ${activeTab === 'home' ? 'active' : ''}`} 
            onClick={() => setActiveTab('home')}
          >
            <Home size={24} />
            <span>홈</span>
          </button>
          <button 
            className={`lnb-item ${activeTab === 'feed' ? 'active' : ''}`}
            onClick={() => setActiveTab('feed')}
          >
            <Compass size={24} />
            <span>피드</span>
          </button>
          <button 
            className={`lnb-item ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => setActiveTab('explore')}
          >
            <Sparkles size={24} />
            <span>탐색</span>
          </button>
          <button 
            className={`lnb-item ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <div className="icon-badge-wrapper">
              <Bell size={24} />
            </div>
            <span>알림</span>
          </button>
          <button 
            className={`lnb-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={24} />
            <span>프로필</span>
          </button>
        </div>
        
        <div className="lnb-bottom">
          {isAdmin && (
            <button 
              className={`lnb-item ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              <Shield size={24} />
              <span>관리자 도구</span>
            </button>
          )}
          <button 
            className={`lnb-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={24} />
            <span>설정</span>
          </button>
        </div>
      </nav>

      {/* Folder Explorer - Hide when collapsed */}
      {!isCollapsed && (
        <div className="community-hub">
          <div className="hub-header">
            <h2>탐색기</h2>
          </div>

          <div className="menu-section">
            <h3 className="section-title">내 공간</h3>
            <button 
              className={`menu-item ${activeTab === 'feed' && filter === '내 게시글' ? 'active' : ''}`} 
              onClick={() => { setActiveTab('feed'); setFilter('내 게시글'); }}
            >
              <FileText size={18} className="menu-icon" />
              <span>내 게시글</span>
            </button>
          </div>

          <div className="menu-section">
            <div className="section-header">
              <h3 className="section-title">폴더</h3>
              <button 
                className="add-btn" 
                onClick={() => setIsAddingFolder(true)}
              >
                <Plus size={14} />
              </button>
            </div>
            
            <button 
              className={`menu-item ${activeTab === 'feed' && filter === '전체' ? 'active' : ''}`} 
              onClick={() => { setActiveTab('feed'); setFilter('전체'); }}
            >
              <LayoutGrid size={18} className="menu-icon" />
              <span>전체 피드</span>
            </button>

            {isAddingFolder && (
              <div className="menu-item folder-input-wrapper">
                <span className="emoji-icon">📁</span>
                <input 
                  autoFocus
                  className="folder-name-input"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newFolderName.trim()) {
                      addFolder(newFolderName.trim(), '📁');
                      setNewFolderName('');
                      setIsAddingFolder(false);
                    } else if (e.key === 'Escape') {
                      setIsAddingFolder(false);
                      setNewFolderName('');
                    }
                  }}
                  onBlur={() => {
                    if (!newFolderName.trim()) setIsAddingFolder(false);
                  }}
                />
              </div>
            )}

            {folders.map(folder => (
              <div key={folder.id} className={`menu-item-wrapper ${activeTab === 'feed' && filter === folder.label ? 'active' : ''}`}>
                <button 
                  className="menu-item folder-item"
                  onClick={() => { setActiveTab('feed'); setFilter(folder.label); }}
                >
                  <span className="emoji-icon">{folder.emoji}</span>
                  <span>{folder.label}</span>
                </button>
                <button 
                  className="delete-folder-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    deleteFolder(folder.label);
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          <div className="menu-section">
            <div className="section-header">
              <h3 className="section-title">최근 열어본</h3>
            </div>
            {recentIdeas.length === 0 ? (
              <p className="empty-recent-text">최근 본 글이 없습니다.</p>
            ) : (
              recentIdeas.map(idea => (
                <button 
                  key={idea.id} 
                  className="menu-item recent-item"
                  onClick={() => onIdeaClick(idea)}
                >
                  <FileText size={16} className="menu-icon" />
                  <span className="flex-1 truncate">{idea.title}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

    </aside>
  );
};

export default Sidebar;
