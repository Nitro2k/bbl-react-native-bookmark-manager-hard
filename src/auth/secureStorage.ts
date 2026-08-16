import * as SecureStore from "expo-secure-store";

const KEYCHAIN_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

export const AUTH_STORAGE_KEYS = {
  accessToken: "access_token",
  refreshToken: "refresh_token",
  idToken: "id_token",
  expiresAt: "expires_at",
  sessionStartedAt: "session_started_at",
  userProfile: "user_profile",
  dbEncryptionKey: "db_encryption_key",
} as const;

export async function setSecureItem(key: string, value: string): Promise<void> {
  await SecureStore.setItemAsync(key, value, KEYCHAIN_OPTIONS);
}

export async function getSecureItem(key: string): Promise<string | null> {
  return SecureStore.getItemAsync(key, KEYCHAIN_OPTIONS);
}

export async function deleteAllAuthSecrets(): Promise<void> {
  await Promise.all(
    Object.values(AUTH_STORAGE_KEYS).map((key) => SecureStore.deleteItemAsync(key, KEYCHAIN_OPTIONS)),
  );
}
