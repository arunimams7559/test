import React, { useState, useEffect } from 'react';
import { useUser } from '../context/usercontext';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');


interface Message {
  sender: string;
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

 
  useEffect(() => {
    if (!user || !selectedUser) return;

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
          timestamp: new Date(msg.timestamp).toLocaleTimeString(),
        }));

        setChatMessages(messages);
      } catch (err) {
        console.error('Error fetching chat history:', err);
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
      timestamp: new Date().toLocaleTimeString(),
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
    return <div className="chat-wrapper">Select a user to start chatting.</div>;
  }

  return (
    <div className="chat-wrapper">
      <h3>Chat with {selectedUser.username}</h3>

      <div className="chat-messages">
        {chatMessages.map((msg, index) => {
          const sentByCurrentUser = msg.sender === user?.username;
          return (
            <div
              key={index}
              className={`message-bubble ${sentByCurrentUser ? 'sent' : 'received'}`}
            >
              <span className="message-text">{msg.text}</span>
              <span className="message-meta">{msg.timestamp}</span>
            </div>
          );
        })}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type  message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
