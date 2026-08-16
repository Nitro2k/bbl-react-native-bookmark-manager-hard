import { open, type DB } from "@op-engineering/op-sqlite";

import { CURRENT_SCHEMA_VERSION, migrationsToRun } from "@/src/db/schema";

const DB_NAME = "bbl-bookmarks.sqlite";

let dbInstance: DB | null = null;

function runMigrations(db: DB): void {
  const result = db.executeSync("PRAGMA user_version;");
  const currentVersion = Number(result.rows[0]?.user_version ?? 0);

  const statements = migrationsToRun(currentVersion, CURRENT_SCHEMA_VERSION);
  for (const statement of statements) {
    db.executeSync(statement);
  }
  if (statements.length > 0) {
    db.executeSync(`PRAGMA user_version = ${CURRENT_SCHEMA_VERSION};`);
  }
}

export function openDatabase(encryptionKey: string): DB {
  const db = open({ name: DB_NAME, encryptionKey });
  runMigrations(db);
  dbInstance = db;
  return db;
}

export function getDatabase(): DB {
  if (!dbInstance) {
    throw new Error("Database not open. Call openDatabase() first.");
  }
  return dbInstance;
}

export function isDatabaseOpen(): boolean {
  return dbInstance !== null;
}

export function deleteDatabase(): void {
  if (!dbInstance) return;
  dbInstance.delete();
  dbInstance = null;
}
