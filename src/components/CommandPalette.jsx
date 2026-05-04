import React, { useState, useEffect, useRef } from 'react';
import { Search, Terminal, Plus, Bell, User, Settings, Hash, Send } from 'lucide-react';
import useStore from '../store/useStore';
import './CommandPalette.css';

const COMMANDS = [
  { id: 'new-idea', icon: <Plus size={18} />, label: '새 아이디어 작성', shortcut: 'N', action: 'editor' },
  { id: 'view-notifications', icon: <Bell size={18} />, label: '알림 확인', action: 'notifications' },
  { id: 'view-profile', icon: <User size={18} />, label: '내 프로필', action: 'profile' },
  { id: 'settings', icon: <Settings size={18} />, label: '시스템 설정', action: 'settings' },
  { id: 'status', icon: <Terminal size={18} />, label: '시스템 상태 확인 (Kernel Status)', action: 'status' },
];

const CommandPalette = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  
  const setActiveTab = useStore(state => state.setActiveTab);
  const setCommandPaletteOpen = useStore(state => state.setCommandPaletteOpen);

  const filteredCommands = COMMANDS.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      executeCommand(filteredCommands[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const executeCommand = (cmd) => {
    if (!cmd) return;
    
    if (cmd.action === 'editor') {
      // App.jsx의 openEditor와 연동 필요 (상태로 관리하면 좋음)
      // 여기서는 탭 이동 시뮬레이션
      setActiveTab('feed');
    } else if (cmd.action === 'notifications') {
      setActiveTab('notifications');
    } else if (cmd.action === 'profile') {
      setActiveTab('profile');
    }
    
    setCommandPaletteOpen(false);
  };

  return (
    <div className="command-palette-overlay" onClick={onClose}>
      <div className="command-palette-window" onClick={e => e.stopPropagation()}>
        <div className="command-input-wrapper">
          <Search size={20} className="search-icon" />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="커뮤니티 명령어를 입력하세요... (예: '새 아이디어')"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="cmd-badge">CMD + K</div>
        </div>

        <div className="command-list">
          <div className="list-label">주요 시스템 명령어</div>
          {filteredCommands.map((cmd, idx) => (
            <div 
              key={cmd.id} 
              className={`command-item ${idx === selectedIndex ? 'selected' : ''}`}
              onClick={() => executeCommand(cmd)}
              onMouseEnter={() => setSelectedIndex(idx)}
            >
              <div className="cmd-icon">{cmd.icon}</div>
              <span className="cmd-label">{cmd.label}</span>
              {cmd.shortcut && <span className="cmd-shortcut">{cmd.shortcut}</span>}
            </div>
          ))}
          {filteredCommands.length === 0 && (
            <div className="no-results">명령어를 찾을 수 없습니다.</div>
          )}
        </div>

        <div className="command-footer">
          <div className="footer-tip">
            <span>⏎</span> 실행
            <span>↑↓</span> 이동
            <span>ESC</span> 닫기
          </div>
          <div className="system-version">Zing v0.9.8</div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
