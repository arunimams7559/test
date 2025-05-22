
import React from 'react';
import { useUser } from '../context/usercontext';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return <div className="chatapp-sidebar-loading">Loading....</div>;
  }

  return (
    <aside className="chatapp-sidebar">
      <div className="chatapp-sidebar-header">
        <div className="chatapp-user-avatar large">
          <img
            src={'https://avatar.iran.liara.run/public/boy'}
            alt={user.username}
          />
          <span className="chatapp-status-indicator online"></span>
        </div>
        <h3>{user.username}</h3>
        <p className="chatapp-user-tag">{user.email}</p>
      </div>
      <div className="chatapp-sidebar-channels">
        <div className="chatapp-channel-section">
          <div className="chatapp-channel-header">
            <span>welcome</span>
          </div>
         
        </div>
     
      </div>
      <div className="chatapp-sidebar-footer">
        <button onClick={handleLogout} className="chatapp-logout-btn">
          <svg className="chatapp-logout-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M16 17v-3H9v-4h7V7l5 5-5 5M14 19H3V5h11v2h-9v10h9v2z"/>
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;