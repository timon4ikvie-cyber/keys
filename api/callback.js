import { redis, createKey } from '../lib/keys.js';

export default async function handler(req, res) {
  const t = (req.headers.cookie || '').match(/(?:^|; )t=([^;]+)/)?.[1];
  const start = t && (await redis.get('t:' + t));
  if (!start) return res.status(400).send('Начните с /start');
  await redis.del('t:' + t);
  if (Date.now() - Number(start) < 20000)
    return res.status(403).send('Слишком быстро. Пройдите Linkvertise.');
  const key = await createKey(1, 1);
  res.redirect(302, `https://keyvault.vercel.app/#key=${key}`);
}
