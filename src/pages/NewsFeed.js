// src/pages/NewsFeed.js
import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext'; // Подключаем контекст пользователя

const NewsFeed = () => {
  const { user } = useUser(); // Получаем информацию о пользователе
  const [news, setNews] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  useEffect(() => {
    const fakeNews = [
      { id: 1, title: "Новости 1", content: "Контент новости 1", author: "admin" },
      { id: 2, title: "Новости 2", content: "Контент новости 2", author: "user" },
      { id: 3, title: "Новости 3", content: "Контент новости 3", author: "admin" }
    ];
    setNews(fakeNews);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPost.title && newPost.content) {
      setNews([...news, { ...newPost, id: news.length + 1, author: 'user' }]);
      setNewPost({ title: '', content: '' });
    }
  };

  return (
    <div>
      <h2>Лента новостей</h2>

      {/* Показываем форму только если пользователь авторизован */}
      {user ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <input
            type="text"
            name="title"
            placeholder="Заголовок"
            value={newPost.title}
            onChange={handleChange}
            required
            style={{ padding: '10px', fontSize: '14px', marginBottom: '10px', width: '100%' }}
          />
          <textarea
            name="content"
            placeholder="Контент новости"
            value={newPost.content}
            onChange={handleChange}
            required
            style={{ padding: '10px', fontSize: '14px', width: '100%', height: '100px' }}
          />
          <button
            type="submit"
            style={{
              padding: '10px', fontSize: '16px', backgroundColor: '#4caf50', color: 'white', border: 'none', cursor: 'pointer'
            }}
          >
            Опубликовать
          </button>
        </form>
      ) : (
        <p>Пожалуйста, войдите в систему, чтобы опубликовать новость.</p>
      )}

      {news.length > 0 ? (
        <ul>
          {news.map((item) => (
            <li key={item.id}>
              <h3>{item.title}</h3>
              <p>{item.content}</p>
              <p>Автор: {item.author}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет новостей.</p>
      )}
    </div>
  );
};

export default NewsFeed;
