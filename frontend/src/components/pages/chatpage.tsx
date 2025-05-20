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
    <div className="chat-page">
      <aside className="chat-sidebar">
        <Sidebar />
      </aside>

      
      <main className="chat-content">
        <Chat selectedUser={selectedUser} />
      </main>
      <section className="chat-userlist">
        <UserList onSelectUser={setSelectedUser} />
      </section>

      
    </div>
  );
};

export default ChatPage;
