require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const ordersRouter = require('./routes/order');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use('/api/orders', ordersRouter);

app.post('/api/line-login', async (req, res) => {
  const { idToken } = req.body;
  try {
    const response = await axios.post(`https://api.line.me/oauth2/v2.1/verify`, {
      id_token: idToken,
      client_id: process.env.LINE_CHANNEL_ID
    });
    const userId = response.data.sub;
    req.session.userId = userId;
    res.json({ userId });
  } catch (error) {
    res.status(400).json({ error: 'Invalid ID token' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
