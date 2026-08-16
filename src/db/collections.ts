import * as Crypto from "expo-crypto";

import { getDatabase } from "@/src/db/database";

export type Collection = {
  id: string;
  name: string;
  ownerId: string;
  createdAt: number;
  updatedAt: number;
};

export function createCollection(ownerId: string, name: string): Collection {
  const collection: Collection = {
    id: Crypto.randomUUID(),
    name,
    ownerId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  getDatabase().executeSync(
    "INSERT INTO collections (id, name, ownerId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?);",
    [collection.id, collection.name, collection.ownerId, collection.createdAt, collection.updatedAt],
  );

  return collection;
}

export function listCollections(ownerId: string): Collection[] {
  const result = getDatabase().executeSync(
    "SELECT id, name, ownerId, createdAt, updatedAt FROM collections WHERE ownerId = ? ORDER BY createdAt DESC;",
    [ownerId],
  );
  return result.rows as unknown as Collection[];
}

export function deleteCollection(ownerId: string, id: string): void {
  getDatabase().executeSync("DELETE FROM collections WHERE id = ? AND ownerId = ?;", [id, ownerId]);
}
