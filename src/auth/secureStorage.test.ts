import * as SecureStore from "expo-secure-store";

import { AUTH_STORAGE_KEYS, deleteAllAuthSecrets } from "@/src/auth/secureStorage";

jest.mock("expo-secure-store", () => ({
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 6,
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe("deleteAllAuthSecrets", () => {
  it("deletes every key listed in AUTH_STORAGE_KEYS, not just some of them", async () => {
    await deleteAllAuthSecrets();

    const deletedKeys = (SecureStore.deleteItemAsync as jest.Mock).mock.calls.map((call) => call[0]);

    expect(deletedKeys.sort()).toEqual(Object.values(AUTH_STORAGE_KEYS).sort());
  });
});
