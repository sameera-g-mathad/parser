import { pg } from '../db';

// File to handle user related queries.
interface user {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  pct: string;
  id: string;
  created_at: string;
}

/**
 * Insert an user into db.
 * @param firstName string, firstname of the user
 * @param lastName string, lastname of the user
 * @param email string, email of the user
 * @param password string, password of the user
 */
export const insertUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<void> => {
  // convert all three fields into lower case for
  // consistency.
  firstName = firstName.toLowerCase();
  lastName = lastName.toLowerCase();
  email = email.toLowerCase();
  await pg.query(
    `INSERT INTO users(firstname, lastname, email, password) VALUES($1, $2, $3, $4);`,
    [firstName, lastName, email, password],
  );
  console.log('user created.');
};

/**
 * Query method to check if the user exists.
 * @param email Email of the user.
 * @returns An object consisting of user details.
 */
export const searchUser = async (email: string): Promise<any> => {
  const user = await pg.query(`SELECT * FROM users WHERE email=$1 LIMIT 1`, [
    email,
  ]);
  return user.rows[0];
};

/**
 * Query method to check if the user exists.
 * @param email Email of the user.
 * @returns boolean if the user exists or not.
 */
export const userExists = async (email: string): Promise<boolean> => {
  const { rowCount } = await pg.query(
    `SELECT 1 FROM users where email=$1 LIMIT 1`,
    [email],
  );
  return rowCount! > 0 || false;
};

/**
 * Query method to check if the user exists.
 * @param id Primary key of the user.
 * @returns An object consisting of user details.
 */
export const findById = async (id: string): Promise<any> => {
  const user = await pg.query(`SELECT * FROM users WHERE id=$1`, [id]);
  return user.rows[0];
};

/**
 * Method to update the user password given an email.
 * @param email Email of the user.
 * @param password New password to be updated.
 * @returns void
 */
export const updateUserPassword = async (
  email: string,
  password: string,
): Promise<void> => {
  await pg.query(
    `UPDATE users SET password=$1, pct=CURRENT_TIMESTAMP WHERE email=$2`,
    [password, email],
  );
};
