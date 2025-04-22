const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('better-sqlite3');
const crypto = require('crypto');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// DB setup
const db = new sqlite3('bookstore.sqlite');

// Create tables if they don't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    token TEXT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    author TEXT,
    year INTEGER
  )
`).run();

// Helper: Auth Middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.replace('Bearer ', '');
  const user = db.prepare('SELECT * FROM users WHERE token = ?').get(token);

  if (!user) return res.status(403).json({ message: 'Invalid token' });

  req.user = user;
  next();
}

// Auth: Register
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  try {
    db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, password);
    res.json({ message: 'User registered' });
  } catch (err) {
    res.status(400).json({ message: 'Username already exists' });
  }
});

// Auth: Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);

  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const token = crypto.randomBytes(24).toString('hex');
  db.prepare('UPDATE users SET token = ? WHERE id = ?').run(token, user.id);

  res.json({ token });
});

// ===============================
// 📚 Book Routes (CRUD)
// ===============================

// READ all books
app.get('/books', authMiddleware, (req, res) => {
  const books = db.prepare('SELECT * FROM books').all();
  res.json(books);
});

// READ one book
app.get('/books/:id', authMiddleware, (req, res) => {
  const book = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
});

// CREATE new book
app.post('/books', authMiddleware, (req, res) => {
  const { title, author, year } = req.body;
  const result = db.prepare('INSERT INTO books (title, author, year) VALUES (?, ?, ?)').run(title, author, year);
  res.json({ id: result.lastInsertRowid });
});

// UPDATE book
app.put('/books/:id', authMiddleware, (req, res) => {
  const { title, author, year } = req.body;
  const result = db.prepare('UPDATE books SET title = ?, author = ?, year = ? WHERE id = ?')
    .run(title, author, year, req.params.id);

  if (result.changes === 0) return res.status(404).json({ message: 'Book not found' });
  res.json({ message: 'Book updated' });
});

// DELETE book
app.delete('/books/:id', authMiddleware, (req, res) => {
  const result = db.prepare('DELETE FROM books WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ message: 'Book not found' });
  res.json({ message: 'Book deleted' });
});

// ===============================

app.listen(port, () => {
  console.log(`Bookstore API listening at http://localhost:${port}`);
});
