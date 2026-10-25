import { Redis } from '@upstash/redis';
import crypto from 'crypto';

export const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

const part = () => crypto.randomBytes(2).toString('hex').toUpperCase();
export const makeKey = () =>
  `RBX-${part()}-${part()}-${part()}-${part()}-${part()}`;

export async function createKey(days = 1, people = 1) {
  const key = makeKey();
  await redis.set('key:' + key, {
    expires: days ? Date.now() + days * 864e5 : null,
    max: people,
    devices: [],
  });
  return key;
}
