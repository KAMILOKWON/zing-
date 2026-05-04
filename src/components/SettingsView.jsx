import React from 'react';
import { User, Bell, Palette, Shield, LogOut, ChevronRight } from 'lucide-react';
import useStore from '../store/useStore';
import './SettingsView.css';

const SettingsView = () => {
  const user = useStore(state => state.user);
  const signOut = useStore(state => state.signOut);
  const isAdmin = useStore(state => state.isAdmin);

  return (
    <div className="settings-container">
      <header className="settings-header">
        <h1>설정</h1>
        <p>계정 및 시스템 환경설정을 관리합니다.</p>
      </header>

      <div className="settings-sections">
        <section className="settings-section">
          <h2><User size={18} /> 계정 설정</h2>
          <div className="settings-card user-profile-card">
            <div className="user-info-large">
              <div className="user-avatar-large">{user?.email?.[0].toUpperCase()}</div>
              <div className="user-details">
                <span className="user-email">{user?.email}</span>
                <span className={`user-badge ${isAdmin ? 'admin' : 'user'}`}>
                  {isAdmin ? '시스템 관리자' : '일반 사용자'}
                </span>
              </div>
            </div>
            <button className="settings-item-btn">프로필 수정 <ChevronRight size={16} /></button>
            <button className="settings-item-btn logout" onClick={signOut}><LogOut size={16} /> 로그아웃</button>
          </div>
        </section>

        <section className="settings-section">
          <h2><Palette size={18} /> 시스템 및 테마</h2>
          <div className="settings-card">
            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">다크 모드</span>
                <span className="setting-desc">시스템 테마를 어둡게 설정합니다.</span>
              </div>
              <div className="toggle-switch"></div>
            </div>
            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">젠 모드 자동 활성화</span>
                <span className="setting-desc">작성 시작 시 주변 요소를 숨깁니다.</span>
              </div>
              <div className="toggle-switch active"></div>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h2><Bell size={18} /> 알림 설정</h2>
          <div className="settings-card">
            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">푸시 알림</span>
                <span className="setting-desc">새로운 리믹스 및 댓글 알림을 받습니다.</span>
              </div>
              <div className="toggle-switch active"></div>
            </div>
          </div>
        </section>

        {isAdmin && (
          <section className="settings-section">
            <h2><Shield size={18} /> 보안 및 관리</h2>
            <div className="settings-card">
              <button className="settings-item-btn">보안 감사 로그 확인 <ChevronRight size={16} /></button>
              <button className="settings-item-btn">시스템 유지보수 모드 <ChevronRight size={16} /></button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default SettingsView;
