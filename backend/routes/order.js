const express = require('express');
const mysql = require('mysql2/promise');
const axios = require('axios');

const router = express.Router();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'orders_db'
});

router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM orders');
  res.json(rows);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);

  const userId = req.session.userId;
  if (userId) {
    const message = `Order ID ${id} status has been updated to ${status}`;
    await sendLineMessage(userId, message);
  }

  res.json({ message: 'Order status updated' });
});

const sendLineMessage = async (userId, message) => {
  const lineAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  try {
    await axios.post('https://api.line.me/v2/bot/message/push', {
      to: userId,
      messages: [
        {
          type: 'text',
          text: message
        }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${lineAccessToken}`
      }
    });
  } catch (error) {
    console.error('Error sending LINE message', error);
  }
};

module.exports = router;
