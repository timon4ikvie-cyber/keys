import { redis } from '../lib/keys.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://keyvault.vercel.app');
  const { key, device = 'x' } = req.query;
  const d = await redis.get('key:' + key);
  if (!d) return res.json({ valid: false, reason: 'not_found' });
  if (d.expires && Date.now() > d.expires)
    return res.json({ valid: false, reason: 'expired' });
  if (!d.devices.includes(device)) {
    if (d.devices.length >= d.max)
      return res.json({ valid: false, reason: 'limit' });
    d.devices.push(device);
    await redis.set('key:' + key, d);
  }
  res.json({ valid: true, expires: d.expires });
}
