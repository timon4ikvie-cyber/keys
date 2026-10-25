import { redis, createKey } from '../lib/keys.js';

export default async function handler(req, res) {
  const { t } = req.query;
  const start = t && (await redis.get('t:' + t));
  if (!start) return res.status(400).send('Начните с /start');
  await redis.del('t:' + t);
  if (Date.now() - Number(start) < 20000)
    return res.status(403).send('Слишком быстро. Пройдите Linkvertise.');
  const key = await createKey(1, 1);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`<h2>Ваш ключ</h2><code style="font-size:20px">${key}</code>`);
}
