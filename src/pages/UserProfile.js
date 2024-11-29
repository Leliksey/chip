// src/pages/UserProfile.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext'; // Импортируем контекст для текущего пользователя

const UserProfile = () => {
  const { name } = useParams(); // Получаем имя пользователя из URL
  const navigate = useNavigate(); // Навигация между страницами
  const { user: currentUser } = useUser(); // Получаем текущего пользователя из контекста
  const [profileUser, setProfileUser] = useState(null);
  const [error, setError] = useState(null); // Для отображения ошибок
  const [isLoading, setIsLoading] = useState(false); // Состояние для загрузки чата

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Получаем пользователя по имени
        const response = await axios.get(`http://localhost:5000/users?name=${name}`);
        if (response.data.users && response.data.users.length > 0) {
          setProfileUser(response.data.users[0]); // Устанавливаем данные пользователя
        } else {
          setError('Пользователь не найден');
        }
      } catch (error) {
        console.error('Ошибка загрузки пользователя:', error);
        setError('Ошибка при загрузке данных пользователя');
      }
    };
    fetchUser();
  }, [name]);

  const handleStartChat = async () => {
    setIsLoading(true); // Включаем состояние загрузки
    try {
      // Отправляем запрос на создание или получение существующего чата
      const response = await axios.post('http://localhost:5000/chats', {
        user1: currentUser.id, // Текущий пользователь
        user2: profileUser.id, // Пользователь из профиля
      });

      // Перенаправляем на страницу чата
      navigate(`/chat/${response.data.chat_id}`);
    } catch (error) {
      console.error('Ошибка при создании чата:', error);
      setError('Не удалось начать чат с пользователем.');
    } finally {
      setIsLoading(false); // Отключаем состояние загрузки
    }
  };

  if (error) {
    return <p>{error}</p>; // Отображаем ошибку
  }

  if (!profileUser) {
    return <p>Загрузка...</p>; // Показываем, пока данные загружаются
  }

  return (
    <div>
      <h2>Профиль пользователя: {profileUser.name}</h2>
      <p>Email: {profileUser.email}</p>
      <p>Дата рождения: {profileUser.birthDate}</p>
      {currentUser && currentUser.id !== profileUser.id && ( // Показываем кнопку только для других пользователей
        <button onClick={handleStartChat} disabled={isLoading}>
          {isLoading ? 'Загрузка...' : 'Написать сообщение'}
        </button>
      )}
    </div>
  );
};

export default UserProfile;
