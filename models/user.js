import database from "infra/database";
import { NotFoundError, ValidationError } from "infra/errors";

async function findOneByUsername(username) {
  const user = await runGetQuery(username);
  return user;

  async function runGetQuery(username) {
    const user = await database.query({
      text: `
    SELECT *
    FROM users
    WHERE
    LOWER(username) = LOWER($1)
    LIMIT 1
    ;
    `,
      values: [username],
    });

    if (!user.rowCount) {
      throw new NotFoundError({
        message: "username not found",
        action: "verify the username param",
      });
    }

    return user.rows[0];
  }
}

async function create(userData) {
  await validateUniqueEmail(userData.email);
  await validateUniqueUsername(userData.username);
  const newUser = runInsertQuery(userData);
  return newUser;

  async function runInsertQuery(userData) {
    const results = await database.query({
      text: `INSERT INTO users 
        (username, email, password) 
        VALUES($1, $2, $3)
        RETURNING *
        ;`,
      values: [userData.username, userData.email, userData.password],
    });
    return results.rows[0];
  }

  async function validateUniqueUsername(username) {
    const results = await database.query({
      text: `
        SELECT username 
        FROM users 
        WHERE LOWER(username) = LOWER($1)
        ;
      `,
      values: [username],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "this username is already taken.",
        action: "Verify your creedentials and try again.",
      });
    }
  }
  async function validateUniqueEmail(email) {
    const results = await database.query({
      text: `
      SELECT email 
      FROM users 
      WHERE LOWER(email) = LOWER($1)
      ;
      `,
      values: [email],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "Error with creedentials",
        action: "Verify your creedentials and try again.",
      });
    }
  }
}

export const user = {
  create,
  findOneByUsername,
};
