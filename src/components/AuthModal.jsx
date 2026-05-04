import React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles } from 'lucide-react';
import useStore from '../store/useStore';
import './AuthModal.css';

const AuthModal = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { signIn, signUp } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, { name, handle });
        alert('🎉 Zing!에 오신 것을 환영합니다!\n\n입력하신 이메일함에서 인증 링크를 클릭해 주세요. 인증 완료 후 바로 로그인이 가능합니다.');
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <button className="auth-close" onClick={onClose}><X size={20} /></button>
        
        <div className="auth-header">
          <div className="auth-logo">
            <Sparkles size={36} color="var(--primary)" className="logo-sparkle" />
            <span className="logo-text">Zing!</span>
          </div>
          <h2>{isLogin ? '다시 오신 것을 환영해요!' : '반짝이는 영감을 기록해보세요'}</h2>
          <p>{isLogin ? '로그인하여 아이디어를 이어가세요' : '새로운 계정을 만들고 시작하세요'}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="input-group">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  placeholder="이름 (예: 홍길동)" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="input-group">
                <Sparkles size={18} className="input-icon" />
                <input 
                  type="text" 
                  placeholder="핸들 (예: gildong_idea)" 
                  required 
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                />
              </div>
            </>
          )}
          <div className="input-group">
            <Mail size={18} className="input-icon" />
            <input 
              type="email" 
              placeholder="이메일" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input 
              type="password" 
              placeholder="비밀번호" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {!isLogin && (
            <p className="auth-notice">
              ✨ 가입 버튼을 누르면 입력하신 주소로 <strong>인증 메일</strong>이 발송됩니다. 
              메일 확인 후 서비스 이용이 가능합니다.
            </p>
          )}

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-submit" disabled={loading}>
            {loading ? '처리 중...' : (isLogin ? '로그인' : '회원가입')}
          </button>
        </form>

        <div className="auth-footer">
          <span>{isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}</span>
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? '회원가입' : '로그인'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
