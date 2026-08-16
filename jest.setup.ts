jest.mock("@op-engineering/op-sqlite", () => ({
  open: jest.fn(() => ({
    executeSync: jest.fn((query: string) => {
      if (query.includes("PRAGMA user_version")) {
        return { rows: [{ user_version: 0 }], rowsAffected: 0 };
      }
      return { rows: [], rowsAffected: 0 };
    }),
    delete: jest.fn(),
    close: jest.fn(),
  })),
  isSQLCipher: jest.fn(() => true),
}));
