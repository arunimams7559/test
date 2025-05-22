// chatpage.tsx
import React, { useState } from 'react';
import Sidebar from './sidebar';
import UserList from './userlist';
import Chat from './chat';
import '../style/chatpage.css';

interface SelectedUser {
  _id: string;
  username: string;
  isOnline?: boolean;
  avatar?: string;
}

const ChatPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);

  return (
    <div className="chatapp-chat-page">
      <div className="chatapp-chat-sidebar-left">
        <Sidebar />
      </div>

      <div className="chatapp-chat-main">
        <Chat selectedUser={selectedUser} />
      </div>

      <div className="chatapp-chat-sidebar-right">
        <UserList onSelectUser={setSelectedUser} />
      </div>
    </div>
  );
};

export default ChatPage;