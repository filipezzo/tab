import database from "infra/database.js";
import { InternalServerError } from "infra/errors";

export default async function status(request, response) {
  try {
    const updatedAt = new Date().toISOString();

    const version = await database.query("SHOW server_version;");
    const maxConnections = await database.query("SHOW max_connections;");

    const usedDb = process.env.POSTGRES_DB;

    const usedConnections = await database.query({
      text: "SELECT  count(*) FROM pg_stat_activity WHERE datname = $1;",
      values: [usedDb],
    });

    const dbVersion = version?.rows[0].server_version;
    const dbMaxConnections = maxConnections.rows[0].max_connections;
    const dbOpenConnections = usedConnections.rows[0].count;

    console.log(usedConnections);
    response.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: dbVersion,
          max_connections: +dbMaxConnections,
          opened_connections: +dbOpenConnections,
        },
      },
    });
  } catch (error) {
    const publicError = new InternalServerError({
      cause: error,
    });
    response.status(500).json(publicError);
  }
}
