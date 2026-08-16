import * as AuthSession from "expo-auth-session";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AUTH0_AUDIENCE,
  AUTH0_CLIENT_ID,
  AUTH0_ISSUER,
  AUTH0_REDIRECT_URI,
  AUTH0_SCOPES,
  SESSION_MAX_AGE_MS,
} from "@/src/auth/auth0Config";
import { generateRandomHexKey } from "@/src/auth/random";
import { AUTH_STORAGE_KEYS, deleteAllAuthSecrets, getSecureItem, setSecureItem } from "@/src/auth/secureStorage";

export type UserProfile = {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
};

type AuthContextValue = {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function persistTokens(tokens: AuthSession.TokenResponse): Promise<void> {
  const expiresAt = Date.now() + (tokens.expiresIn ?? 0) * 1000;
  await Promise.all([
    setSecureItem(AUTH_STORAGE_KEYS.accessToken, tokens.accessToken),
    setSecureItem(AUTH_STORAGE_KEYS.expiresAt, String(expiresAt)),
    tokens.refreshToken
      ? setSecureItem(AUTH_STORAGE_KEYS.refreshToken, tokens.refreshToken)
      : Promise.resolve(),
    tokens.idToken ? setSecureItem(AUTH_STORAGE_KEYS.idToken, tokens.idToken) : Promise.resolve(),
  ]);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const discovery = AuthSession.useAutoDiscovery(AUTH0_ISSUER);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: AUTH0_CLIENT_ID,
      redirectUri: AUTH0_REDIRECT_URI,
      scopes: AUTH0_SCOPES,
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
      extraParams: { audience: AUTH0_AUDIENCE },
    },
    discovery,
  );

  const wipeSession = useCallback(async () => {
    await deleteAllAuthSecrets();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const completeLogin = useCallback(async (tokens: AuthSession.TokenResponse) => {
    if (!discovery) return;

    await persistTokens(tokens);
    await setSecureItem(AUTH_STORAGE_KEYS.sessionStartedAt, String(Date.now()));

    const dbEncryptionKey = await generateRandomHexKey(32);
    await setSecureItem(AUTH_STORAGE_KEYS.dbEncryptionKey, dbEncryptionKey);

    const profile = (await AuthSession.fetchUserInfoAsync(
      { accessToken: tokens.accessToken },
      discovery,
    )) as UserProfile;
    await setSecureItem(AUTH_STORAGE_KEYS.userProfile, JSON.stringify(profile));

    setUser(profile);
    setIsAuthenticated(true);
  }, [discovery]);

  useEffect(() => {
    if (response?.type !== "success" || !discovery || !request) return;

    AuthSession.exchangeCodeAsync(
      {
        clientId: AUTH0_CLIENT_ID,
        code: response.params.code,
        redirectUri: AUTH0_REDIRECT_URI,
        extraParams: request.codeVerifier ? { code_verifier: request.codeVerifier } : undefined,
      },
      discovery,
    )
      .then(completeLogin)
      .catch(() => wipeSession())
      .finally(() => setIsLoading(false));
  }, [response, discovery, request, completeLogin, wipeSession]);

  useEffect(() => {
    if (!discovery) return;
    const activeDiscovery = discovery;

    async function checkExistingSession() {
      const [expiresAtRaw, sessionStartedAtRaw, refreshToken] = await Promise.all([
        getSecureItem(AUTH_STORAGE_KEYS.expiresAt),
        getSecureItem(AUTH_STORAGE_KEYS.sessionStartedAt),
        getSecureItem(AUTH_STORAGE_KEYS.refreshToken),
      ]);

      if (!expiresAtRaw || !sessionStartedAtRaw || !refreshToken) {
        setIsLoading(false);
        return;
      }

      const sessionAge = Date.now() - Number(sessionStartedAtRaw);
      if (sessionAge > SESSION_MAX_AGE_MS) {
        await wipeSession();
        setIsLoading(false);
        return;
      }

      if (Date.now() < Number(expiresAtRaw)) {
        const cachedProfile = await getSecureItem(AUTH_STORAGE_KEYS.userProfile);
        setUser(cachedProfile ? (JSON.parse(cachedProfile) as UserProfile) : null);
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      try {
        const refreshed = await AuthSession.refreshAsync(
          { clientId: AUTH0_CLIENT_ID, refreshToken },
          activeDiscovery,
        );
        await persistTokens(refreshed);
        const cachedProfile = await getSecureItem(AUTH_STORAGE_KEYS.userProfile);
        setUser(cachedProfile ? (JSON.parse(cachedProfile) as UserProfile) : null);
        setIsAuthenticated(true);
      } catch {
        await wipeSession();
      } finally {
        setIsLoading(false);
      }
    }

    checkExistingSession();
  }, [discovery, wipeSession]);

  const login = useCallback(async () => {
    await promptAsync({ preferEphemeralSession: true });
  }, [promptAsync]);

  const logout = useCallback(async () => {
    if (discovery?.revocationEndpoint) {
      const refreshToken = await getSecureItem(AUTH_STORAGE_KEYS.refreshToken);
      if (refreshToken) {
        try {
          await AuthSession.revokeAsync(
            {
              token: refreshToken,
              clientId: AUTH0_CLIENT_ID,
              tokenTypeHint: AuthSession.TokenTypeHint.RefreshToken,
            },
            discovery,
          );
        } catch {
          // Best-effort: proceed with the local wipe below even if the device
          // is offline or Auth0 rejects the revoke call.
        }
      }
    }
    await wipeSession();
  }, [discovery, wipeSession]);

  const value = useMemo<AuthContextValue>(
    () => ({ isLoading, isAuthenticated, user, login, logout }),
    [isLoading, isAuthenticated, user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
