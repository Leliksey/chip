import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ChatPage = () => {
  const { chat_id } = useParams(); // Получаем chat_id из URL
  const [messages, setMessages] = useState([]); // Для хранения сообщений
  const [newMessage, setNewMessage] = useState(''); // Для хранения текста нового сообщения
  const [user, setUser] = useState(null); // Для хранения информации о пользователе
  const [error, setError] = useState(null);
  // Загрузка сообщений при первом рендере компонента
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/messages?chat_id=${chat_id}`);
        setMessages(response.data.messages || []);
      } catch (error) {
        console.error('Ошибка при загрузке сообщений:', error);
        setError('Ошибка при загрузке сообщений.');
      }
    };

    // Получаем информацию о текущем пользователе
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user'); // Запрос для получения информации о пользователе
        setUser(response.data); // Предположим, что ответ содержит информацию о пользователе
      } catch (error) {
        console.error('Ошибка при получении пользователя:', error);
        setError('Не удалось получить информацию о пользователе.');
      }
    };

    fetchMessages();
    fetchUser();
  }, [chat_id]);

  // Отправка нового сообщения
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return; // Проверка, если сообщение пустое или состоит из пробелов

    if (!user) {
      setError('Пользователь не авторизован.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/messages', {
        chat_id: chat_id,
        sender_id: user.id, 
        created_at: new Date().toISOString(),
        text: newMessage,
      });

      setNewMessage(''); // Очищаем поле ввода после отправки
      // Обновляем список сообщений после отправки
      const response = await axios.get(`http://localhost:5000/messages?chat_id=${chat_id}`);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
      setError('Не удалось отправить сообщение.');
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Чат</h2>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            <strong>{message.sender_id}:</strong> {message.text}
          </li>
        ))}
      </ul>

      {/* Поле для ввода нового сообщения */}
      <textarea
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Введите сообщение"
      />
      <button onClick={handleSendMessage}>Отправить</button>
    </div>
  );
};

export default ChatPage;
