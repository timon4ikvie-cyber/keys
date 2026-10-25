import crypto from 'crypto';
import { redis } from '../lib/keys.js';

export default async function handler(req, res) {
  const t = crypto.randomBytes(8).toString('hex');
  await redis.set('t:' + t, Date.now(), { ex: 3600 });
  res.setHeader('Set-Cookie',
    `t=${t}; Path=/; Max-Age=3600; HttpOnly; Secure; SameSite=Lax`);
  res.redirect(302, process.env.LV_LINK);
}
