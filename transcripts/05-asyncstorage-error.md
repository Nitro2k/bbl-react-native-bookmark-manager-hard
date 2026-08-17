# Session transcript — 05-asyncstorage-error

_Source session `ed8a03e3-3631-4cd2-a187-7442bb4ff0c3`. Secrets redacted; tool outputs truncated/summarized for readability. See git history for what was actually changed._

### USER — 2026-08-16T17:54:19.210Z

get error when try to run app with npx expo run:ios , maybe should install asyncStorage? , get this error [React] [Error: [@RNC/AsyncStorage]: NativeModule: AsyncStorage is null., To fix this issue try these steps:

• Uninstall, rebuild and restart the app.

• Run the packager with `--reset-cache` flag.

• If you are using CocoaPods on iOS, run `pod install` in the `ios` directory, then rebuild and re-run the app.

• Make sure your project's `package.json` depends on `@react-native-async-storage/async-storage`, even if you only depend on it indirectly through other dependencies. CLI only autolinks native modules found in your
`package.json`.

• If this happens while testing with Jest, check out how to integrate AsyncStorage here: https://react-native-async-storage.github.io/async-storage/docs/advanced/jest

If none of these fix the issue, please open an issue on the GitHub repository: https://github.com/react-native-async-storage/async-storage/issues
], { [Stack] name: 'Stack' }

---

### ASSISTANT — 2026-08-16T17:54:24.559Z

→ **Bash**: `grep -n "async-storage\|AsyncStorage" package.json ios/Podfile.lock 2>/dev/null; echo "---"; grep -rn "AsyncStorage\|async-storage" --include="*.ts" -`...

---

### ASSISTANT — 2026-08-16T17:54:27.841Z

→ **Bash**: `cat package.json`

---

### ASSISTANT — 2026-08-16T17:54:33.127Z

→ **Bash**: `ls node_modules/@react-native-async-storage 2>/dev/null; echo "---who depends---"; grep -rl "@react-native-async-storage/async-storage" node_modules/*`...

---

### ASSISTANT — 2026-08-16T17:54:37.304Z

→ **Bash**: `grep -rli "async.storage" --exclude-dir=node_modules --exclude-dir=.git . 2>/dev/null`

---

### ASSISTANT — 2026-08-16T17:54:41.971Z

→ **Bash**: `grep -rl "async-storage\|AsyncStorage" node_modules/expo-router/build 2>/dev/null | head -20; echo "---"; grep -rl "async-storage\|AsyncStorage" node_`...

---

### ASSISTANT — 2026-08-16T17:54:45.315Z

→ **Bash**: `grep -n "async-storage" node_modules/expo-router/package.json node_modules/@react-navigation/native/package.json node_modules/@react-navigation/elemen`...

---

### ASSISTANT — 2026-08-16T17:54:51.073Z

→ **Bash**: `grep -n "AsyncStorage\|async-storage" ios/Podfile.lock 2>/dev/null; echo "---xcodebuild error log tail---"; tail -100 .expo/xcodebuild-error.log 2>/de`...

---

### ASSISTANT — 2026-08-16T17:54:56.846Z

→ **Bash**: `find node_modules -iname "*async-storage*" -maxdepth 4 2>/dev/null; echo "---searching all depths for the package dir---"; find node_modules -type d -`...

---

### ASSISTANT — 2026-08-16T17:55:05.889Z

→ **Bash**: `grep -rl "async-storage" node_modules --include="package.json" 2>/dev/null | head -30`

---

### ASSISTANT — 2026-08-16T17:55:11.617Z

→ **Bash**: `grep -rli "async.storage" app-example 2>/dev/null; echo "---app.json---"; cat app.json; echo "---git log for package.json---"; git log --oneline -p --`...

---

### ASSISTANT — 2026-08-16T17:55:26.478Z

→ **Bash**: `grep -n "async-storage" yarn.lock 2>/dev/null; echo "---exit code $?---"; ls -la node_modules/.package-lock.json 2>/dev/null; echo "---checking ios bu`...

---

### ASSISTANT — 2026-08-16T17:55:37.168Z

→ **Bash**: `ls -la .expo/xcodebuild.log .expo/xcodebuild-error.log 2>/dev/null; echo "---dates---"; stat -f "%Sm %N" package.json node_modules 2>/dev/null; stat -`...

---

### ASSISTANT — 2026-08-16T17:59:41.263Z

→ **Bash**: `grep -i "asyncstorage\|async-storage" .expo/xcodebuild.log | head -20; echo "exit: $?"`

---

### ASSISTANT — 2026-08-16T18:00:15.696Z

I'll stop the investigation here per your request.

Quick summary of what I found before stopping: nothing in this repo currently references `AsyncStorage` — not in `package.json`, `yarn.lock`, `node_modules`, or any app code. So installing `@react-native-async-storage/async-storage` isn't the right fix, and per [CLAUDE.md](CLAUDE.md) it shouldn't be used for anything sensitive anyway.

What's more likely going on: there's a stale native build. I found leftover artifacts from a previous build attempt — an old `DerivedData` folder for this app and a 9.5MB `.expo/xcodebuild.log` — that predate the current `node_modules`/`package.json` state. A stale compiled app (or stale Metro cache) can throw exactly this "NativeModule is null" error for a module that used to be linked but no longer is in the current dependency tree.

Let me know if you'd like me to continue digging (e.g., clean DerivedData/Pods and rebuild) whenever you're ready.

---

### USER — 2026-08-16T18:11:38.463Z

ok, continue investigate

---

### ASSISTANT — 2026-08-16T18:11:41.493Z

→ **Bash**: `grep -i "asyncstorage\|async-storage" .expo/xcodebuild.log | head -20; echo "---exit: $?---"`

---

### ASSISTANT — 2026-08-16T18:11:51.838Z

→ **Bash**: `grep -ci "asyncstorage\|async-storage" .expo/xcodebuild.log`

---

### ASSISTANT — 2026-08-16T18:12:01.046Z

→ **Bash**: `grep -n "BUILD FAILED\|BUILD SUCCEEDED\|error:" .expo/xcodebuild.log | tail -40`

---

### ASSISTANT — 2026-08-16T18:12:11.062Z

→ **Bash**: `cat node_modules/expo-router/package.json | python3 -c "import json,sys; d=json.load(sys.stdin); print(json.dumps(d.get('dependencies',{}), indent=2))`...

---

### ASSISTANT — 2026-08-16T18:12:39.317Z

→ **Bash**: `find app-example -type f | head -50`

---

### ASSISTANT — 2026-08-16T18:12:45.493Z

→ **Bash**: `find "${TMPDIR:-/tmp}" -maxdepth 1 -iname "metro-*" -o -iname "haste-map-*" 2>/dev/null | head -20`

---

### ASSISTANT — 2026-08-16T18:14:30.310Z

→ **Bash**: `grep -rl "async-storage" /var/folders/sj/ll7h4f99151c2w6x9yl65mtm0000gn/T/metro-file-map-* /var/folders/sj/ll7h4f99151c2w6x9yl65mtm0000gn/T/metro-cach`...

---

### ASSISTANT — 2026-08-16T18:14:34.035Z

Found it — there's a stale Metro cache on disk that still contains references to `async-storage`, even though nothing in the current project depends on it.

---

### ASSISTANT — 2026-08-16T18:14:34.534Z

→ **Bash**: `strings /var/folders/sj/ll7h4f99151c2w6x9yl65mtm0000gn/T/metro-cache/ed/17535ce9a9095a2375e41aa762e12fd68590a7b42f09079d722057f0e6e7cdf7207eb2 2>/dev/`...

---

### ASSISTANT — 2026-08-16T18:14:59.243Z

Found the root cause. Here's the chain of evidence:

1. **Nothing in the current project uses AsyncStorage** — not in `package.json`, `yarn.lock`, any app code, `expo-router`'s own dependency tree, or `ios/Podfile.lock`/`ios/Pods`. So it's not something you're missing as a dependency now.

2. **The native iOS build already succeeds without it** — `.expo/xcodebuild.log` from the last run shows `BUILD SUCCEEDED` with zero mentions of AsyncStorage, confirming the native side never expected this module to be linked.

3. **The smoking gun**: Metro's on-disk transform cache (`$TMPDIR/metro-cache/...`, project-hash-scoped to this repo) still contains a fully transformed copy of `@react-native-async-storage/async-storage`'s source — meaning at some earlier point this package *was* resolvable in `node_modules`, got bundled by Metro, and cached. It isn't there now, but Metro's cache didn't get invalidated when the package disappeared (a known Metro pitfall when `node_modules` changes aren't fully reflected in the haste map).

**So the sequence was:** package existed once → got removed from `node_modules` (reinstall/lockfile change) → Metro kept serving/referencing the stale cached bundle entry → app's JS tried to call into a native module that was never compiled into this native build → `NativeModule: AsyncStorage is null`.

**Fix (no reinstall needed):** clear Metro's cache and restart, not `yarn add` the package back:

```
npx expo start --clear
# or, if that's not enough:
watchman watch-del-all
rm -rf "$TMPDIR"/metro-* "$TMPDIR"/haste-map-*
npx expo run:ios
```

I did not delete anything yet — want me to go ahead and clear the Metro cache and re-run `expo run:ios` to confirm this resolves it?

---

### USER — 2026-08-16T18:16:16.255Z

Port 8081 is running react-native-test in another window, kill port first

---

### ASSISTANT — 2026-08-16T18:16:19.098Z

→ **Bash**: `lsof -nP -iTCP:8081 -sTCP:LISTEN`

---

### ASSISTANT — 2026-08-16T18:16:23.299Z

That's PID 67314 (a `node` process — the "react-native-test" Metro instance). I'll kill it.

---

### ASSISTANT — 2026-08-16T18:16:23.316Z

→ **Bash**: `kill 67314; sleep 1; lsof -nP -iTCP:8081 -sTCP:LISTEN || echo "port 8081 is free"`

---

### ASSISTANT — 2026-08-16T18:16:27.995Z

Port 8081 is free now. Want me to proceed with clearing the Metro cache and running `npx expo run:ios` for this project?

---
