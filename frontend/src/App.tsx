import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/pages/login';
import Signup from './components/pages/signup';
import ChatPage from './components/pages/chatpage';
import { UserProvider } from './components/context/usercontext';

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
