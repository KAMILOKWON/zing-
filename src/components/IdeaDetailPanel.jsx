import React, { useState } from 'react';
import { X, ThumbsUp, MessageSquare, Repeat2, Bookmark, Send, Handshake, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import useStore from '../store/useStore';
import './IdeaDetailPanel.css';

const IdeaDetailPanel = ({ idea, onClose, onRemixClick, onIdeaClick }) => {
  const [commentText, setCommentText] = useState('');
  const [zingToast, setZingToast] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const toggleLike = useStore(state => state.toggleLike);
  const addComment = useStore(state => state.addComment);
  const toggleHandshake = useStore(state => state.toggleHandshake);
  const handshakes = useStore(state => state.handshakes);
  const bookmarkedIds = useStore(state => state.bookmarkedIds);
  const toggleBookmark = useStore(state => state.toggleBookmark);
  
  const currentIdea = useStore((state) => 
    state.ideas.find((i) => i.id === idea.id) || idea
  );

  const isHandshaked = handshakes.includes(currentIdea.id);
  const isBookmarked = bookmarkedIds.includes(currentIdea.id);

  const handleZingTogether = () => {
    toggleHandshake(currentIdea.id);
    if (!isHandshaked) {
      setZingToast({ type: 'zing', message: `**${currentIdea.author.handle}**님에게 Zing Together! 🎉` });
      setTimeout(() => setZingToast(null), 3000);
    }
  };

  const handleBookmark = () => {
    toggleBookmark(currentIdea.id);
    if (!isBookmarked) {
      setZingToast({ type: 'bookmark', message: '게시글이 보관함에 저장되었습니다.' });
      setTimeout(() => setZingToast(null), 2000);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setZingToast({ type: 'share', message: '게시글 링크가 클립보드에 복사되었습니다.' });
    setTimeout(() => setZingToast(null), 2000);
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(currentIdea.id, commentText);
    setCommentText('');
  };

  const handleAiTool = (type) => {
    setIsAiLoading(true);
    setAiResponse(null);
    
    // 모의 AI 응답
    setTimeout(() => {
      let response = '';
      if (type === 'summary') {
        response = `📝 **요약:** ${currentIdea.title}에 관한 이 게시글은 아이디어의 시각적 연결과 계보 추적을 통해 창의성을 확장하는 시스템을 제안하고 있습니다.`;
      } else if (type === 'tag') {
        response = `🏷️ **추천 태그:** #생산성 #시각화 #지식관리`;
      } else if (type === 'remix') {
        response = `💡 **리믹스 제안:** 이 아이디어를 '실시간 협업 마인드맵'이나 'AI 기반 자동 태그 엔진'과 결합해 보는 건 어떨까요?`;
      }
      setAiResponse(response);
      setIsAiLoading(false);
    }, 1000);
  };

  return (
    <aside className="detail-panel">
      <div className="dp-header">
        <span className="dp-tag" style={{ color: currentIdea.tag.color, backgroundColor: `${currentIdea.tag.color}1A` }}>
          {currentIdea.tag.label}
        </span>
        <button className="dp-close" onClick={onClose}><X size={18} /></button>
      </div>

      <div className="dp-body">
        <h1 className="dp-title">{currentIdea.title}</h1>
        
        <div className="dp-author">
          <span className="dp-avatar">{currentIdea.author.avatar}</span>
          <div className="dp-author-info">
            <span className="dp-author-handle">{currentIdea.author.handle}</span>
          </div>
          <span className="dp-dot">·</span>
          <span className="dp-time">{currentIdea.time}</span>
        </div>

        {currentIdea.parentId && (
          <div className="dp-lineage parent" onClick={() => {
            const parent = useStore.getState().ideas.find(i => i.id === currentIdea.parentId);
            if (parent) onIdeaClick(parent);
          }}>
            <span className="lineage-label">🌱 이 게시글은 다음에서 진화함:</span>
            <p className="lineage-title">{useStore.getState().ideas.find(i => i.id === currentIdea.parentId)?.title || '이전 아이디어'}</p>
          </div>
        )}
        
        {currentIdea.image && (
          <img src={currentIdea.image} alt={currentIdea.title} className="dp-image" />
        )}
        
        <div className="dp-content">
          <ReactMarkdown>{currentIdea.content}</ReactMarkdown>
        </div>

        <div className="dp-zingger-ai">
          <div className="ai-header">
            <Sparkles size={16} />
            <span>Zingger AI 어시스턴트</span>
          </div>
          <div className="ai-tools">
            <button className="ai-tool-btn" onClick={() => handleAiTool('summary')}>📝 요약해줘</button>
            <button className="ai-tool-btn" onClick={() => handleAiTool('tag')}>🏷️ 태그 추천</button>
            <button className="ai-tool-btn" onClick={() => handleAiTool('remix')}>💡 리믹스 제안</button>
          </div>
          {isAiLoading && <div className="ai-loading">Zingger AI가 생각 중...</div>}
          {aiResponse && (
            <div className="ai-response-box">
              <ReactMarkdown>{aiResponse}</ReactMarkdown>
              <button className="ai-response-close" onClick={() => setAiResponse(null)}>×</button>
            </div>
          )}
        </div>

        <div className="dp-actions-bar">
          <div className="dp-action-group">
            <button 
              className={`dp-action-btn ${currentIdea.isLiked ? 'active' : ''}`}
              onClick={() => toggleLike(currentIdea.id)}
            >
              <ThumbsUp size={16} className={currentIdea.isLiked ? 'fill-current' : ''} />
              <span>{currentIdea.likes}</span>
            </button>
            <button className="dp-action-btn">
              <MessageSquare size={16} />
              <span>{currentIdea.comments.length}</span>
            </button>
            <button className="dp-action-btn" onClick={handleShare}>
              <Send size={16} />
            </button>
          </div>
          
          <div className="dp-action-group">
            <button 
              className={`dp-bookmark-btn ${isBookmarked ? 'active' : ''}`} 
              onClick={handleBookmark}
            >
              <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
            <button 
              className={`dp-zing-btn ${isHandshaked ? 'active' : ''}`} 
              onClick={handleZingTogether}
              title={isHandshaked ? "Zing Together 연결됨" : "Zing Together 요청"}
            >
              <Handshake size={16} />
            </button>
            <button className="dp-remix-btn" onClick={() => { onClose(); onRemixClick(); }}>
              <Repeat2 size={16} />
              <span>리믹스</span>
            </button>
          </div>
        </div>

        <div className="dp-comments-section">
          <h3>댓글 {currentIdea.comments.length}</h3>
          
          <form className="dp-comment-input-area" onSubmit={handleSubmitComment}>
            <span className="dp-avatar-small">👩‍💻</span>
            <div className="dp-comment-input-wrapper">
              <input 
                type="text" 
                placeholder="댓글을 남겨보세요..." 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button className="dp-send-btn" type="submit" disabled={!commentText.trim()}>
                <Send size={14} />
              </button>
            </div>
          </form>

          <div className="dp-comments-list">
            {currentIdea.comments.map((c) => (
              <div key={c.id} className="dp-comment-item">
                <span className="dp-avatar-small">👤</span>
                <div className="dp-comment-body">
                  <div className="dp-comment-meta">
                    <span className="dp-comment-author">{c.user}</span>
                    <span className="dp-comment-time">{c.time}</span>
                  </div>
                  <p>{c.text}</p>
                </div>
              </div>
            )).reverse()}
          </div>
        </div>
      </div>

      {zingToast && (
        <div className="zing-toast">
          {zingToast.type === 'zing' && <Handshake size={16} />}
          {zingToast.type === 'bookmark' && <Bookmark size={16} />}
          {zingToast.type === 'share' && <Send size={16} />}
          <ReactMarkdown>{zingToast.message}</ReactMarkdown>
        </div>
      )}
    </aside>
  );
};

export default IdeaDetailPanel;
