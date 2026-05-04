import React, { useState, useEffect } from 'react';
import { Cpu, Activity, Wifi, Battery, Clock, Terminal } from 'lucide-react';
import useStore from '../store/useStore';
import './StatusBar.css';

const StatusBar = () => {
  const ideas = useStore(state => state.ideas);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <footer className="status-bar">
      <div className="status-left">
        <div className="status-item system-badge">
          <Terminal size={14} />
          <span>Zing! Kernel 0.9.5-stable</span>
        </div>
        <div className="status-item">
          <Activity size={14} />
          <span>Nodes: {ideas.length}</span>
        </div>
      </div>

      <div className="status-center">
        <div className="status-message">시스템이 정상 작동 중입니다. 새로운 아이디어를 입력받을 준비가 되었습니다.</div>
      </div>

      <div className="status-right">
        <div className="status-item">
          <Cpu size={14} />
          <span>Load: 12%</span>
        </div>
        <div className="status-item">
          <Wifi size={14} />
        </div>
        <div className="status-item">
          <Battery size={14} />
        </div>
        <div className="status-clock">
          <Clock size={14} />
          <span>{formatTime(time)}</span>
        </div>
      </div>
    </footer>
  );
};

export default StatusBar;
