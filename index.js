import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import fs from 'fs';

const app = express();
app.use(bodyParser.json());

const TELEGRAM_TOKEN = process.env.BOT_TOKEN;
const DB_FILE = './database.json';

// Endpoint per inviare notifiche
app.post('/notify', async (req, res) => {
  const { token, message } = req.body;
  const db = JSON.parse(fs.readFileSync(DB_FILE));
  const user = db[token];

  if (!user) return res.status(404).send('Token non valido.');

  const chatId = user.chat_id;
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message })
  });

  res.send('Messaggio inviato.');
});

// Endpoint per registrazione via Telegram (gestito separatamente con webhook)
app.post('/register', (req, res) => {
  // Placeholder se vuoi gestire via webhook, oppure fai a mano
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server avviato');
});
