import React from 'react';
import IdeaCard from './IdeaCard';
import IdeaGraph from './IdeaGraph';
import ChallengeBanner from './ChallengeBanner';
import { ChevronDown, Grid, List, Share2, Award } from 'lucide-react';
import useStore from '../store/useStore';
import './MainFeed.css';

const MainFeed = ({ onIdeaClick, onRemixClick, onNewIdea, viewOverride }) => {
  const ideas = useStore(state => state.ideas);
  const filter = useStore(state => state.filter);
  const setFilter = useStore(state => state.setFilter);
  const viewMode = useStore(state => state.viewMode);
  const setViewMode = useStore(state => state.setViewMode);
  const searchQuery = useStore(state => state.searchQuery);
  const sortMode = useStore(state => state.sortMode);
  const setSortMode = useStore(state => state.setSortMode);
  const communityFilter = useStore(state => state.communityFilter);
  const currentView = viewOverride || viewMode;

  const filteredIdeas = ideas.filter(idea => {
    const matchesFilter = filter === '전체' || idea.tag?.label === filter;
    const matchesCommunity = communityFilter === '전체' || idea.community === communityFilter;
    const matchesSearch = (idea.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          idea.content?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesCommunity && matchesSearch;
  });

  const sortedIdeas = [...filteredIdeas].sort((a, b) => {
    if (sortMode === 'popular') return b.likes - a.likes;
    return b.id - a.id; // 최신순 (ID가 클수록 최신)
  });

  return (
    <div className={`main-feed ${currentView === 'graph' ? 'graph-mode' : ''} view-${currentView}`}>
      <div className="feed-header">
        <div className="feed-title-wrapper">
          <h1 className="feed-title">
            {currentView === 'challenge' ? '🏆 주간 챌린지' : filter}
          </h1>
          <ChevronDown size={20} className="text-secondary" />
        </div>
        
        <div className="feed-controls">
          <div className="view-toggles">
            <button 
              className={`view-btn ${currentView === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="그리드 뷰"
            ><Grid size={16} /></button>
            <button 
              className={`view-btn ${currentView === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="리스트 뷰"
            ><List size={16} /></button>
            <button 
              className={`view-btn ${currentView === 'gallery' ? 'active' : ''}`}
              onClick={() => setViewMode('gallery')}
              title="갤러리 뷰"
            ><Grid size={20} /></button>
            <button 
              className={`view-btn ${currentView === 'graph' ? 'active' : ''}`}
              onClick={() => setViewMode('graph')}
              title="그래프 뷰"
            ><Share2 size={16} /></button>
            <button 
              className={`view-btn ${currentView === 'challenge' ? 'active' : ''}`}
              onClick={() => setViewMode('challenge')}
              title="주간 챌린지"
            ><Award size={16} /></button>
          </div>
        </div>
      </div>

      <div className="feed-filters">
        <button 
          className={`filter-chip ${sortMode === 'latest' ? 'active' : ''}`}
          onClick={() => setSortMode('latest')}
        >최신순 <ChevronDown size={14}/></button>
        <button 
          className={`filter-chip ${sortMode === 'popular' ? 'active' : ''}`}
          onClick={() => setSortMode('popular')}
        >인기순</button>
        <button 
          className={`filter-chip ${filter === '전체' ? 'active' : ''}`}
          onClick={() => setFilter('전체')}
        >전체 <ChevronDown size={14}/></button>
      </div>

      {currentView === 'challenge' ? (
        <ChallengeBanner 
          onParticipate={onNewIdea}
          onIdeaClick={onIdeaClick}
          onRemixClick={onRemixClick}
        />
      ) : currentView === 'graph' ? (
        <IdeaGraph onNodeClick={onIdeaClick} />
      ) : sortedIdeas.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✨</div>
          <h3>해당 카테고리에 아이디어가 없네요!</h3>
          <p>첫 번째 아이디어의 주인공이 되어보세요.</p>
          <button className="btn-primary" onClick={onNewIdea}>새 아이디어 작성하기</button>
        </div>
      ) : (
        <div className="cards-container">
          {sortedIdeas.map(idea => (
            <IdeaCard 
              key={idea.id} 
              idea={idea} 
              onClick={() => onIdeaClick(idea)}
              onRemix={(e) => { e.stopPropagation(); onRemixClick(idea); }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MainFeed;
