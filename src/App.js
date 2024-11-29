import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NewsFeed from './pages/NewsFeed';
import Header from './components/Header';
import { UserProvider } from './context/UserContext';
import UserProfile from './pages/UserProfile';
import SearchResults from './pages/SearchResults';
import InboxPage from './pages/InboxPage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <UserProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/news-feed" element={<NewsFeed />} />
          <Route path="/user/:name" element={<UserProfile />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/chat/:chat_id" element={<ChatPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
