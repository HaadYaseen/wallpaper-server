// import RedisStore from 'rate-limit-redis';
// import Redis from 'ioredis';
// import rateLimit from 'express-rate-limit';
// import type { RedisReply } from 'rate-limit-redis';

// const redisClient = new Redis();

// // RedisStore expects sendCommand function
// // ioredis.call signature matches what RedisStore needs
// export const rateLimiter = rateLimit({
//   store: new RedisStore({
//     sendCommand: (...args: [string, ...string[]]): Promise<RedisReply> => {
//       return redisClient.call(...args) as Promise<RedisReply>;
//     },
//   }),
//   windowMs: 15 * 60 * 1000,
//   max: 200,
//   message: 'Too many requests, please try again later.',
// });

import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // limit each IP to 100 requests per window
  message: 'Too many requests, please try again later.',
  standardHeaders: true,    // return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,     // disable the `X-RateLimit-*` headers
});
