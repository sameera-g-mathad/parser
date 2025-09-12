import { redisSub } from './db';

redisSub.subscribe('processFile', (channel, message) => {
  console.log(channel);
});
