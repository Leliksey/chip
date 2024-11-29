// server/server.js
const express = require('express');
const mysql = require('mysql2');
// const bodyParser = require('body-parser');
const cors = require('cors');

const app = express(); // Сначала создаем app

app.use(cors()); // Теперь можно использовать cors

const port = 5000; // Порт сервера

// Парсим JSON в теле запроса
// app.use(bodyParser.json());
app.use(express.json());


// Настройка подключения к базе данных MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chip', // Имя вашей базы данных
});

// Подключение к базе данных
db.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err);
    return;
  }
  console.log('Подключено к базе данных MySQL');
});

// Роут для регистрации пользователя
app.post('/register', (req, res) => {
    const { name, email, password, birthDate } = req.body;
  
    // Проверка возраста (например, до 16 лет)
    const birthYear = new Date(birthDate).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
  
    if (age < 0 || age > 15) {
      return res.status(400).json({ error: 'Регистрация доступна только для детей младше 16 лет.' });
    }
  
    // Вставка данных в базу данных
    const query = 'INSERT INTO users (name, email, password, birthDate) VALUES (?, ?, ?, ?)';
    db.query(query, [name, email, password, birthDate], (err, result) => {
      if (err) {
        console.error('Ошибка при регистрации:', err);
        return res.status(500).json({ error: 'Ошибка при регистрации.' });
      }
      res.status(201).json({ message: 'Пользователь успешно зарегистрирован!' });
    });
  });

// Роут для авторизации пользователя
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, result) => {
    if (err) {
      console.error('Ошибка при авторизации:', err);
      return res.status(500).json({ error: 'Ошибка при авторизации.' });
    }
    if (result.length > 0) {
      res.status(200).json({ message: 'Авторизация прошла успешно!', user: result[0] });
    } else {
      res.status(401).json({ error: 'Неверный email или пароль.' });
    }
  });
});

// server/server.js
app.get('/users', (req, res) => {
  const { name } = req.query;  // Получаем значение из строки запроса

  const query = 'SELECT * FROM users WHERE name LIKE ?'; // Используем LIKE для частичного совпадения
  db.query(query, [`%${name}%`], (err, results) => {
    if (err) {
      console.error('Ошибка при поиске пользователя:', err);
      return res.status(500).json({ error: 'Ошибка при поиске пользователя.' });
    }

    if (results.length > 0) {
      res.json({ users: results });  // Отправляем список найденных пользователей
    } else {
      res.status(404).json({ error: 'Пользователи не найдены.' });
    }
  });
});

app.get('/user', (req, res) => {
  const user = { id: 1, username: 'user1', email: 'user1@example.com' }; // Пример данных
  res.json(user);
});

app.get('/chats', (req, res) => {
  const { userId } = req.query;

  const query = `
    SELECT c.id, u.name AS participantName, m.text AS lastMessage
    FROM chats c
    JOIN users u ON (c.user1 = u.id OR c.user2 = u.id) AND u.id != ?
    LEFT JOIN messages m ON m.chat_id = c.id
    WHERE c.user1 = ? OR c.user2 = ?
    ORDER BY m.created_at DESC
  `;

  db.query(query, [userId, userId, userId], (err, results) => {
    if (err) {
      console.error('Ошибка при получении чатов:', err);
      return res.status(500).json({ error: 'Не удалось загрузить чаты.' });
    }
    res.json({ chats: results });
  });
});


app.get('/messages', (req, res) => {
  console.log('Получен запрос на /messages');
  const { chat_id } = req.query; // Используем chat_id как в базе данных

  if (!chat_id) {
    return res.status(400).json({ error: 'chat_id не указан.' });
  }

  // Запрос для получения сообщений чата по chat_id
  const query = 'SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC';
  db.query(query, [chat_id], (err, results) => {
    if (err) {
      console.error('Ошибка при получении сообщений:', err);
      return res.status(500).json({ error: 'Ошибка при получении сообщений.' });
    }

    // Возвращаем список сообщений или пустой массив, если сообщений нет
    res.json({ messages: results.length > 0 ? results : [] });
  });
});


const moment = require('moment'); // Установите библиотеку: npm install moment

app.post('/messages', (req, res) => {
  console.log('Получен запрос на /messages');
  const { chat_id, sender_id, created_at, text } = req.body; // Получаем sender_id из запроса
  console.log('Полученные данные:', { chat_id, text, created_at, sender_id });

  if (!chat_id || !sender_id || !created_at || !text) {
    return res.status(400).json({ error: 'Не указаны все данные для отправки сообщения.' });
  }

  // Преобразование даты в формат MySQL
  const formattedDate = moment(created_at).format('YYYY-MM-DD HH:mm:ss');

  const query = 'INSERT INTO messages (chat_id, sender_id, created_at, text) VALUES (?, ?, ?, ?)';
  db.query(query, [chat_id, sender_id, formattedDate, text], (err, result) => {
    if (err) {
      console.error('Ошибка при отправке сообщения:', err);
      return res.status(500).json({ error: 'Ошибка при отправке сообщения.' });
    }
    console.log('Результат запроса:', result);
    res.status(201).json({ message: 'Сообщение отправлено!' });
  });
});





app.post('/chats', (req, res) => {
  const { user1, user2 } = req.body;

  if (!user1 || !user2) {
    return res.status(400).json({ error: 'Не указаны участники чата.' });
  }

  const queryCheck = 'SELECT id FROM chats WHERE (user1 = ? AND user2 = ?) OR (user1 = ? AND user2 = ?)';
  db.query(queryCheck, [user1, user2, user2, user1], (err, results) => {
    if (err) {
      console.error('Ошибка проверки существующего чата:', err);
      return res.status(500).json({ error: 'Ошибка сервера.' });
    }

    if (results.length > 0) {
      return res.json({ chat_id: results[0].id });
    }

    const queryInsert = 'INSERT INTO chats (user1, user2) VALUES (?, ?)';
    db.query(queryInsert, [user1, user2], (err, result) => {
      if (err) {
        console.error('Ошибка создания чата:', err);
        return res.status(500).json({ error: 'Ошибка создания чата.' });
      }

      res.json({ chat_id: result.insertId });
    });
  });
});


app.get('/new-messages-count', (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId не указан.' });
  }

  const query = `
    SELECT COUNT(*) AS count
    FROM messages
    WHERE chat_id IN (SELECT id FROM chats WHERE user1 = ? OR user2 = ?)
    AND is_read = 0
  `;
  db.query(query, [userId, userId], (err, results) => {
    if (err) {
      console.error('Ошибка при получении количества новых сообщений:', err);
      return res.status(500).json({ error: 'Ошибка при получении количества новых сообщений.' });
    }

    res.json({ count: results[0].count });
  });
});



// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер работает на порту ${port}`);
});
