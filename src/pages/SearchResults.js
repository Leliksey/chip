// src/pages/SearchResults.js
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const SearchResults = () => {
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query'); // Получаем запрос из URL

  useEffect(() => {
    if (!query) return;

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users?name=${query}`);
        if (response.data.users) {
          setUsers(response.data.users);
        }
      } catch (error) {
        alert('Ошибка при загрузке пользователей.');
      }
    };

    fetchUsers();
  }, [query]);

  if (users.length === 0) {
    return <p>Пользователи не найдены.</p>;
  }

  return (
    <div>
      <h2>Результаты поиска для "{query}"</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link to={`/user/${user.name}`}>{user.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
