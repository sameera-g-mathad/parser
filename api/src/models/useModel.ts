import { pg } from '../db';

// Handles user related queries.

interface user {
  email: string;
  password: string;
  pct: string;
  id: string;
  created_at: string;
  active: boolean;
}

// Insert an user into db.
export const insert = async (
  email: string,
  password: string
): Promise<void> => {
  await pg.query(
    `INSERT INTO USERS(EMAIL, PASSWORD, ACTIVE) VALUES($1, $2, $3);`,
    [email, password, true]
  );
  console.log('user inserted.');
};

// Get all users.
export const selectAll = async (): Promise<user[]> => {
  const result = await pg.query(`SELECT * FROM USERS;`);
  return result.rows;
};
