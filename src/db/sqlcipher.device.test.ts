import { execSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";

/**
 * These two checks are opposite states of the same manual protocol, run at
 * different points by hand — see the "Manual device verification" section
 * in README.md for the full step-by-step reviewer instructions.
 */

const BUNDLE_ID = "com.bbl.bookmarks";
const DB_FILENAME = "bbl-bookmarks.sqlite";
const SQLITE_PLAINTEXT_MAGIC = "SQLite format 3\0";

function getDbPath(): string {
  let container: string;
  try {
    container = execSync(`xcrun simctl get_app_container booted ${BUNDLE_ID} data`, {
      encoding: "utf8",
    }).trim();
  } catch {
    throw new Error("No booted simulator with the app installed was found.");
  }
  return path.join(container, "Library", DB_FILENAME);
}

describe("SQLCipher database file on disk (requires a booted simulator)", () => {
  it("while logged in with data, the database file exists and is not plaintext SQLite", () => {
    const dbPath = getDbPath();
    if (!fs.existsSync(dbPath)) {
      throw new Error(
        `No database file at ${dbPath} — log in and add a bookmark, then re-run this check.`,
      );
    }
    const header = fs.readFileSync(dbPath).subarray(0, 16).toString("utf8");
    expect(header).not.toBe(SQLITE_PLAINTEXT_MAGIC);
  });

  it("after logout, the database file no longer exists", () => {
    const dbPath = getDbPath();
    expect(fs.existsSync(dbPath)).toBe(false);
  });
});
