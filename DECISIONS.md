# Why I use Expo instead of React Native CLI?

- I chose Expo (framework) over the React Native CLI by my experience preference, based on experience at my previous company where i and my team init our mobile app with a bare RN CLI, project when maintenance became difficult to maintain,In last year i was assigned task to upgrading the Android SDK API level to meet minimum require of Google play store (not sure it's level 33 or 34...) and keeping native modules linked correctly was too hard,build often reach to error and red screen, and migrating to the New Architecture required significant manual native-side work.
  So for this test i pick Expo, I remember that Expo can handles that native module problem, SO i think it good for maintainable

# How i use agent

- i use agent (claude-code) with sonnet 5 model with opus 5 as its advisor with command '/advisor' , i use this because i try to reduce token consumtion of opus, and not use fable 5. and in this test, i use claude to read PLAN.md and also claude.md as rule with grill-me skill in plan-mode to read plan and planing step by step and find to gap or missing something or unanswer question. and do step by step with manual approve, i don't want to use auto mode because i am security concern person, i don't want ai agent to run command that i did not approve.

# Altertive to customer scheme callback redirect

- i were told to use custom scheme, but after i research in google, custom scheme has downsize that any app can name same custom scheme, for example like our app and other app can name 'com.bbl.bookmark', and if that happend, that app can also get token or anything that attach in link callback. so another more secure way is to use thing call universal link (for ios) and App links (for android) as it use standard url like 'https://bookmarks.bbl.com/auth/callback', how it work?, it force us to put Cryptographic file like 'apple-app-site-association' on our domain server, for example: bbl.com that will store both TeamID and BundleID together in format like TeamID.BundleID, TeamID is unique id generate by apple when we paid to be apple developer account plan. so with universal link, it will check both team id and bundle id, which team id cannot be identical, it is unique. to prove owner of application. what cost?, it about infrastructure cost, you have to register real domain, set up https server, server server to store 'Cryptographic file' and ofcourse, pay for developer account.

# Testing decision

- On db with sqlite testing, ai suggest that test case that check sidecar file (suffix with -wal, -shm, -journal) of db should not exist but i think it is waste and no value, i think test case of db should be like when login and add data, db should exist and data be encrypt which is not plain text and when logout, db should does not exist
