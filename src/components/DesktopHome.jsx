import React from 'react';
import { Clock, Star, Zap, LayoutGrid, FileText, Sparkles, ChevronRight, Plus } from 'lucide-react';
import useStore from '../store/useStore';
import './DesktopHome.css';

const DesktopHome = ({ onIdeaClick, onNewIdea }) => {
  const ideas = useStore(state => state.ideas);
  const recentViewedIds = useStore(state => state.recentViewedIds);
  const setActiveTab = useStore(state => state.setActiveTab);
  const setSortMode = useStore(state => state.setSortMode);
  
  const recentIdeas = recentViewedIds
    .map(id => ideas.find(i => i.id === id))
    .filter(Boolean);
    
  const popularIdeas = [...ideas].sort((a, b) => b.likes - a.likes).slice(0, 3);
  const newIdeas = [...ideas].sort((a, b) => b.id - a.id).slice(0, 3);

  const navigateToFeed = (sort = 'latest') => {
    setActiveTab('feed');
    setSortMode(sort);
  };

  return (
    <div className="desktop-home">
      <header className="home-hero">
        <div className="hero-content">
          <h1>안녕하세요, Zingger님! 👋</h1>
          <p>오늘도 당신의 반짝이는 아이디어를 기록하고 연결해보세요.</p>
        </div>
      <header className="home-hero">
        <div className="hero-content">
          <h1>안녕하세요, Zingger님! 👋</h1>
          <p>오늘도 당신의 반짝이는 아이디어를 기록하고 연결해보세요.</p>
        </div>
      </header>

      <section className="home-section">
        <div className="section-header">
          <div className="section-title">
            <Clock size={18} />
            <h2>최근 열어본 게시글</h2>
          </div>
          <button className="view-all" onClick={() => navigateToFeed('latest')}>전체보기 <ChevronRight size={14}/></button>
        </div>
        <div className="recent-grid">
          {recentIdeas.length > 0 ? (
            recentIdeas.map(idea => (
              <div key={idea.id} className="file-icon-card" onClick={() => onIdeaClick(idea)}>
                <div className={`file-icon theme-${idea.theme || 'default'}`}>
                  <FileText size={32} />
                </div>
                <span className="file-name">{idea.title}</span>
              </div>
            ))
          ) : (
            <div className="empty-hint">최근에 본 게시글이 여기에 표시됩니다.</div>
          )}
          <div className="file-icon-card add-new" onClick={onNewIdea}>
            <div className="file-icon">
              <Plus size={32} />
            </div>
            <span className="file-name">새 게시글 작성</span>
          </div>
        </div>
      </section>

      <div className="home-grid-layout">
        {ideas.length === 0 ? (
          <div className="home-empty-welcome">
            <div className="welcome-icon">🚀</div>
            <h2>Zing!에 오신 것을 환영합니다</h2>
            <p>아직 등록된 영감이 없습니다. 당신의 첫 번째 아이디어를 기록하고 새로운 연결을 시작해보세요!</p>
            <button className="welcome-btn" onClick={onNewIdea}>첫 아이디어 작성하기</button>
          </div>
        ) : (
          <>
            <section className="home-section">
              <div className="section-header">
                <div className="section-title">
                  <Zap size={18} />
                  <h2>오늘의 새 게시글</h2>
                </div>
                <button className="view-all" onClick={() => navigateToFeed('latest')}>더보기</button>
              </div>
              <div className="compact-list">
                {newIdeas.map(idea => (
                  <div key={idea.id} className="compact-item" onClick={() => onIdeaClick(idea)}>
                    <span className="item-tag" style={{ color: idea.tag?.color }}>{idea.tag?.label}</span>
                    <span className="item-title">{idea.title}</span>
                    <span className="item-time">{idea.time}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="home-section">
              <div className="section-header">
                <div className="section-title">
                  <Star size={18} />
                  <h2>인기 게시글</h2>
                </div>
                <button className="view-all" onClick={() => navigateToFeed('popular')}>더보기</button>
              </div>
              <div className="compact-list">
                {popularIdeas.map(idea => (
                  <div key={idea.id} className="compact-item" onClick={() => onIdeaClick(idea)}>
                    <span className="item-likes">👍 {idea.likes}</span>
                    <span className="item-title">{idea.title}</span>
                    <span className="item-author">{idea.author?.handle}</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      </div>
    </div>
  );
};

export default DesktopHome;
