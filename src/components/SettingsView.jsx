import React, { useState } from 'react';
import { User, Bell, Palette, Shield, LogOut, ChevronRight, Check } from 'lucide-react';
import useStore from '../store/useStore';
import { supabase } from '../lib/supabase';
import './SettingsView.css';

const SettingsView = () => {
  const user = useStore(state => state.user);
  const setUser = useStore(state => state.setUser);
  const signOut = useStore(state => state.signOut);
  const isAdmin = useStore(state => state.isAdmin);

  const currentHandle = user?.user_metadata?.handle || '';
  const currentName = user?.user_metadata?.full_name || '';

  const [isEditing, setIsEditing] = useState(false);
  const [handle, setHandle] = useState(currentHandle);
  const [name, setName] = useState(currentName);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!handle.trim()) return;
    setSaving(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          handle: handle.trim(),
          full_name: name.trim(),
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${handle.trim()}`
        }
      });
      if (error) throw error;
      // 로컬 상태 업데이트
      setUser(data.user);
      setSaved(true);
      setIsEditing(false);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert('프로필 저장 중 오류가 발생했습니다: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

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
              <div className="user-avatar-large">
                {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="avatar" className="avatar-img" />
                ) : (
                  user?.email?.[0].toUpperCase()
                )}
              </div>
              <div className="user-details">
                <span className="user-handle">{currentHandle || '핸들 미설정'}</span>
                <span className="user-email">{user?.email}</span>
                <span className={`user-badge ${isAdmin ? 'admin' : 'user'}`}>
                  {isAdmin ? '시스템 관리자' : '일반 사용자'}
                </span>
              </div>
            </div>

            {isEditing ? (
              <div className="profile-edit-form">
                <div className="edit-field">
                  <label>핸들</label>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="@your_handle"
                  />
                </div>
                <div className="edit-field">
                  <label>이름</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="표시될 이름"
                  />
                </div>
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleSave} disabled={saving}>
                    {saving ? '저장 중...' : '저장'}
                  </button>
                  <button className="cancel-btn" onClick={() => { setIsEditing(false); setHandle(currentHandle); setName(currentName); }}>
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <button className="settings-item-btn" onClick={() => setIsEditing(true)}>
                {saved && <Check size={16} className="saved-icon" />}
                {saved ? '저장 완료!' : '프로필 수정'} <ChevronRight size={16} />
              </button>
            )}
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
