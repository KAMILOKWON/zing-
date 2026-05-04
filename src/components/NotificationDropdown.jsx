import React from 'react';
import { Repeat2, ThumbsUp, MessageSquare, Handshake, Trophy, X, Bell } from 'lucide-react';
import './NotificationDropdown.css';

const MOCK_NOTIFICATIONS = [];

const typeIcons = {
  zing_together: <Handshake size={16} />,
  remix: <Repeat2 size={16} />,
  like: <ThumbsUp size={16} />,
  comment: <MessageSquare size={16} />,
  challenge: <Trophy size={16} />,
};

const typeColors = {
  zing_together: '#F97316',
  remix: '#0EA5E9',
  like: '#3A75F6',
  comment: '#10B981',
  challenge: '#8B5CF6',
};

const NotificationDropdown = ({ onClose }) => {
  return (
    <>
      <div className="noti-backdrop" onClick={onClose} />
      <div className="noti-dropdown">
        <div className="noti-header">
          <h3>알림</h3>
          <button className="noti-mark-read">모두 읽음</button>
        </div>

        <div className="noti-list">
          {MOCK_NOTIFICATIONS.length > 0 ? (
            MOCK_NOTIFICATIONS.map(n => (
              <div key={n.id} className={`noti-item ${n.isNew ? 'new' : ''}`}>
                <div 
                  className="noti-icon-wrapper"
                  style={{ backgroundColor: `${typeColors[n.type]}1A`, color: typeColors[n.type] }}
                >
                  {typeIcons[n.type]}
                </div>
                <div className="noti-content">
                  <p>
                    <strong>{n.user.handle || n.user.name}</strong>
                    {n.message}
                  </p>
                  <span className="noti-time">{n.time}</span>
                </div>
                {n.isNew && <span className="noti-new-dot" />}
                
                {n.type === 'zing_together' && (
                  <div className="noti-actions">
                    <button className="noti-accept">수락</button>
                    <button className="noti-decline">거절</button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="noti-empty-state">
              <Bell size={32} strokeWidth={1.5} />
              <p>새로운 알림이 없습니다.</p>
            </div>
          )}
        </div>

        <div className="noti-footer">
          <button>모든 알림 보기</button>
        </div>
      </div>
    </>
  );
};

export default NotificationDropdown;
