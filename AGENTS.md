# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code — do not trust training-data memory of Expo APIs, several things below were only discovered by reading installed source, not documentation.

For the full spec see [PLAN.md](PLAN.md); for why non-obvious choices were made see [DECISIONS.md](DECISIONS.md); for the credential/threat model see [AUTH_DESIGN.md](AUTH_DESIGN.md).

## Settled, don't re-litigate

Each of these was tried a different way first and changed for a documented reason. Proposing the alternative again re-spends a cycle already paid for — check DECISIONS.md before suggesting a swap:

- **Auth: `expo-auth-session`**, not `react-native-auth0` or `react-native-app-auth` — first-party, avoids a documented Expo-prebuild + New Architecture conflict in the Auth0 SDK.
- **Storage: `@op-engineering/op-sqlite` + SQLCipher**, not `expo-sqlite` — expo-sqlite's SQLCipher support has no confirmed New Architecture compatibility; op-sqlite does, and Expo's own blog recommends it over expo-sqlite for production.
- **Styling: plain `StyleSheet`**, not NativeWind — v5 preview had a real, reproduced bug (`View` `className` styles randomly failing to apply or rendering with wrong sizing on this exact stack). Removed entirely; not downgraded to stable v4 (that would mean reconfiguring for Tailwind v3, a different `global.css`, and a Babel preset this project doesn't have).
- **Add + delete only for bookmarks/collections, no edit/update** — an explicit product decision, not an oversight. PLAN.md's "update" requirement is intentionally unmet.

## Module boundaries

- `src/auth/AuthContext.tsx` — the only place session state lives: login, logout, session-expiry/refresh, and the SQLCipher encryption key lifecycle (a fresh random key is generated per login and deleted on every wipe path).
- `src/db/database.ts` — the only place `openDatabase` / `getDatabase` / `deleteDatabase` are called from. Every other `src/db/*.ts` function assumes a database is already open and will throw otherwise.
- `src/screens/*` — one screen per file, `StyleSheet.create`, no shared layout components beyond `src/components/Chip.tsx`.
- `src/navigation/RootNavigator.tsx` — swaps the entire navigator tree (auth stack vs. main tabs) on `isAuthenticated`, rather than resetting/gating routes — this is what makes "can't go back to a logged-in screen after logout" true by construction, not by a workaround.

## Testing

`yarn test` is hermetic (Jest, all native modules mocked, no simulator) — safe in CI, run it after every change. `yarn test:device` needs a booted simulator with a real logged-in session and is a manual, two-step protocol (see README's "Manual device verification") — never wire it into CI or expect it to pass standalone.

## Known unfinished work

Maestro E2E (`login → add bookmark → logout → login as second user → assert isolation`) is unbuilt. The real Auth0 login page is reachable and fillable via Maestro (confirmed: its accessibility tree is visible inside the system browser sheet), but the flow doesn't return to the app after submitting — undiagnosed, paused.

## Recurring gotcha

The IDE's inline TypeScript diagnostics lag by one edit during active editing. Don't trust a diagnostic against code you just changed — run `npx tsc --noEmit` for ground truth before deciding an error is real or stale.
