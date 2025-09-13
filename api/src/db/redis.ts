import { createClient } from 'redis';

// To connect to redis client.
// Requied: Url (Ex: redis://host:6379)
export const redisClient = createClient({
  url: process.env.REDISURL,
});

// create a redis publisher.
export const redisPub = redisClient.duplicate();
redisPub.connect();
