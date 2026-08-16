import * as Crypto from "expo-crypto";

import { getDatabase } from "@/src/db/database";

export type Bookmark = {
  id: string;
  url: string;
  title: string;
  notes: string | null;
  collectionId: string | null;
  ownerId: string;
  createdAt: number;
  updatedAt: number;
};

export function createBookmark(
  ownerId: string,
  input: { url: string; title: string; notes?: string; collectionId?: string },
): Bookmark {
  const bookmark: Bookmark = {
    id: Crypto.randomUUID(),
    url: input.url,
    title: input.title,
    notes: input.notes ?? null,
    collectionId: input.collectionId ?? null,
    ownerId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  getDatabase().executeSync(
    `INSERT INTO bookmarks (id, url, title, notes, collectionId, ownerId, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      bookmark.id,
      bookmark.url,
      bookmark.title,
      bookmark.notes,
      bookmark.collectionId,
      bookmark.ownerId,
      bookmark.createdAt,
      bookmark.updatedAt,
    ],
  );

  return bookmark;
}

/**
 * Lists a user's bookmarks, optionally filtered by collection.
 * Passing `collectionId: null` filters to uncategorised bookmarks; omitting it lists all.
 */
export function listBookmarks(ownerId: string, collectionId?: string | null): Bookmark[] {
  const db = getDatabase();

  if (collectionId === undefined) {
    const result = db.executeSync(
      "SELECT * FROM bookmarks WHERE ownerId = ? ORDER BY createdAt DESC;",
      [ownerId],
    );
    return result.rows as unknown as Bookmark[];
  }

  if (collectionId === null) {
    const result = db.executeSync(
      "SELECT * FROM bookmarks WHERE ownerId = ? AND collectionId IS NULL ORDER BY createdAt DESC;",
      [ownerId],
    );
    return result.rows as unknown as Bookmark[];
  }

  const result = db.executeSync(
    "SELECT * FROM bookmarks WHERE ownerId = ? AND collectionId = ? ORDER BY createdAt DESC;",
    [ownerId, collectionId],
  );
  return result.rows as unknown as Bookmark[];
}

export function deleteBookmark(ownerId: string, id: string): void {
  getDatabase().executeSync("DELETE FROM bookmarks WHERE id = ? AND ownerId = ?;", [id, ownerId]);
}
