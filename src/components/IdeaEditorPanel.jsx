import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Image, Hash, Smile, Palette, ChevronDown, Eye, Edit3 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import useStore from '../store/useStore';
import SlashMenu from './SlashMenu';
import './IdeaEditorPanel.css';

const THEMES = [
  { id: 'default', color: '#FFFFFF', border: '#E5E8EB', name: '기본' },
  { id: 'blue', color: '#EFF6FF', border: '#BFDBFE', name: '블루' },
  { id: 'purple', color: '#F5F3FF', border: '#DDD6FE', name: '퍼플' },
  { id: 'orange', color: '#FFF7ED', border: '#FED7AA', name: '오렌지' },
  { id: 'green', color: '#ECFDF5', border: '#A7F3D0', name: '그린' },
  { id: 'gradient', color: 'linear-gradient(to bottom right, #F8FAFC, #EDF2FE)', border: '#BFDBFE', name: '그라데이션' },
];

const TAGS = [
  { label: '제품 디자인', color: '#8B5CF6' },
  { label: 'AI & 기술', color: '#3A75F6' },
  { label: '라이프스타일', color: '#10B981' },
  { label: '환경 & 지속가능성', color: '#14B8A6' },
  { label: '교육 & 성장', color: '#F59E0B' },
  { label: '기타', color: '#64748B' },
];

const TAG_SUGGESTIONS = [
  '제품 아이디어', '일상 생각', '창작 실험', '미래 사회', '문제 발견', 'AI & 기술', '라이프스타일', '환경 & 지속가능성', '교육 & 성장'
];

const IdeaEditorPanel = ({ onClose, remixTarget }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);
  const [showThemes, setShowThemes] = useState(false);
  const [tagInput, setTagInput] = useState(remixTarget ? (remixTarget.tag?.label || remixTarget.tag || '') : '');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [slashMenu, setSlashMenu] = useState({ open: false, top: 0, left: 0 });
  const contentRef = useRef(null);
  const { createIdea } = useStore();

  const handleContentChange = (e) => {
    const val = e.target.value;
    setContent(val);

    const selectionPos = e.target.selectionStart;
    const lastChar = val[selectionPos - 1];

    if (lastChar === '/') {
      const rect = e.target.getBoundingClientRect();
      // 대략적인 위치 계산 (정교한 계산은 복잡하므로 텍스트영역 하단 부근에 띄움)
      setSlashMenu({
        open: true,
        top: rect.top + 100, 
        left: rect.left + 20
      });
    } else {
      setSlashMenu({ ...slashMenu, open: false });
    }
  };

  const handleSlashSelect = (syntax) => {
    const textarea = contentRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    // '/' 문자 제거하고 syntax 삽입
    const newContent = content.substring(0, start - 1) + syntax + content.substring(end);
    setContent(newContent);
    setSlashMenu({ ...slashMenu, open: false });
    
    // 커서 위치 조정 (약간의 지연 필요)
    setTimeout(() => {
      textarea.focus();
      const newPos = start - 1 + syntax.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  // 자동 저장 로직 (localStorage)
  useEffect(() => {
    const saved = localStorage.getItem('zing-draft');
    if (saved) {
      const { title: sTitle, content: sContent } = JSON.parse(saved);
      if (!title && !content) {
        setTitle(sTitle);
        setContent(sContent);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('zing-draft', JSON.stringify({ title, content }));
  }, [title, content]);

  const handleSubmit = () => {
    if (!title || !content) return;
    
    createIdea({
      title,
      content,
      theme: activeTheme.id,
      tag: { label: tagInput || '기타', color: '#64748B' }, // 기본 컬러
      image: remixTarget ? remixTarget.image : null,
      hasRemix: !!remixTarget,
      parentId: remixTarget ? remixTarget.id : null
    });
    
    localStorage.removeItem('zing-draft');
    onClose();
  };

  return (
    <aside 
      className="editor-panel"
      style={{ background: activeTheme.color, borderColor: activeTheme.border }}
    >
      <div className="ep-header">
        <div className="ep-header-actions">
          <button className={`ep-toggle-btn ${!isPreview ? 'active' : ''}`} onClick={() => setIsPreview(false)}>
            <Edit3 size={14} /> <span>작성</span>
          </button>
          <button className={`ep-toggle-btn ${isPreview ? 'active' : ''}`} onClick={() => setIsPreview(true)}>
            <Eye size={14} /> <span>미리보기</span>
          </button>
        </div>
        <button className="ep-close" onClick={onClose}><X size={18} /></button>
      </div>

      <div className="ep-body">
        {remixTarget && (
          <div className="ep-remix-quote">
            <span className="ep-quote-label">@{remixTarget.author?.handle ?? 'user'}의 게시글에서 파생</span>
            <p>{remixTarget.title}</p>
          </div>
        )}

        <div className="ep-tag-input-container">
          <Hash size={14} className="tag-icon" />
          <input 
            type="text" 
            className="ep-tag-input" 
            placeholder="태그 입력 (예: 제품 아이디어)"
            value={tagInput}
            onChange={(e) => {
              setTagInput(e.target.value);
              setShowTagSuggestions(true);
            }}
            onFocus={() => setShowTagSuggestions(true)}
          />
          {showTagSuggestions && tagInput && (
            <div className="tag-suggestions">
              {TAG_SUGGESTIONS.filter(s => s.includes(tagInput)).map(s => (
                <div key={s} className="tag-suggestion-item" onClick={() => {
                  setTagInput(s);
                  setShowTagSuggestions(false);
                }}>
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        <input 
          type="text" 
          className="ep-title-input" 
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus={!isPreview}
          disabled={isPreview}
        />
        
        {isPreview ? (
          <div className="ep-markdown-preview">
            <ReactMarkdown>{content || '*내용이 없습니다.*'}</ReactMarkdown>
          </div>
        ) : (
          <textarea 
            ref={contentRef}
            className="ep-content-input"
            placeholder="어떤 멋진 생각이 떠올랐나요?&#10;마크다운 문법(#, -, **)을 지원합니다."
            value={content}
            onChange={handleContentChange}
          />
        )}
        
        {slashMenu.open && (
          <SlashMenu 
            position={{ top: slashMenu.top, left: slashMenu.left }}
            onSelect={handleSlashSelect}
            onClose={() => setSlashMenu({ ...slashMenu, open: false })}
          />
        )}
      </div>

      {/* 테마 팔레트 */}
      <div className="ep-theme-section">
        <button 
          className="ep-theme-toggle"
          onClick={() => setShowThemes(!showThemes)}
        >
          <Palette size={16} />
          <span>카드 테마</span>
          <ChevronDown size={14} className={showThemes ? 'rotated' : ''} />
        </button>

        {showThemes && (
          <div className="ep-theme-grid">
            {THEMES.map(theme => (
              <button 
                key={theme.id}
                className={`ep-theme-chip ${activeTheme.id === theme.id ? 'active' : ''}`}
                style={{ background: theme.color, borderColor: theme.border }}
                onClick={() => setActiveTheme(theme)}
              >
                <span className="ep-theme-name">{theme.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 하단 툴바 */}
      <div className="ep-footer">
        <div className="ep-tools">
          <button className="ep-tool"><Image size={16} /></button>
          <button className="ep-tool"><Smile size={16} /></button>
        </div>
        
        <button 
          className="ep-submit"
          onClick={handleSubmit}
          disabled={!title || !content}
        >
          <Send size={14} />
          <span>{remixTarget ? '리믹스 완료' : '게시하기'}</span>
        </button>
      </div>
    </aside>
  );
};

export default IdeaEditorPanel;
