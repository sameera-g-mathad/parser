import { createClient } from 'redis';

// Create a redis client.
export const redisClient = createClient({
  url: process.env.REDISURL,
});

// Create a redis duplicate to listen to publishing events.
export const redisSub = redisClient.duplicate();
redisSub.connect();
