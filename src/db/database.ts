import { isSQLCipher, open, type DB } from "@op-engineering/op-sqlite";

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
  if (!isSQLCipher()) {
    throw new Error("op-sqlite was not built with SQLCipher support (check the op-sqlite config in package.json).");
  }
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

/**
 * Deletes the on-disk database file. Never throws: op-sqlite's `.delete()`
 * throws if the file is already gone, and callers (the logout wipe) must
 * proceed to clear SecureStore regardless of whether this succeeds.
 */
export function deleteDatabase(): void {
  if (!dbInstance) return;
  try {
    dbInstance.delete();
  } catch {
    // Swallow: the caller (the logout wipe) must proceed to clear
    // SecureStore regardless of whether the file delete succeeded.
  } finally {
    dbInstance = null;
  }
}
