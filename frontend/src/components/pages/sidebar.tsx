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
    return <p>Loading ....</p>;
  }

  return (
    <aside style={{ padding: '1rem', backgroundColor: '#f0f0f0', height: '100vh' }}>
      <h3>Hello, {user.username}!</h3>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout} style={{ cursor: 'pointer', padding: '0.5rem 1rem' }}>
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
