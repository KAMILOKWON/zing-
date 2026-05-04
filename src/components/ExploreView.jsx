import React, { useState, useRef } from 'react';
import { Heart, X, MessageSquare, Repeat2, Bookmark, ChevronUp, ChevronDown, Check, XCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import useStore from '../store/useStore';
import './ExploreView.css';

const ExploreView = ({ onIdeaClick }) => {
  const ideas = useStore(state => state.ideas);
  const addInterest = useStore(state => state.addInterest);
  const addToRecent = useStore(state => state.addToRecent);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'like' | 'dislike' | null
  const containerRef = useRef(null);

  if (ideas.length === 0) {
    return (
      <div className="explore-container empty">
        <div className="explore-empty-state">
          <Sparkles size={48} />
          <h2>탐색할 영감이 아직 없습니다</h2>
          <p>첫 번째 아이디어를 작성하여 탐색 탭을 채워보세요!</p>
        </div>
      </div>
    );
  }

  const currentIdea = ideas[currentIndex % ideas.length];

  const handleNext = () => {
    setFeedback(null);
    setCurrentIndex((prev) => (prev + 1) % ideas.length);
  };

  const handleFeedback = (type) => {
    setFeedback(type);
    if (currentIdea.tag?.label) {
      addInterest(currentIdea.tag.label, type === 'like');
    }
    // 1초 뒤에 다음으로 넘김 (애니메이션 효과)
    setTimeout(() => {
      handleNext();
    }, 800);
  };

  const handleCardClick = () => {
    addToRecent(currentIdea.id);
    onIdeaClick(currentIdea);
  };

  return (
    <div className="explore-container" ref={containerRef}>
      <div className={`explore-card-wrapper ${feedback ? `swipe-${feedback}` : ''}`} onClick={handleCardClick}>
        <div className={`explore-card theme-${currentIdea.theme || 'default'}`}>
          <div className="explore-header">
            <span className="explore-tag">{currentIdea.tag?.label}</span>
            <div className="explore-author">
              <span className="author-avatar">{currentIdea.author?.avatar}</span>
              <span className="author-name">{currentIdea.author?.handle}</span>
            </div>
          </div>

          <div className="explore-body">
            <h1 className="explore-title">{currentIdea.title}</h1>
            <div className="explore-desc">
              <ReactMarkdown>{currentIdea.content}</ReactMarkdown>
            </div>
            {currentIdea.image && (
              <div className="explore-image-box">
                <img src={currentIdea.image} alt="" />
              </div>
            )}
          </div>

          <div className="explore-feedback-overlay">
            {feedback === 'like' && <div className="feedback-icon like"><Check size={64} /></div>}
            {feedback === 'dislike' && <div className="feedback-icon dislike"><XCircle size={64} /></div>}
          </div>

          <div className="explore-side-actions">
            <button className="side-btn"><Heart size={24} /><span>{currentIdea.likes}</span></button>
            <button className="side-btn"><MessageSquare size={24} /><span>{currentIdea.comments.length}</span></button>
            <button className="side-btn"><Repeat2 size={24} /><span>{currentIdea.remixes}</span></button>
            <button className="side-btn"><Bookmark size={24} /></button>
          </div>
        </div>
      </div>

      <div className="explore-controls">
        <button className="control-btn dislike" onClick={() => handleFeedback('dislike')}>
          <X size={32} />
          <span>관심없음</span>
        </button>
        <button className="control-btn like" onClick={() => handleFeedback('like')}>
          <Heart size={32} fill="currentColor" />
          <span>관심있음</span>
        </button>
      </div>

      <div className="explore-navigation">
        <button className="nav-arrow" onClick={() => setCurrentIndex(prev => prev > 0 ? prev - 1 : ideas.length - 1)}>
          <ChevronUp size={24} />
        </button>
        <span className="nav-index">{currentIndex + 1} / {ideas.length}</span>
        <button className="nav-arrow" onClick={handleNext}>
          <ChevronDown size={24} />
        </button>
      </div>
    </div>
  );
};

export default ExploreView;
