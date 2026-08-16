# Welcome to BBL bookmark manager Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

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

## Platform support (important)

In this repo, we only run Expo with a **Development build**, and only on **iOS**, via `npx expo run:ios`. Android has not been tested (no time), so treat it as unsupported for now. (Target: 'Iphone 17 pro' ios26.5)

We use **yarn** as the package manager (locked via `packageManager` in `package.json`) — please don't run `npm install`.

## Testing

_(This "Testing" section was written by Claude Code, per AI_WORKFLOW.md.)_

### Test accounts

Manual testing and the E2E flow use two real Auth0 accounts against the live tenant, so cross-user data isolation can be checked directly (log in as one, add a bookmark, log out, log in as the other, confirm it's not visible):

- `candidate@test.com` / `@password1234`
- `candidate2@test.com` / `@password5678`

### Automated unit/integration tests

```bash
yarn test
```

Runs the hermetic Jest suite — no simulator or device needed, safe to run right after `yarn install` on a clean checkout. Covers the security-critical paths CLAUDE.md requires tests for: schema migrations (`src/db/schema.test.ts`), the SecureStore wipe-on-logout (`src/auth/secureStorage.test.ts`), and session-expiry / forced-logout / revoke-failure resilience (`src/auth/AuthContext.test.tsx`).

### Manual device verification (SQLCipher encryption + wipe-on-logout)

```bash
yarn test:device
```

This is a separate, deliberately-manual test lane — it inspects the actual database file on a **booted iOS Simulator**, which `yarn test` can't do (Jest itself never runs real native SQLCipher code). It's not run automatically; you drive it in two steps, at two different points in the app's state:

1. Build and run the app (`npx expo run:ios`), log in with a test account, add a bookmark, then run `yarn test:device`. The "logged in" check should pass, confirming the on-disk database file exists and its contents are not readable as plaintext SQLite (i.e. SQLCipher encryption is genuinely active) — the "logged out" check is expected to fail at this point, since you're still logged in.
2. Tap "Log out" in the app, then run `yarn test:device` again. Now the "logged out" check should pass instead, confirming the database file was actually deleted, not just left behind encrypted.

## Platform specific

- I know that styling like shadowoffset or shadow style is only work in ios and android use another style like elevation, and also use style of keyboardavoidingview that set differently on ios and android

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
