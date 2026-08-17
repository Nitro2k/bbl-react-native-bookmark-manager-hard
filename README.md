# Welcome to BBL bookmark manager Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

Prerequisites: Node, Yarn, Xcode with an iOS Simulator (this repo is iOS-only — see below). No Android setup needed.

1. Install dependencies

   ```bash
   yarn install
   ```

2. Generate the native iOS project

   `ios/` is gitignored (generated, not committed), so it won't exist on a fresh clone. Generate it with:

   ```bash
   npx expo prebuild --clean --platform ios
   ```

   Re-run this (with `--clean`, so it fully regenerates rather than patching in place) any time `app.json` changes (bundle id, scheme, plugins) or a new native dependency is added — `npx expo run:ios` alone won't pick those up on an already-generated `ios/` folder.

3. Run the app (Development build, iOS only)

   ```bash
   npx expo run:ios
   ```

   This builds and boots the app on the simulator, and starts the Metro bundler. On first launch you'll land on the Login screen — log in with one of the [test accounts](#test-accounts) below to see the actual app (bookmarks/collections/profile are only reachable once signed in).

## Platform support (important)

In this repo, we only run Expo with a **Development build**, and only on **iOS**, via `npx expo run:ios`. Android has not been tested (no time), so treat it as unsupported for now. (Target: 'Iphone 17 pro' ios26.5)

We use **yarn** as the package manager (locked via `packageManager` in `package.json`) — please don't run `npm install`.

## Testing

_(This "Testing" section was written by Claude Code, per AI_WORKFLOW.md.)_

### Test accounts

Manual testing uses two real Auth0 accounts against the live tenant, so cross-user data isolation can be checked directly (log in as one, add a bookmark, log out, log in as the other, confirm it's not visible):

- `candidate@test.com` / `@password1234`
- `candidate2@test.com` / `@password5678`

### Automated unit/integration tests

```bash
yarn test
```

Runs the hermetic Jest suite — no simulator or device needed, safe to run right after `yarn install` on a clean checkout. Covers the security-critical paths CLAUDE.md requires tests for: schema migrations (`src/db/schema.test.ts`), the SecureStore wipe-on-logout (`src/auth/secureStorage.test.ts`), and session-expiry / forced-logout / revoke-failure resilience (`src/auth/AuthContext.test.tsx`).

`npx tsc --noEmit` and `yarn lint` are also expected to pass clean on a clean checkout.

CI (`.github/workflows/ci.yml`) runs all three (`tsc --noEmit`, lint, `yarn test`) on every push/PR — it deliberately does **not** run `yarn test:device` or the E2E flow below, since both need a real booted iOS Simulator that a standard CI runner doesn't have.

### Manual device verification (SQLCipher encryption + wipe-on-logout)

```bash
yarn test:device
```

This is a separate, deliberately-manual test lane — it inspects the actual database file on a **booted iOS Simulator**, which `yarn test` can't do (Jest itself never runs real native SQLCipher code). It's not run automatically; you drive it in two steps, at two different points in the app's state:

1. Build and run the app (`npx expo run:ios`), log in with a test account, add a bookmark, then run `yarn test:device`. The "logged in" check should pass, confirming the on-disk database file exists and its contents are not readable as plaintext SQLite (i.e. SQLCipher encryption is genuinely active) — the "logged out" check is expected to fail at this point, since you're still logged in.
2. Tap "Log out" in the app, then run `yarn test:device` again. Now the "logged out" check should pass instead, confirming the database file was actually deleted, not just left behind encrypted.

### E2E (Maestro) — not finished

The plan was a Maestro flow automating the exact cross-user check described above (login → add bookmark → logout → login as the second account → confirm isolation). Maestro can reach and fill in the real Auth0 login page (its fields are visible and fillable through the system browser sheet), but the flow doesn't return to the app after submitting login, and this wasn't resolved. Verifying that flow currently means doing it by hand with the two test accounts above.

## What we completed vs skipped

**Completed**: Auth0 PKCE login/logout (real system browser via `ASWebAuthenticationSession`, not a WebView), SecureStore-backed token storage, a 7-day session cap with silent refresh, local storage via SQLite (`op-sqlite`) encrypted at rest with SQLCipher, complete wipe on logout (database file deleted + every credential cleared, on manual logout, a rejected refresh, or the session-age cap), bookmarks and collections (create/list/delete, filter bookmarks by collection, copy link to clipboard), a profile screen, React Navigation (no expo-router), and a hermetic Jest suite plus a manual device-verification test for the encryption/wipe claims above.

**Skipped, deliberately**: update/edit for bookmarks and collections (PLAN.md lists this as required; add + delete only was a scope call, not an oversight — so there's no "view one" detail screen either, since nothing to edit). Android (iOS-only throughout). The Maestro E2E flow (see above — attempted, not finished). Everything PLAN.md itself marks optional: biometric gate, an "everything" screen, full-text search.

An EAS build for iOS is in progress separately (not yet resolved either way).

## Platform specific

- I know that styling like shadowoffset or shadow style is only work in ios and android use another style like elevation, and also use style of keyboardavoidingview that set differently on ios and android
