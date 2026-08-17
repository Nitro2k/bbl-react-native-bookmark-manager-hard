# Why I use Expo instead of React Native CLI?

- I chose Expo (framework) over the React Native CLI by my experience preference, based on experience at my previous company where i and my team init our mobile app with a bare RN CLI, project when maintenance became difficult to maintain,In last year i was assigned task to upgrading the Android SDK API level to meet minimum require of Google play store (not sure it's level 33 or 34...) and keeping native modules linked correctly was too hard,build often reach to error and red screen, and migrating to the New Architecture required significant manual native-side work.
  So for this test i pick Expo, I remember that Expo can handles that native module problem, SO i think it good for maintainable

# How i use agent

- i use agent (claude-code) with sonnet 5 model with opus 5 as its advisor with command '/advisor' , i use this because i try to reduce token consumtion of opus, and not use fable 5. and in this test, i use claude to read PLAN.md and also claude.md as rule with grill-me skill in plan-mode to read plan and planing step by step and find to gap or missing something or unanswer question. and do step by step with manual approve, i don't want to use auto mode because i am security concern person, i don't want ai agent to run command that i did not approve.

# Altertive to customer scheme callback redirect

- i were told to use custom scheme, but after i research in google, custom scheme has downsize that any app can name same custom scheme, for example like our app and other app can name 'com.bbl.bookmark', and if that happend, that app can also get token or anything that attach in link callback. so another more secure way is to use thing call universal link (for ios) and App links (for android) as it use standard url like 'https://bookmarks.bbl.com/auth/callback', how it work?, it force us to put Cryptographic file like 'apple-app-site-association' on our domain server, for example: bbl.com that will store both TeamID and BundleID together in format like TeamID.BundleID, TeamID is unique id generate by apple when we paid to be apple developer account plan. so with universal link, it will check both team id and bundle id, which team id cannot be identical, it is unique. to prove owner of application. what cost?, it about infrastructure cost, you have to register real domain, set up https server, server server to store 'Cryptographic file' and ofcourse, pay for developer account.

# Drop NativeWind (found and documented by Claude Code)

- The scaffold shipped with `nativewind@5.0.0-preview.4` (a prerelease, not the stable v4 line) already installed, never something explicitly requested in PLAN.md or CLAUDE.md.
- Building real screens with it, `className`-based styles on `View` intermittently failed to apply on this exact stack (Expo SDK 54, RN 0.81, New Architecture) — elements went missing from the layout entirely or rendered with wrong sizing (e.g. a button meant to be ~44px tall rendered ~96px tall spanning the full screen width, while its sibling containers' text disappeared), even though the same JSX with plain `style={{}}` rendered correctly.
- Ruled out before concluding it was NativeWind itself: Metro's transform cache (cleared, no change), and `experiments.reactCompiler` in `app.json` (a scaffold default nobody had chosen; React Compiler's auto-memoization is a known bad interaction with libraries that wrap components at runtime the way NativeWind's `cssInterop` does — disabled it, no change). The decisive test was reverting one screen to inline styles and confirming it rendered correctly again, isolating the bug to NativeWind's `className` handling specifically.
- Considered downgrading to stable NativeWind v4 instead of dropping it, but rejected: this project's Tailwind setup (`@tailwindcss/postcss`, a v4-style `global.css`, no `babel.config.js`, no `tailwind.config.js`) is Tailwind v4-shaped. NativeWind v4 wants Tailwind v3, a `tailwind.config.js`, and a Babel preset — not a drop-in swap, and would trade one set of prerelease-adjacent risk for a different reconfiguration risk on the critical path.
- Decision: remove NativeWind/Tailwind/`react-native-css` entirely, use React Native's built-in `StyleSheet`/inline styles. Nothing in the actual requirements needed NativeWind — it was a scaffold default, not a stated need.

# Bug

- decide to remove nativewind that face unsolvable bug that make ui broken and cannot fix in short time, so back to use just plain stylesheet

# UXUI

- decide to not add edit/update bookmark feature that i dont want to increase complexity and i think is unnessary to update, we can just add new one and delete old one, since normally, link that we want to save/bookmark , we can paste it from browser, so it really hard to be incorrect.
- decide that uncategory collection cannot be delte because it become default collection as bookmark need its collection
- since it is bookmark manager , for good ux, decide to add copy function so user can copy to paste to browser. as some user prefer no default browser.

# Testing decision

- On db with sqlite testing, ai suggest that test case that check sidecar file (suffix with -wal, -shm, -journal) of db should not exist but i think it is waste and no value, i think test case of db should be like when login and add data, db should exist and data be encrypt which is not plain text and when logout, db should does not exist
- try to test thing that security concern
- also since we have very few ui and no business logic condition,i decide to skip ui component automate test and do manual test for now
- decide to not add test e2e like maestro since it keep occur bug like ui is not reflect change when run test, a timing issue T^T
