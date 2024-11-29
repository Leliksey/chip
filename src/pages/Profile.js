// src/pages/Profile.js
import React from 'react';
import { useUser } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  if (!user) {
    return <h2>Пожалуйста, зарегистрируйтесь или войдите в систему.</h2>;
  }

  const handleLogout = () => {
    logout();
    navigate('/login'); // Перенаправляем на страницу логина после выхода
  };

  return (
    <div>
      <h2>Добро пожаловать, {user.name}!</h2>
      <p>Email: {user.email}</p>
      <p>Дата рождения: {user.birthDate}</p>
      <Link to="/news-feed">
        <button style={{ padding: '10px', fontSize: '16px', backgroundColor: '#4caf50', color: 'white', border: 'none', cursor: 'pointer' }}>
          Перейти в ленту новостей
        </button>
      </Link>
      <button
        onClick={handleLogout}
        style={{ padding: '10px', fontSize: '16px', backgroundColor: '#f44336', color: 'white', border: 'none', cursor: 'pointer', marginTop: '10px' }}
      >
        Выйти из системы
      </button>
    </div>
  );
};

export default Profile;
