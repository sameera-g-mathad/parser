import { Pool } from 'pg';

// Create a new instance of PG database.
// Required = [Database, Host, Port, Password, User]
export const pg = new Pool({
  database: process.env.PGDATABASE,
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT!),
});
