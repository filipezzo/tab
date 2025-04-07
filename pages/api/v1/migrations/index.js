import database from "infra/database";
import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
export default async function migrations(request, response) {
  if (!["GET", "POST"].includes(request.method)) {
    return response.status(405).end();
  }

  const dryRun = request.method === "GET";
  const dbClient = await database.getNewClient();

  const migrations = await migrationRunner({
    databaseUrl: process.env.DATABASE_URL,
    dbClient,
    direction: "up",
    dir: join("infra", "migrations"),
    dryRun,
    verbose: true,
    migrationsTable: "pgmigrations",
  });
  if (request.method === "POST" && migrations.length > 0) {
    await dbClient.end();
    return response.status(201).json(migrations);
  }
  await dbClient.end();
  return response.status(200).json(migrations);
}
