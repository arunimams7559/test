
import React, { useState } from 'react';
import { useUser } from '../context/usercontext';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return <div className="chatapp-sidebar-loading">Loading....</div>;
  }

  return (
    <aside className="chatapp-sidebar">      
      <div className="chatapp-app-name">
        <span className="chatapp-logo">💬</span>
        <h1>ChatWave</h1>
      </div>
      <div className="chatapp-sidebar-header">
        <div className="chatapp-user-avatar large" onClick={() => setShowProfile(true)}>
          <img
            src={'https://avatar.iran.liara.run/public/boy'}
            alt={user.username}
          />
          <span className="chatapp-status-indicator online"></span>
        </div>
        <h3>{user.username}</h3>
      </div>
        {showProfile && (
        <div className={`chatapp-profile-overlay ${showProfile ? 'visible' : ''}`} onClick={() => setShowProfile(false)}>
          <div className="chatapp-profile-container" onClick={e => e.stopPropagation()}>
            <div className="chatapp-profile-header">
              <button className="chatapp-close-button" onClick={() => setShowProfile(false)}>×</button>
            </div>
            <div className="chatapp-profile-picture">
              <img src={'https://avatar.iran.liara.run/public/boy'} alt={user.username} />
            </div>
            <div className="chatapp-profile-info">
              <h2 className="chatapp-profile-name">{user.username}</h2>
              <p className="chatapp-profile-email">{user.email}</p>
              <div className="chatapp-profile-status">
                <span className="chatapp-status-indicator online"></span>
                <span className="chatapp-status-text online">Online</span>
              </div>
            </div>
          </div>
        </div>
      )}       <div className="chatapp-sidebar-menu">
        <button className="chatapp-menu-item active">
          <svg className="chatapp-menu-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2M20 16H5.2L4 17.2V4H20V16Z" />
          </svg>
          <span>Messages</span>
        </button>
        <button className="chatapp-menu-item">
          <svg className="chatapp-menu-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 17V19H2V17S2 13 9 13 16 17 16 17M12.5 7.5A3.5 3.5 0 1 0 9 11A3.5 3.5 0 0 0 12.5 7.5M15.94 13A5.32 5.32 0 0 1 18 17V19H22V17S22 13.37 15.94 13M15 4A3.39 3.39 0 0 0 13.07 4.59A5 5 0 0 1 13.07 10.41A3.39 3.39 0 0 0 15 11A3.5 3.5 0 0 0 15 4Z" />
          </svg>
          <span>Contacts</span>
        </button>
        <button className="chatapp-menu-item">
          <svg className="chatapp-menu-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5A3.5 3.5 0 0 1 15.5 12A3.5 3.5 0 0 1 12 15.5M19.43 12.97C19.47 12.65 19.5 12.33 19.5 12C19.5 11.67 19.47 11.34 19.43 11L21.54 9.37C21.73 9.22 21.78 8.95 21.66 8.73L19.66 5.27C19.54 5.05 19.27 4.96 19.05 5.05L16.56 6.05C16.04 5.66 15.5 5.32 14.87 5.07L14.5 2.42C14.46 2.18 14.25 2 14 2H10C9.75 2 9.54 2.18 9.5 2.42L9.13 5.07C8.5 5.32 7.96 5.66 7.44 6.05L4.95 5.05C4.73 4.96 4.46 5.05 4.34 5.27L2.34 8.73C2.21 8.95 2.27 9.22 2.46 9.37L4.57 11C4.53 11.34 4.5 11.67 4.5 12C4.5 12.33 4.53 12.65 4.57 12.97L2.46 14.63C2.27 14.78 2.21 15.05 2.34 15.27L4.34 18.73C4.46 18.95 4.73 19.03 4.95 18.95L7.44 17.94C7.96 18.34 8.5 18.68 9.13 18.93L9.5 21.58C9.54 21.82 9.75 22 10 22H14C14.25 22 14.46 21.82 14.5 21.58L14.87 18.93C15.5 18.67 16.04 18.34 16.56 17.94L19.05 18.95C19.27 19.03 19.54 18.95 19.66 18.73L21.66 15.27C21.78 15.05 21.73 14.78 21.54 14.63L19.43 12.97Z" />
          </svg>
          <span>Settings</span>
        </button>
      </div>      <div className="chatapp-sidebar-footer">
        <button onClick={handleLogout} className="chatapp-logout-btn">
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;