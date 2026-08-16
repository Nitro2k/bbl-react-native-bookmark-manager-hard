# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Why I use Expo instead of React Native CLI?

I chose Expo (framework) over the React Native CLI by my experience preference, based on experience at my previous company where i and my team init our mobile app with a bare RN CLI, project when maintenance became difficult to maintain,In last year i was assigned task to upgrading the Android SDK API level to meet minimum require of Google play store (not sure it's level 33 or 34...) and keeping native modules linked correctly was too hard,build often reach to error and red screen, and migrating to the New Architecture required significant manual native-side work.
So for this test i pick Expo, I remember that Expo can handles that native module problem, SO i think it good for maintainable

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
