let data = global.data || [];
global.data = data;

export default async function handler(req, res) {
  const { dest } = req.query;
  if (!dest) return res.status(400).send('Missing destination');

  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
  let geo = {};

  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    geo = await response.json();
  } catch (e) {
    geo = { city: 'Unknown', country: 'Unknown', isp: 'Unknown' };
  }

  data.push({ ip, ...geo, timestamp: new Date().toISOString() });

  res.writeHead(302, { Location: decodeURIComponent(dest) });
  res.end();
}
