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

In this repo, we only run Expo with a **Development build**, and only on **iOS**, via `npx expo run:ios`. Android has not been tested (no time), so treat it as unsupported for now. (Target: 'Iphone 17 pro')

We use **yarn** as the package manager (locked via `packageManager` in `package.json`) — please don't run `npm install`.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
