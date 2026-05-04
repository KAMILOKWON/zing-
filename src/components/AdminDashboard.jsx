import React from 'react';
import { Shield, Trash2, Eye, Users, FileText, AlertCircle } from 'lucide-react';
import useStore from '../store/useStore';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const ideas = useStore(state => state.ideas);
  const deleteIdea = useStore(state => state.deleteIdea);
  
  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-title">
          <Shield size={28} color="var(--primary)" />
          <h1>시스템 관리자 센터</h1>
        </div>
        <div className="admin-stats">
          <div className="a-stat">
            <span className="a-label">전체 게시글</span>
            <span className="a-value">{ideas.length}</span>
          </div>
          <div className="a-stat">
            <span className="a-label">전체 사용자</span>
            <span className="a-value">1,248</span>
          </div>
        </div>
      </header>

      <section className="admin-content">
        <div className="admin-section-card">
          <div className="card-header">
            <FileText size={20} />
            <h2>콘텐츠 관리</h2>
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>제목</th>
                  <th>작성자</th>
                  <th>날짜</th>
                  <th>상태</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {ideas.map(idea => (
                  <tr key={idea.id}>
                    <td className="td-title">{idea.title}</td>
                    <td className="td-author">{idea.author.name}</td>
                    <td className="td-date">{idea.time}</td>
                    <td><span className="status-badge active">활성</span></td>
                    <td className="td-actions">
                      <button className="a-icon-btn view" title="보기"><Eye size={16} /></button>
                      <button 
                        className="a-icon-btn delete" 
                        title="삭제"
                        onClick={() => {
                          if (window.confirm('이 게시글을 삭제하시겠습니까?')) {
                            deleteIdea(idea.id);
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-section-card warning">
          <div className="card-header">
            <AlertCircle size={20} />
            <h2>신고된 콘텐츠</h2>
          </div>
          <div className="empty-state">신고된 내역이 없습니다.</div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
