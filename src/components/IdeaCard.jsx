import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Repeat2, Bookmark, MoreHorizontal, Trash2, AlertCircle } from 'lucide-react';
import useStore from '../store/useStore';
import './IdeaCard.css';

const IdeaCard = ({ idea, onClick, onRemix }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { toggleLike, toggleBookmark, deleteIdea, reportIdea } = useStore();

  const handleMenuClick = (e, action) => {
    e.stopPropagation();
    if (action === 'delete') {
      if (window.confirm('정말 삭제하시겠습니까?')) deleteIdea(idea.id);
    } else if (action === 'report') {
      alert('신고가 접수되었습니다.');
      reportIdea(idea.id);
    }
    setShowMenu(false);
  };

  return (
    <div 
      className={`idea-card theme-${idea.theme || 'default'} ${idea.image ? 'has-image' : 'no-image'}`} 
      onClick={onClick} 
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="card-header">
        <span className="card-tag" style={{ color: idea.tag?.color, backgroundColor: `${idea.tag?.color}1A` }}>
          {idea.tag?.label}
        </span>
        <div className="card-more-wrapper">
          <button 
            className="more-btn-card"
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          >
            <MoreHorizontal size={18} />
          </button>
          
          {showMenu && (
            <div className="card-dropdown-menu">
              <button className="menu-item-btn" onClick={(e) => handleMenuClick(e, 'report')}>
                <AlertCircle size={14} />
                <span>신고하기</span>
              </button>
              {idea.author?.name === '나' && (
                <button className="menu-item-btn delete" onClick={(e) => handleMenuClick(e, 'delete')}>
                  <Trash2 size={14} />
                  <span>삭제하기</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="card-body">
        <div className="card-content-left">
          <h3 className="card-title">{idea.title}</h3>
          <p className="card-desc">{idea.content}</p>
          
          <div className="card-author">
            <span className="author-avatar">{idea.author?.avatar}</span>
            <span className="author-name">{idea.author?.handle || idea.author?.name}</span>
            <span className="dot-sep">·</span>
            <span className="post-time">{idea.time}</span>
          </div>
        </div>
        
        {idea.image && (
          <div className="card-image-wrapper">
            <img src={idea.image} alt={idea.title} className="card-image" />
          </div>
        )}
      </div>

      <div className="card-footer">
        <div className="footer-actions-left">
          <button 
            className={`action-btn ${idea.isLiked ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); toggleLike(idea.id); }}
          >
            <ThumbsUp size={16} className={idea.isLiked ? 'fill-current' : ''} />
            <span>{idea.likes}</span>
          </button>
          <button className="action-btn">
            <MessageSquare size={16} />
            <span>{Array.isArray(idea.comments) ? idea.comments.length : (idea.comments || 0)}</span>
          </button>
          {idea.hasRemix && (
            <button className="action-btn action-remix" onClick={onRemix}>
              <Repeat2 size={16} />
              <span>리믹스 {idea.remixes}</span>
            </button>
          )}
        </div>
        <button 
          className={`bookmark-btn ${idea.isBookmarked ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggleBookmark(idea.id); }}
        >
          <Bookmark size={18} className={idea.isBookmarked ? 'fill-current' : ''} />
        </button>
      </div>
    </div>
  );
};

export default IdeaCard;
