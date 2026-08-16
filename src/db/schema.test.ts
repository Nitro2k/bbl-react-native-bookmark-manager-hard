import { CURRENT_SCHEMA_VERSION, migrationsToRun } from "@/src/db/schema";

describe("migrationsToRun", () => {
  it("returns every migration statement when starting from a fresh (version 0) database", () => {
    const migrationStatements = migrationsToRun(0, CURRENT_SCHEMA_VERSION);
    expect(migrationStatements.length).toBeGreaterThan(0);
    expect(migrationStatements.some((statement) => statement.includes("CREATE TABLE collections"))).toBe(
      true,
    );
    expect(migrationStatements.some((statement) => statement.includes("CREATE TABLE bookmarks"))).toBe(
      true,
    );
  });

  it("returns nothing when already at the current version", () => {
    expect(migrationsToRun(CURRENT_SCHEMA_VERSION, CURRENT_SCHEMA_VERSION)).toEqual([]);
  });

  it("only returns statements for versions after the current one", () => {
    const fromFresh = migrationsToRun(0, CURRENT_SCHEMA_VERSION);
    const fromCurrent = migrationsToRun(CURRENT_SCHEMA_VERSION, CURRENT_SCHEMA_VERSION);
    expect(fromCurrent.length).toBeLessThan(fromFresh.length);
  });
});
