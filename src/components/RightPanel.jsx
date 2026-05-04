import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, MoreHorizontal, MessageSquarePlus, Lightbulb, Search, Edit3, Send } from 'lucide-react';
import './RightPanel.css';

const MOCK_RESPONSE = "좋은 질문이에요! 그 아이디어를 마크다운 위키처럼 연결하면, 비슷한 주제에 관심 있는 다른 사람들이 쉽게 리믹스할 수 있을 것 같아요. 제가 시각화 방법을 몇 가지 추천해 드릴까요?";

const RightPanel = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatScrollRef = useRef(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    // 유저 메시지 추가
    setMessages(prev => [...prev, { role: 'user', content: inputValue }]);
    setInputValue('');
    setIsTyping(true);

    // AI 응답 시뮬레이션
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'ai', content: MOCK_RESPONSE }]);
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <aside className="right-panel">
      <div className="panel-header">
        <div className="ai-branding">
          <div className="ai-icon">
            <Sparkles size={16} color="white" />
          </div>
          <h2>Zingger AI</h2>
        </div>
        <div className="header-actions">
          <button className="icon-btn"><Edit3 size={18} /></button>
          <button className="icon-btn"><MoreHorizontal size={18} /></button>
        </div>
      </div>

      <div className="ai-character-area">
        <div className="character-bubble">
          <div className="character-avatar">🫧</div>
          <div className="floating-sparkles">✨</div>
        </div>
        
        {messages.length === 0 ? (
          <div className="ai-greeting">
            <p>안녕하세요! 👋</p>
            <p>오늘은 어떤 아이디어를 함께 탐색할까요?</p>
          </div>
        ) : (
          <div className="chat-history" ref={chatScrollRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {isTyping && (
              <div className="chat-bubble ai typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}
          </div>
        )}
      </div>

      {messages.length === 0 && (
        <div className="ai-prompts">
          <button className="prompt-btn" onClick={() => setInputValue('아이디어에 대해 질문하기')}>
            <MessageSquarePlus size={16} className="text-primary" />
            <span>아이디어에 대해 질문하기</span>
          </button>
          <button className="prompt-btn" onClick={() => setInputValue('관련 아이디어 추천하기')}>
            <Lightbulb size={16} className="text-primary" />
            <span>관련 아이디어 추천하기</span>
          </button>
          <button className="prompt-btn" onClick={() => setInputValue('비슷한 주제 검색하기')}>
            <Search size={16} className="text-primary" />
            <span>비슷한 주제 검색하기</span>
          </button>
          <button className="prompt-btn" onClick={() => setInputValue('아이디어 정리 도와주기')}>
            <Edit3 size={16} className="text-primary" />
            <span>아이디어 정리 도와주기</span>
          </button>
        </div>
      )}

      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          <input 
            type="text" 
            placeholder="메시지를 입력하세요..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="mode-toggle">
            <Sparkles size={14} />
            아이디어 분석 모드 ∨
          </button>
          <button className="send-btn" onClick={handleSend} disabled={!inputValue.trim()}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default RightPanel;
