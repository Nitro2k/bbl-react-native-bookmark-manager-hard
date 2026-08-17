## AUTH DESIGN

- Each user should not see each other data
- when user A logout, app will clean data in SQList and no token in secure store and user B login, user B should not see user A data
- and i just read information on google about PKCE with S256 work with create and send code_challenge to server to prove app identity that 'https://dev-yg.us.auth0.com/.well-known/openid-configuration' in json format said it support S256 method and respone type that support ['code'], PKCE help us protect our app from fake app that try to get our token.

- IETF Best Practice for OAuth in Native Apps:
  Cited: RFC 8252 - OAuth 2.0 for Native Apps (https://datatracker.ietf.org/doc/html/rfc8252), i see best practice to say that login page should occur on real browser safari on ios, not web-view in app, because when user typing id and password, it likely log in app internal log that risk to be expose or stolen.

- Decide which token your app treats as the credential for remote calls.: "Access Token" as it use to pass as a Bearer token to api.

- (optional) did not do it yet, i am thinking from question (3.3 An under-specified requirement)('People should be able to read their bookmarks on the plane. And they shouldn't stay logged in forever.'). i think we should not logged in forever with offline mode, for example: if my phone get stolen and keep offline, that mean my data will expose!, maybe set expire period like 7 day or a month... just decide, and it will force logout that will completely remove user data (token included) for security purpose. after thinking about this question, i see that one of my expense app has none of this feature, look like always-offline mode is not good for security.

## The life of a credential (written by Claude Code)

- **Obtained**: Auth0 hosted login page, in a real system browser (ephemeral `ASWebAuthenticationSession`, not a WebView), via PKCE code exchange after login.
- **Where tokens live**: access/refresh/id tokens, plus the SQLite encryption key, all live in `expo-secure-store` — backed by Apple Keychain (`WHEN_UNLOCKED_THIS_DEVICE_ONLY`, so no iCloud sync and unreadable before first unlock). This is specifically to keep credentials out of reach of a root/jailbroken user's raw filesystem access — Keychain items are protected by the OS's own secure hardware, not just app-level file permissions.
- **Where bookmark data lives**: the local SQLite database, encrypted with SQLCipher using a random key generated fresh on every login and stored in the same Keychain-backed store. So even a root/jailbroken user with full filesystem access gets ciphertext, not readable bookmarks — verified directly, not assumed: the raw file's header is confirmed to not be plaintext SQLite, and a normal SQLite tool can't open it at all.
- **Logout removes**: every SecureStore key (all tokens + the DB encryption key) and the SQLite file itself (deleted, not just emptied) — triggered identically whether logout is manual, caused by a rejected refresh, or the 7-day session cap.

## Where the agent's first attempt was wrong

1. A real TypeScript error (`Cannot find module ... '@/global.css'`) got dismissed as a known IDE-diagnostic-lag quirk without checking — it wasn't stale, nothing in the dependency chain actually declared `.css` as an importable module. Only caught because the user pushed back and asked for it to be re-checked.
2. NativeWind (v5 preview) broke screen rendering in a way the agent couldn't see for itself — only the user, looking at the simulator, could tell the UI was actually broken (elements missing, wrong sizing). Once shown, the agent diagnosed it down to NativeWind specifically and fixed it by removing NativeWind entirely rather than debugging the preview library further. Not the most elegant possible fix, but the time-efficient one given how much time had already gone into a prerelease-only bug.
