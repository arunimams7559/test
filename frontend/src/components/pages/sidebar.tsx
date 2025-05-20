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
    return <p className="sidebar-loading">Loading ....</p>;
  }

  return (
    <aside className="sidebar-container">
      <h3 className="sidebar-greeting">Hello, {user.username}</h3>
      <p className="sidebar-email">Email: {user.email}</p>
      <button className="sidebar-logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
