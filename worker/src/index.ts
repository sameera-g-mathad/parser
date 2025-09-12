import { redisClient } from './db';
import './emailHandler';
import './processFile';
// Create a redis client.
const connect = async () => {
  await redisClient.connect();

  redisClient.on('error', (err) => {
    console.log('Error connecting to redis DB!!!');
    console.log('Exiting');
    process.exit(1);
  });
};

connect();
