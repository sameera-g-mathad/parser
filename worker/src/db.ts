import { createClient } from 'redis';

// Create a redis client.
export const redisClient = createClient({
  url: process.env.REDISURL,
});
