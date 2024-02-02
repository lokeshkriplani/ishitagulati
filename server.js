const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 3000;

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'onlinebookstore',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use(express.json());
app.use(cors()); // Enable CORS

app.post('/events', async (req, res) => {
  try {
    const { title, start, end } = req.body;

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO events (title, start, end) VALUES (?, ?, ?)',
      [title, start, end]
    );
    connection.release();

    const insertedEvent = {
      id: result.insertId,
      title,
      start,
      end,
    };

    res.status(201).json(insertedEvent);
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).send(error.message);
  }
});

app.get('/events', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM events');
    connection.release();

    res.json(rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send(error.message);
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

