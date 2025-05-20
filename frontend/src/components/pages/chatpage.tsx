import React, { useState } from 'react';
import Sidebar from './sidebar';
import UserList from './userlist';
import Chat from './chat';
import '../style/chatpage.css'; 

interface SelectedUser {
  _id: string;
  username: string;
}

const ChatPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);

  return (
    <div className="chat-page-container" style={{ display: 'flex', height: '100vh' }}>
   
      <div style={{ width: '20%' }}>
        <Sidebar />
      </div>

     
      <div style={{ flex: 1, borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc' }}>
        <Chat selectedUser={selectedUser} />
      </div>

     
      <div style={{ width: '25%' }}>
        <UserList onSelectUser={setSelectedUser} />
      </div>
    </div>
  );
};

export default ChatPage;
