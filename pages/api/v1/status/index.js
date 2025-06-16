import controller from "infra/controller";
import database from "infra/database.js";
import { createRouter } from "next-connect";

const router = createRouter();
router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
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
}
