import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/userlist.css';
import { useUser } from '../context/usercontext';

interface User {
  _id: string;
  username: string;
  isOnline?: boolean;
}

interface UserListProps {
  onSelectUser: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ onSelectUser }) => {
  const { user } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) return;

    axios
      .get(`http://localhost:5000/api/userauth/users?exclude=${user._id}`)
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch((err) => {
        console.error('Failed to fetch users:', err);
      });
  }, [user]);

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-list-container">
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="user-search"
      />
      <ul className="user-list">
        {filteredUsers.map((u) => (
          <li
            key={u._id}
            onClick={() => onSelectUser(u)}
            className="user-list-item"
          >
            <span className={`status-dot ${u.isOnline ? 'online' : 'offline'}`} />
            {u.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
