import { Client } from "pg";
import { ServiceError } from "./errors";

async function query(queryObj) {
  let client;
  try {
    client = await getNewClient();
    const result = await client.query(queryObj);
    return result;
  } catch (error) {
    const serviceErrorObject = new ServiceError({
      message: "Fail connection with db or query.",
      cause: error,
    });

    throw serviceErrorObject;
  } finally {
    await client?.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: process.env.NODE_ENV !== "production" ? false : true,
  });
  await client.connect();
  return client;
}

const database = { query, getNewClient };
export default database;
