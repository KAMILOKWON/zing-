import React, { useState, useEffect, useRef } from 'react';
import { Heading1, Heading2, List, Quote, Image, Code, CheckSquare } from 'lucide-react';
import './SlashMenu.css';

const MENU_ITEMS = [
  { id: 'h1', label: '제목 1', icon: <Heading1 size={16} />, syntax: '# ' },
  { id: 'h2', label: '제목 2', icon: <Heading2 size={16} />, syntax: '## ' },
  { id: 'bullet', label: '글머리 기호', icon: <List size={16} />, syntax: '- ' },
  { id: 'todo', label: '할 일 목록', icon: <CheckSquare size={16} />, syntax: '- [ ] ' },
  { id: 'quote', label: '인용구', icon: <Quote size={16} />, syntax: '> ' },
  { id: 'code', label: '코드 블록', icon: <Code size={16} />, syntax: '```\n\n```' },
  { id: 'image', label: '이미지', icon: <Image size={16} />, syntax: '![설명](이미지주소)' },
];

const SlashMenu = ({ position, onSelect, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % MENU_ITEMS.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + MENU_ITEMS.length) % MENU_ITEMS.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onSelect(MENU_ITEMS[selectedIndex].syntax);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, onSelect, onClose]);

  return (
    <div 
      className="slash-menu" 
      ref={menuRef}
      style={{ top: position.top, left: position.left }}
    >
      <div className="slash-menu-header">기본 블록</div>
      {MENU_ITEMS.map((item, index) => (
        <button
          key={item.id}
          className={`slash-menu-item ${index === selectedIndex ? 'active' : ''}`}
          onClick={() => onSelect(item.syntax)}
          onMouseEnter={() => setSelectedIndex(index)}
        >
          <span className="item-icon">{item.icon}</span>
          <span className="item-label">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default SlashMenu;
