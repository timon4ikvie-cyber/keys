import { redis } from '../lib/keys.js';
import crypto from 'crypto';

export default async function handler(req, res) {
  const t = crypto.randomBytes(8).toString('hex');
  await redis.set('t:' + t, Date.now(), { ex: 3600 });
  const url = `https://${req.headers.host}/callback?t=${t}`;
  const r = Buffer.from(url).toString('base64');
  res.redirect(302, `${process.env.LV_LINK}?r=${encodeURIComponent(r)}`);
}
