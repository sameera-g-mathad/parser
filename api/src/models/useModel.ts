import { pg } from '../db';

// Handles user related queries.

interface user {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  pct: string;
  id: string;
  created_at: string;
}

// Insert an user into db.
export const insert = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<void> => {
  firstName = firstName.toLowerCase();
  lastName = lastName.toLowerCase();
  await pg.query(
    `INSERT INTO users(firstname, lastname, email, password) VALUES($1, $2, $3, $4);`,
    [firstName, lastName, email, password]
  );
  console.log('user created.');
};

export const searchUser = async (email: string): Promise<any> => {
  const user = await pg.query(`SELECT * FROM users WHERE email=$1 LIMIT 1`, [
    email,
  ]);
  return user.rows;
};

export const userExists = async (email: string): Promise<boolean> => {
  const { rowCount } = await pg.query(
    `SELECT 1 FROM users where email=$1 LIMIT 1`,
    [email]
  );
  return rowCount! > 0 || false;
};

// Get all users.
export const selectAll = async (): Promise<user[]> => {
  const result = await pg.query(`SELECT * FROM USERS;`);
  return result.rows;
};
