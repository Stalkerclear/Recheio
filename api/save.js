let data = global.data || [];
global.data = data;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    const { ip, latitude, longitude } = JSON.parse(body);
    const item = data.find(d => d.ip === ip);
    if (item) {
      item.latitude = latitude;
      item.longitude = longitude;
    }
    res.status(200).end();
  });
}
