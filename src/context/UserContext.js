// src/context/UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Создаем контекст пользователя
const UserContext = createContext();

// Создаем провайдер контекста
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Загружаем данные пользователя из localStorage при старте приложения
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = (userData) => {
    // Сохраняем данные о пользователе в localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    // Удаляем данные о пользователе из localStorage
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Хук для получения данных о пользователе
export const useUser = () => {
  return useContext(UserContext);
};
