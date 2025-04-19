const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

let data = [];

// Redirecionamento com rastreamento
app.get('/go/:id', async (req, res) => {
  const encoded = req.params.id;
  const decoded = Buffer.from(encoded, 'base64').toString();
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

  let geo = {};
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    geo = {
      city: response.data.city,
      country: response.data.country,
      isp: response.data.isp
    };
  } catch {}

  data.push({
    ip,
    ...geo,
    timestamp: new Date().toISOString()
  });

  res.redirect(decoded);
});

// API para painel
app.get('/data', (req, res) => {
  res.json(data);
});

// Apagar dados depois de copiar
app.post('/clear', (req, res) => {
  data = [];
  res.sendStatus(200);
});

module.exports = app;
