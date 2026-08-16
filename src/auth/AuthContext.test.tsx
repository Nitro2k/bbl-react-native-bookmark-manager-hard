import { act, renderHook, waitFor } from "@testing-library/react-native";
import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";

import { SESSION_MAX_AGE_MS } from "@/src/auth/auth0Config";
import { AuthProvider, useAuth } from "@/src/auth/AuthContext";
import { AUTH_STORAGE_KEYS } from "@/src/auth/secureStorage";

const mockDiscovery = {
  authorizationEndpoint: "https://dev-yg.us.auth0.com/authorize",
  tokenEndpoint: "https://dev-yg.us.auth0.com/oauth/token",
  revocationEndpoint: "https://dev-yg.us.auth0.com/oauth/revoke",
  userInfoEndpoint: "https://dev-yg.us.auth0.com/userinfo",
};

jest.mock("expo-auth-session", () => ({
  useAutoDiscovery: jest.fn(),
  useAuthRequest: jest.fn(() => [null, null, jest.fn()]),
  exchangeCodeAsync: jest.fn(),
  refreshAsync: jest.fn(),
  revokeAsync: jest.fn(),
  fetchUserInfoAsync: jest.fn(),
  ResponseType: { Code: "code" },
  TokenTypeHint: { RefreshToken: "refresh_token", AccessToken: "access_token" },
}));

jest.mock("expo-secure-store", () => ({
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 6,
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

function mockStoredSession(overrides: Partial<Record<string, string | null>>) {
  const values: Record<string, string | null> = {
    [AUTH_STORAGE_KEYS.expiresAt]: null,
    [AUTH_STORAGE_KEYS.sessionStartedAt]: null,
    [AUTH_STORAGE_KEYS.refreshToken]: null,
    [AUTH_STORAGE_KEYS.dbEncryptionKey]: null,
    [AUTH_STORAGE_KEYS.userProfile]: null,
    ...overrides,
  };
  (SecureStore.getItemAsync as jest.Mock).mockImplementation((key: string) =>
    Promise.resolve(values[key] ?? null),
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  (AuthSession.useAutoDiscovery as jest.Mock).mockReturnValue(mockDiscovery);
});

describe("session expiry and forced logout", () => {
  it("wipes without attempting a refresh once the session is older than the 7-day cap", async () => {
    mockStoredSession({
      [AUTH_STORAGE_KEYS.expiresAt]: String(Date.now() - 1000),
      [AUTH_STORAGE_KEYS.sessionStartedAt]: String(Date.now() - (SESSION_MAX_AGE_MS + 1000)),
      [AUTH_STORAGE_KEYS.refreshToken]: "stale-refresh-token",
      [AUTH_STORAGE_KEYS.dbEncryptionKey]: "some-db-key",
    });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isAuthenticated).toBe(false);
    expect(AuthSession.refreshAsync).not.toHaveBeenCalled();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
      AUTH_STORAGE_KEYS.refreshToken,
      expect.anything(),
    );
  });

  it("forces a wipe when Auth0 rejects the refresh call", async () => {
    mockStoredSession({
      [AUTH_STORAGE_KEYS.expiresAt]: String(Date.now() - 1000),
      [AUTH_STORAGE_KEYS.sessionStartedAt]: String(Date.now() - 1000),
      [AUTH_STORAGE_KEYS.refreshToken]: "expired-refresh-token",
      [AUTH_STORAGE_KEYS.dbEncryptionKey]: "some-db-key",
    });
    (AuthSession.refreshAsync as jest.Mock).mockRejectedValue(new Error("invalid_grant"));

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isAuthenticated).toBe(false);
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
      AUTH_STORAGE_KEYS.refreshToken,
      expect.anything(),
    );
  });
});

describe("logout", () => {
  it("still wipes every SecureStore key even when the Auth0 revoke call fails", async () => {
    mockStoredSession({
      [AUTH_STORAGE_KEYS.refreshToken]: "some-refresh-token",
    });
    (AuthSession.revokeAsync as jest.Mock).mockRejectedValue(new Error("network unreachable"));

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.logout();
    });

    const deletedKeys = (SecureStore.deleteItemAsync as jest.Mock).mock.calls.map((call) => call[0]);
    expect(deletedKeys.sort()).toEqual(Object.values(AUTH_STORAGE_KEYS).sort());
  });
});
