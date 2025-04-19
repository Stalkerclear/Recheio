const axios = require('axios');

let data = [];

module.exports = async (req, res) => {
  const { dest } = req.query;
  if (!dest) return res.status(400).send('Missing dest');

  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

  let geo = {};
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    geo = {
      city: response.data.city || '-',
      country: response.data.country || '-',
      isp: response.data.isp || '-'
    };
  } catch (err) {
    console.error('Geo error:', err.message);
  }

  data.push({ ip, ...geo, timestamp: new Date().toISOString() });

  res.writeHead(302, { Location: dest });
  res.end();
};

module.exports.data = () => data;
