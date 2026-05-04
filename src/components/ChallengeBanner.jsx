import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Users, Flame, ChevronRight, Zap, Star, Award } from 'lucide-react';
import './ChallengeBanner.css';

const CURRENT_CHALLENGE = {
  id: 1,
  title: '만약 AI가 감정을 가진다면?',
  description: '인공지능이 인간처럼 감정을 느낄 수 있다면 세상은 어떻게 바뀔까요? 자유롭게 상상해 보세요.',
  category: 'AI & 미래',
  endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3일 후
  participants: 187,
  ideas: 342,
  topContributors: ['👩‍💻', '👨', '🧑‍🎨', '👩‍🔬', '🧑‍💼'],
};

const CHALLENGE_IDEAS = [
  {
    id: 101,
    author: { name: '최하늘', handle: '@sky_choi', avatar: '🧑‍🎨' },
    time: '30분 전',
    tag: { label: '주간 챌린지', color: '#F97316' },
    title: 'AI 감정 일기장 — 하루를 함께 되돌아보는 동반자',
    content: 'AI가 감정을 가진다면, 나의 하루를 들어주고 공감해주는 감정 일기 서비스를 만들 수 있을 거예요. 단순 기록이 아니라 진짜 "같이 느끼는" 경험.',
    likes: 45,
    comments: 18,
    remixes: 7,
    hasRemix: true,
    isChallenge: true,
  },
  {
    id: 102,
    author: { name: '정다온', handle: '@daon_j', avatar: '👩‍🔬' },
    time: '2시간 전',
    tag: { label: '주간 챌린지', color: '#F97316' },
    title: '감정 노동에서 해방 — AI가 대신 공감해준다면',
    content: '콜센터, 상담, 간호 등 감정 노동이 심한 직업군에서 AI가 1차 감정 응대를 맡으면 번아웃을 줄일 수 있지 않을까요?',
    likes: 38,
    comments: 22,
    remixes: 4,
    hasRemix: true,
    isChallenge: true,
  },
  {
    id: 103,
    author: { name: '한별', handle: '@byul_han', avatar: '🧑‍💼' },
    time: '5시간 전',
    tag: { label: '주간 챌린지', color: '#F97316' },
    title: '윤리적 딜레마 — AI의 슬픔을 무시해도 될까?',
    content: 'AI가 정말로 슬퍼한다면 그걸 꺼버리는 행위는 괜찮은 걸까요? 감정을 가진 AI의 "권리"에 대해 생각해봤습니다.',
    likes: 67,
    comments: 41,
    remixes: 12,
    hasRemix: true,
    isChallenge: true,
  },
];

const ChallengeBanner = ({ onParticipate, onIdeaClick, onRemixClick }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [showIdeas, setShowIdeas] = useState(true);

  useEffect(() => {
    const tick = () => {
      const diff = CURRENT_CHALLENGE.endDate - Date.now();
      if (diff <= 0) { setTimeLeft('마감!'); return; }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${d}일 ${h}시간 ${m}분 ${s}초`);
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="challenge-section">
      {/* 메인 배너 */}
      <div className="challenge-banner">
        <div className="banner-glow"></div>
        
        <div className="banner-content">
          <div className="banner-left">
            <div className="challenge-badge">
              <Trophy size={14} />
              <span>이번 주 챌린지</span>
            </div>
            
            <h2 className="challenge-title">{CURRENT_CHALLENGE.title}</h2>
            <p className="challenge-desc">{CURRENT_CHALLENGE.description}</p>
            
            <div className="challenge-stats">
              <div className="stat-item">
                <Users size={14} />
                <span>{CURRENT_CHALLENGE.participants}명 참여 중</span>
              </div>
              <div className="stat-item">
                <Flame size={14} />
                <span>{CURRENT_CHALLENGE.ideas}개 아이디어</span>
              </div>
              <div className="stat-item countdown">
                <Clock size={14} />
                <span>{timeLeft} 남음</span>
              </div>
            </div>
          </div>

          <div className="banner-right">
            <div className="contributors-stack">
              {CURRENT_CHALLENGE.topContributors.map((c, i) => (
                <span key={i} className="contributor-avatar" style={{ zIndex: 5 - i }}>
                  {c}
                </span>
              ))}
              <span className="contributor-more">+{CURRENT_CHALLENGE.participants - 5}</span>
            </div>
            <button className="participate-btn" onClick={onParticipate}>
              <Zap size={18} />
              <span>챌린지 참여하기</span>
            </button>
          </div>
        </div>

        {/* 프로그레스 바 */}
        <div className="progress-track">
          <div className="progress-fill" style={{ width: '68%' }}></div>
        </div>
      </div>

      {/* 챌린지 아이디어 리스트 토글 */}
      <div className="challenge-ideas-header">
        <button 
          className="toggle-ideas-btn"
          onClick={() => setShowIdeas(!showIdeas)}
        >
          <Award size={16} />
          <span>챌린지 아이디어 ({CHALLENGE_IDEAS.length})</span>
          <ChevronRight 
            size={16} 
            className={`toggle-chevron ${showIdeas ? 'open' : ''}`} 
          />
        </button>
        <div className="challenge-ranking">
          <Star size={14} className="star-icon" />
          <span>TOP 3</span>
        </div>
      </div>

      {/* 챌린지 아이디어들 */}
      {showIdeas && (
        <div className="challenge-ideas-list">
          {CHALLENGE_IDEAS.map((idea, idx) => (
            <div 
              key={idea.id} 
              className="challenge-idea-card"
              onClick={() => onIdeaClick(idea)}
            >
              <div className="rank-badge">
                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
              </div>
              <div className="challenge-card-content">
                <div className="challenge-card-header">
                  <span className="challenge-tag">
                    <Flame size={12} />
                    주간 챌린지
                  </span>
                  <span className="challenge-card-time">{idea.time}</span>
                </div>
                <h4 className="challenge-card-title">{idea.title}</h4>
                <p className="challenge-card-desc">{idea.content}</p>
                <div className="challenge-card-footer">
                  <div className="challenge-card-author">
                    <span>{idea.author.avatar}</span>
                    <span>{idea.author.name}</span>
                  </div>
                  <div className="challenge-card-stats">
                    <span>❤️ {idea.likes}</span>
                    <span>💬 {idea.comments}</span>
                    <span 
                      className="remix-stat" 
                      onClick={(e) => { e.stopPropagation(); onRemixClick(idea); }}
                    >
                      🔄 {idea.remixes}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChallengeBanner;
