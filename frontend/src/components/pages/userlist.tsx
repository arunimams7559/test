
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/userlist.css';
import { useUser } from '../context/usercontext';

interface User {
  _id: string;
  username: string;
  isOnline?: boolean;
  avatar?: string;
}

interface UserListProps {
  onSelectUser: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ onSelectUser }) => {
  const { user } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    axios.get(`http://localhost:5000/api/userauth/users?exclude=${user._id}`)
      .then((res) => {
        setUsers(res.data.users);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch users:', err);
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    const socket = (window as any).socket;

    if (!socket) return;

    const handleUserStatusChange = (data: { userId: string; isOnline: boolean }) => {
      setUsers(prevUsers =>
        prevUsers.map(u =>
          u._id === data.userId
            ? { ...u, isOnline: data.isOnline }
            : u
        )
      );
    };

    socket.on('user_status_change', handleUserStatusChange);

    return () => {
      socket.off('user_status_change', handleUserStatusChange);
    };
  }, []);

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="chatapp-user-list-container">
      <div className="chatapp-user-list-header">
        <h3>Contacts</h3>
        <div className="chatapp-user-search-container">
          <svg className="chatapp-search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="chatapp-user-search"
          />
        </div>
      </div>
      <ul className="chatapp-user-list">
        {loading ? (
          <div className="chatapp-user-list-loading">
            <div className="chatapp-loading-spinner"></div>
            <p>Loading contacts...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="chatapp-no-users-found">
            {searchTerm ?
              <p>No users matching "{searchTerm}"</p> :
              <p>No other users available</p>
            }
          </div>
        ) : (
          filteredUsers.map((u) => (
            <li
              key={u._id}
              onClick={() => onSelectUser(u)}
              className="chatapp-user-list-item"
            >
              <div className="chatapp-user-list-avatar">
                <img
                  src={u.avatar || 'https://avatar.iran.liara.run/public/boy'}
                  alt={u.username}
                />
                <span
                  className={`chatapp-status-indicator ${
                    u.isOnline ? 'online' : 'offline'
                  }`}
                ></span>
              </div>
              <div className="chatapp-user-list-info">
                <span className="chatapp-user-list-name">{u.username}</span>
                <span className={`chatapp-user-list-status ${u.isOnline ? 'online' : 'offline'}`}>
                  {u.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default UserList;