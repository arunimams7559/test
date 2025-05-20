import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/usercontext';
import io from 'socket.io-client';
import axios from 'axios';
import '../style/chatpage.css';

const socket = io('http://localhost:5000');

interface Message {
  sender: string;
  receiver: string;
  text: string;
  timestamp: string;
}

interface ChatProps {
  selectedUser: { _id: string; username: string } | null;
}

const Chat: React.FC<ChatProps> = ({ selectedUser }) => {
  const { user } = useUser();
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Fetch chat history
  useEffect(() => {
    if (!user || !selectedUser) return;

    const fetchChatHistory = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/userauth/messages', {
          params: {
            senderId: user._id,
            receiverId: selectedUser._id,
          },
        });

        const msgs: Message[] = data.messages.map((m: any) => ({
          sender: m.senderId.username,
          receiver: m.receiverId.username,
          text: m.content,
          timestamp: new Date(m.timestamp).toLocaleTimeString(),
        }));

        setChatMessages(msgs);
      } catch (err) {
        console.error('Error fetching chat history:', err);
      }
    };

    fetchChatHistory();
  }, [user, selectedUser]);

  // Handle incoming socket messages
  useEffect(() => {
    const receiveMessage = (incoming: Message) => {
      const isRelevant =
        (incoming.sender === user?.username && incoming.receiver === selectedUser?.username) ||
        (incoming.sender === selectedUser?.username && incoming.receiver === user?.username);

      if (isRelevant) {
        setChatMessages((prev) => [...prev, incoming]);
      }
    };

    socket.on('chat message', receiveMessage);
    return () => {
      socket.off('chat message', receiveMessage);
    };
  }, [user, selectedUser]);

  // Send message
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !user || !selectedUser) return;

    const outgoing: Message = {
      sender: user.username,
      receiver: selectedUser.username,
      text: messageInput,
      timestamp: new Date().toLocaleTimeString(),
    };

    socket.emit('chat message', outgoing);

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
    return <div className="chat-wrapper">Select a user to start chatting.</div>;
  }

  return (
    <div className="chat-wrapper">
      <h3>{selectedUser.username}</h3>

      <div className="chat-messages">
        {chatMessages.map((msg, i) => {
          const me = msg.sender === user?.username;
          return (
            <div
              key={i}
              className={`message-bubble ${me ? 'sent' : 'received'}`}
            >
              <div className="message-text">
                {msg.text}
                <div className="message-meta">{msg.timestamp}</div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={messageInput}
          placeholder="Type a message…"
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
