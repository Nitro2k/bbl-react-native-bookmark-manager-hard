export const CURRENT_SCHEMA_VERSION = 1;

const migrations: Record<number, string[]> = {
  1: [
    `CREATE TABLE collections (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      ownerId TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );`,
    `CREATE TABLE bookmarks (
      id TEXT PRIMARY KEY NOT NULL,
      url TEXT NOT NULL,
      title TEXT NOT NULL,
      notes TEXT,
      collectionId TEXT REFERENCES collections(id) ON DELETE SET NULL,
      ownerId TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );`,
    `CREATE INDEX idx_collections_ownerId ON collections(ownerId);`,
    `CREATE INDEX idx_bookmarks_ownerId ON bookmarks(ownerId);`,
    `CREATE INDEX idx_bookmarks_collectionId ON bookmarks(collectionId);`,
  ],
};

export function migrationsToRun(fromVersion: number, toVersion: number): string[] {
  const migrationStatements: string[] = [];
  for (let version = fromVersion + 1; version <= toVersion; version += 1) {
    migrationStatements.push(...(migrations[version] ?? []));
  }
  return migrationStatements;
}
