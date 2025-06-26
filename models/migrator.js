import database from "infra/database";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";

const defaultMigrationOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  log: () => {},
  migrationsTable: "pgmigrations",
};

async function runMigration(options) {
  const pendingMigrations = await migrationRunner(options);
  return pendingMigrations;
}

async function listMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const pendingMigrations = await runMigration({
      ...defaultMigrationOptions,
      dbClient,
    });
    return pendingMigrations;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await runMigration({
      ...defaultMigrationOptions,
      dbClient,
      dryRun: false,
    });

    return migratedMigrations;
  } finally {
    await dbClient?.end();
  }
}

export const migrator = {
  listMigrations,
  runPendingMigrations,
};
