import React, { useState, useEffect } from 'react'
import useStore from './store/useStore'
import { X } from 'lucide-react'
import Sidebar from './components/Sidebar'
import MainFeed from './components/MainFeed'
import Header from './components/Header'
import IdeaEditorPanel from './components/IdeaEditorPanel'
import IdeaDetailPanel from './components/IdeaDetailPanel'
import NotificationView from './components/NotificationView'
import ExploreView from './components/ExploreView'
import CommandPalette from './components/CommandPalette'
import DesktopHome from './components/DesktopHome'
import AdminDashboard from './components/AdminDashboard'
import SettingsView from './components/SettingsView'
import AuthModal from './components/AuthModal'
import MobileNav from './components/MobileNav'
import { supabase } from './lib/supabase'
import './App.css'

function App() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [remixTarget, setRemixTarget] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const activeTab = useStore(state => state.activeTab);
  const isCommandPaletteOpen = useStore(state => state.isCommandPaletteOpen);
  const setCommandPaletteOpen = useStore(state => state.setCommandPaletteOpen);
  const addToRecent = useStore(state => state.addToRecent);
  const setUser = useStore(state => state.setUser);
  const setSession = useStore(state => state.setSession);
  const fetchIdeas = useStore(state => state.fetchIdeas);
  const user = useStore(state => state.user);
  
  // 레이아웃 상태 추가
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);

  useEffect(() => {
    // 세션 초기화
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // 초기 데이터 로드
    fetchIdeas();

    // 실시간 DB 구독 설정
    const ideasSubscription = supabase
      .channel('public:ideas')
      .on('postgres_changes', { event: '*', table: 'ideas' }, () => {
        fetchIdeas();
      })
      .subscribe();

    const commentsSubscription = supabase
      .channel('public:comments')
      .on('postgres_changes', { event: '*', table: 'comments' }, () => {
        fetchIdeas();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(ideasSubscription);
      supabase.removeChannel(commentsSubscription);
    };
  }, []);

  // Command Palette & Zen 모드 단축키 리스너
  useEffect(() => {
    const handleKeyDown = (e) => {
      // CMD + K or CTRL + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      
      if (e.key === 'Escape') {
        if (isCommandPaletteOpen) setCommandPaletteOpen(false);
        if (isZenMode) setIsZenMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, isZenMode]);

  const openEditor = (target = null) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setRemixTarget(target);
    setIsEditorOpen(true);
    setSelectedIdea(null); // 상세 패널 닫기
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setRemixTarget(null);
  };

  const openDetail = (idea) => {
    setSelectedIdea(idea);
    addToRecent(idea.id);
    setIsEditorOpen(false); // 에디터 패널 닫기
  };

  const closeDetail = () => {
    setSelectedIdea(null);
  };

  const isPanelOpen = isEditorOpen || selectedIdea !== null;

  const renderMainContent = () => {
    switch (activeTab) {
      case 'notifications':
        return <NotificationView />;
      case 'explore':
        return <ExploreView onIdeaClick={openDetail} />;
      case 'home':
        return <DesktopHome onIdeaClick={openDetail} onNewIdea={() => openEditor(null)} />;
      case 'admin':
        return <AdminDashboard />;
      case 'settings':
        return <SettingsView />;
      case 'profile':
        return <div className="placeholder-view"><h1>프로필 페이지 준비 중...</h1></div>;
      default:
        return <MainFeed onIdeaClick={openDetail} onRemixClick={openEditor} onNewIdea={() => openEditor(null)} />;
    }
  };

  return (
    <div className={`app-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''} ${isZenMode ? 'zen-mode' : ''}`}>
      {!isZenMode && (
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onIdeaClick={openDetail}
        />
      )}
      <div className="main-content">
        <Header 
          onNewIdea={() => openEditor(null)} 
          onLoginClick={() => setIsAuthModalOpen(true)}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onToggleZenMode={() => setIsZenMode(!isZenMode)}
          onClosePanels={() => { closeEditor(); closeDetail(); }}
          isSidebarCollapsed={isSidebarCollapsed}
          isZenMode={isZenMode}
        />
        <div className={`content-area ${isPanelOpen ? 'panel-open' : ''}`}>
          {renderMainContent()}
          
          {isEditorOpen && (
            <IdeaEditorPanel 
              onClose={closeEditor} 
              remixTarget={remixTarget} 
            />
          )}

          {selectedIdea && (
            <IdeaDetailPanel 
              idea={selectedIdea} 
              onClose={closeDetail} 
              onRemixClick={() => openEditor(selectedIdea)} 
              onIdeaClick={openDetail}
            />
          )}
        </div>
      </div>
      
      {isZenMode && (
        <button 
          className="exit-zen-btn" 
          onClick={() => setIsZenMode(false)}
          title="젠 모드 종료 (ESC)"
        >
          <X size={18} />
          <span>몰입 종료</span>
        </button>
      )}

      {isCommandPaletteOpen && (
        <CommandPalette onClose={() => setCommandPaletteOpen(false)} />
      )}

      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}

      <MobileNav onNewIdea={() => openEditor(null)} />
    </div>
  )
}

export default App
