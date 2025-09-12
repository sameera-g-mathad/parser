import app from './app';
import { pg, redisClient } from './db';

const connect = async () => {
  try {
    // Connect to pg client.
    await pg.connect();
    pg.on('error', (err, _) => {
      console.log('Error connecting to Postgress DB!!!');
      throw err;
    });

    // pg connected succesfully.
    console.log('Connected to Postgres DB!!!');

    console.log(
      (
        await pg.query(
          `SELECT tablename FROM pg_catalog.pg_tables where schemaname='public';`
        )
      ).rows
    );

    await redisClient.connect();

    redisClient.on('error', (err) => {
      console.log('Error connecting to Redis DB!!!');
      throw err;
    });

    // redis connected succesfully.
    console.log('Conneted to Redis DB!!!');

    app.listen(process.env.PORT || 4000, () =>
      console.log('API started and working!!!')
    );
  } catch (error) {
    console.log('Error in the connection setup:\n', error);
    console.log('Exiting the server.');
    process.exit(1);
  }
};

connect();
