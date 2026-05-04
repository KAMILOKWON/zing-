import React from 'react';
import { Heart, MessageSquare, Repeat2, UserPlus, Zap, Bell } from 'lucide-react';
import './NotificationView.css';

const NOTIFICATIONS = [];

const NotificationView = () => {
  return (
    <div className="notification-view">
      <div className="nv-header">
        <h1>알림 Center</h1>
        {NOTIFICATIONS.length > 0 && <button className="nv-mark-all">모두 읽음으로 표시</button>}
      </div>

      <div className="nv-list">
        {NOTIFICATIONS.length > 0 ? (
          NOTIFICATIONS.map(noti => (
            <div key={noti.id} className={`nv-item ${noti.unread ? 'unread' : ''}`}>
              <div className="nv-icon-wrapper">
                {noti.icon}
              </div>
              <div className="nv-content">
                <p className="nv-text">
                  <strong>{noti.user}</strong>님이 {noti.content}
                </p>
                <span className="nv-time">{noti.time}</span>
              </div>
              {noti.unread && <div className="nv-unread-dot"></div>}
            </div>
          ))
        ) : (
          <div className="nv-empty-state">
            <Bell size={48} strokeWidth={1} />
            <p>아직 새로운 알림이 없습니다.</p>
          </div>
        )}
      </div>
      
      <div className="nv-empty-footer">
        <Zap size={14} />
        <span>더 이상 새로운 알림이 없습니다.</span>
      </div>
    </div>
  );
};

export default NotificationView;
