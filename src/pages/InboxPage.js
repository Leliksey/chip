// src/pages/InboxPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const InboxPage = () => {
  const { user } = useUser(); // Получаем текущего пользователя из контекста
  const [chats, setChats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/chats?userId=${user.id}`);
        setChats(response.data.chats); // Сохраняем список чатов
      } catch (error) {
        console.error('Ошибка при загрузке чатов:', error);
        setError('Не удалось загрузить чаты.');
      }
    };

    fetchChats();
  }, [user.id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (chats.length === 0) {
    return <p>У вас пока нет сообщений.</p>;
  }

  return (
    <div>
      <h2>Ваши чаты</h2>
      <ul>
        {chats.map((chat) => (
          <li key={chat.id}>
            <Link to={`/chat/${chat.id}`}>
              <p>Собеседник: {chat.participantName}</p>
              <p>Последнее сообщение: {chat.lastMessage}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InboxPage;
