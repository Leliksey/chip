// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axios from 'axios';

const Header = () => {
  const { user } = useUser(); // Получаем текущего пользователя из контекста
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessagesCount, setNewMessagesCount] = useState(null); // Начальное состояние — null
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewMessagesCount = async () => {
      if (user) {
        try {
          const response = await axios.get(`http://localhost:5000/new-messages-count?userId=${user.id}`);
          if (response.status === 200) {
            setNewMessagesCount(response.data.count || 0); // Устанавливаем количество новых сообщений
          } else {
            console.error('Ошибка сервера:', response.status, response.statusText);
          }
        } catch (error) {
          console.error('Ошибка при запросе новых сообщений:', error.message);
        }
      }
    };

    fetchNewMessagesCount(); // Первый вызов

    const interval = setInterval(fetchNewMessagesCount, 30000); // Обновляем каждые 30 секунд
    return () => clearInterval(interval); // Очищаем интервал при размонтировании
  }, [user]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get(`http://localhost:5000/users?name=${searchQuery}`);
      if (response.status === 200 && response.data.users?.length > 0) {
        navigate(`/search?query=${searchQuery}`); // Перенаправляем на страницу поиска
      } else {
        alert('Пользователи не найдены.');
      }
    } catch (error) {
      alert('Ошибка при поиске пользователей.');
      console.error('Ошибка при поиске:', error.message);
    }
  };

  return (
    <header style={styles.header}>
      <nav>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <Link to="/" style={styles.navLink}>Главная</Link>
          </li>
          {!user && (
            <li style={styles.navItem}>
              <Link to="/login" style={styles.navLink}>Войти</Link>
            </li>
          )}
          {user && (
            <>
              <li style={styles.navItem}>
                <Link to="/profile" style={styles.navLink}>Профиль</Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/inbox" style={styles.navLink}>
                  Входящие
                  {newMessagesCount > 0 && (
                    <span style={styles.newMessagesBadge}>
                      +{newMessagesCount}
                    </span>
                  )}
                </Link>
              </li>
            </>
          )}
          <li style={styles.navItem}>
            <Link to="/news-feed" style={styles.navLink}>Лента новостей</Link>
          </li>
        </ul>
      </nav>
      <form onSubmit={handleSearch} style={styles.searchForm}>
        <input
          type="text"
          placeholder="Найти пользователя"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
        <button type="submit" style={styles.searchButton}>Поиск</button>
      </form>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#333',
    padding: '10px 0',
    textAlign: 'center',
  },
  navList: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
  },
  navItem: {
    margin: '0 15px',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '18px',
    padding: '8px 16px',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  },
  searchForm: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
  },
  searchInput: {
    padding: '8px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginRight: '5px',
  },
  searchButton: {
    padding: '8px 16px',
    fontSize: '16px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  newMessagesBadge: {
    backgroundColor: '#f44336',
    color: 'white',
    fontSize: '14px',
    borderRadius: '50%',
    padding: '0 5px',
    marginLeft: '5px',
  },
};

export default Header;
