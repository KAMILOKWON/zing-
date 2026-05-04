import React, { useState } from 'react';
import { X, Send, Image, Hash, Smile, Palette } from 'lucide-react';
import './IdeaEditor.css';

const THEMES = [
  { id: 'default', color: '#FFFFFF', name: '기본' },
  { id: 'blue', color: '#EFF6FF', name: '블루' },
  { id: 'purple', color: '#F5F3FF', name: '퍼플' },
  { id: 'orange', color: '#FFF7ED', name: '오렌지' },
  { id: 'gradient', color: 'linear-gradient(to bottom right, #F8FAFC, #EDF2FE)', name: '그라데이션' },
];

const IdeaEditor = ({ onClose, remixTarget }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);

  const handleSubmit = () => {
    // 임시 등록 처리
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="editor-modal" 
        onClick={e => e.stopPropagation()}
        style={{ background: activeTheme.color }}
      >
        <div className="editor-header">
          <h2>{remixTarget ? '아이디어 리믹스하기' : '새 아이디어 작성'}</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="editor-body">
          {remixTarget && (
            <div className="remix-quote">
              <span className="quote-author">@{remixTarget.author.handle}님의 아이디어에서 파생:</span>
              <p>{remixTarget.title}</p>
            </div>
          )}
          
          <input 
            type="text" 
            className="editor-title-input" 
            placeholder="아이디어의 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          
          <textarea 
            className="editor-content-input"
            placeholder="어떤 멋진 생각이 떠올랐나요? 마크다운을 지원합니다!"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="editor-footer">
          <div className="editor-tools">
            <button className="tool-btn"><Image size={18} /></button>
            <button className="tool-btn"><Hash size={18} /></button>
            <button className="tool-btn"><Smile size={18} /></button>
            
            <div className="theme-selector-group">
              <Palette size={18} className="tool-btn" />
              <div className="theme-palette">
                {THEMES.map(theme => (
                  <button 
                    key={theme.id}
                    className={`theme-chip ${activeTheme.id === theme.id ? 'active' : ''}`}
                    style={{ background: theme.color }}
                    title={theme.name}
                    onClick={() => setActiveTheme(theme)}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <button 
            className="submit-idea-btn" 
            onClick={handleSubmit}
            disabled={!title || !content}
          >
            <Send size={16} />
            <span>{remixTarget ? '리믹스 완료' : '게시하기'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaEditor;
