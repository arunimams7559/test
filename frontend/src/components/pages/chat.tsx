
import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/usercontext';
import io from 'socket.io-client';
import axios from 'axios';


const socket = io('http://localhost:5000');
(window as any).socket = socket;

interface Message {
  sender: string;
  text: string;
  timestamp: string;
}

interface ChatProps {
  selectedUser: {
    _id: string;
    username: string;
    isOnline?: boolean;
    avatar?: string;
  } | null;
}

const Chat: React.FC<ChatProps> = ({ selectedUser }) => {
  const { user } = useUser();
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?._id) {
      socket.emit('user_connected', user._id);
    }

    return () => {
    
    };
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (!user || !selectedUser) return;

    setLoading(true);
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/userauth/messages', {
          params: {
            senderId: user._id,
            receiverId: selectedUser._id,
          },
        });

        const messages = response.data.messages.map((msg: any) => ({
          sender: msg.senderId.username,
          text: msg.content,
          timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));

        setChatMessages(messages);
      } catch (err) {
        console.error('Error fetching chat history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [user, selectedUser]);

  useEffect(() => {
    const receiveMessage = (incomingMessage: Message) => {
      setChatMessages((prevMessages) => [...prevMessages, incomingMessage]);
    };

    socket.on('chat message', receiveMessage);

    return () => {
      socket.off('chat message', receiveMessage);
    };
  }, []);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !user || !selectedUser) return;

    const newMessage: Message = {
      sender: user.username,
      text: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    socket.emit('chat message', newMessage);

    try {
      await axios.post('http://localhost:5000/api/userauth/messages', {
        senderId: user._id,
        receiverId: selectedUser._id,
        content: messageInput,
      });
    } catch (err) {
      console.error('Failed to save message:', err);
    }

    setMessageInput('');
  };

  if (!selectedUser) {

    return (
      <div className="chatapp-chat-wrapper chatapp-empty-chat">
        <div className="chatapp-empty-chat-state">

          <p>Select a user to start chatting.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chatapp-chat-wrapper">
      <div className="chatapp-chat-header">
        <div className="chatapp-chat-user-info">
          <div className="chatapp-chat-user-avatar">
            <img
              src={selectedUser.avatar || 'https://avatar.iran.liara.run/public/boy'}
              alt={selectedUser.username}
            />
            <span className={`chatapp-status-indicator ${selectedUser.isOnline ? 'online' : 'offline'}`}></span>
          </div>
          <div className="chatapp-chat-user-details">
            <h3>{selectedUser.username}</h3>
            <p className={`chatapp-status-text ${selectedUser.isOnline ? 'online' : 'offline'}`}>
              {selectedUser.isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      <div className="chatapp-chat-messages">
        {loading ? (
          <div className="chatapp-loading-messages">
            <div className="chatapp-loading-spinner"></div>
            <p>Loading messages...</p>
          </div>
        ) : chatMessages.length === 0 ? (
          <div className="chatapp-no-messages">
            <p> Say hello!</p>
          </div>
        ) : (
          chatMessages.map((msg, index) => {
            const sentByCurrentUser = msg.sender === user?.username;
            return (
              <div
                key={index}
                className={`chatapp-message-bubble ${sentByCurrentUser ? 'sent' : 'received'}`}
              >
                <span className="chatapp-message-text">{msg.text}</span>
                <span className="chatapp-message-meta">{msg.timestamp}</span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatapp-chat-input">
        <input
          type="text"
          placeholder={`Type your Message...`}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage} aria-label="Send message">
          <svg className="chatapp-send-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Chat;