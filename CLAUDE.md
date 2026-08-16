@AGENTS.md

- This app is bookmark manager I will name it 'BBL bookmark manager'
- read each line and i am open the discuss if you disagree
- we are building app that we are focus on security/privacy first and also offline first app

## Core stack

- Reac native with Typescript
- Expo (run with Development build), do not use features that only work in Expo Go because Expo maybe did not support custom url scheme or deep link (you can discuss if you disagree with me)
- Use navigation with React Navagation (No Expo router), we don't want automatic route by Expo but want to custom by ourself in code

## Security & Storage Rules (critical) (with zero-trust that always test)

- do not use 'AsyncStorage' of 'MMKV' for sensitive data or tokens. (open to disscuss, if disagree)
- use 'expo-secure-store' for Auth tokens. (open to disscuss, if disagree)
- use local SQL persistence like 'sqlite' for bookmarks and collections. ((open to disscuss, if disagree))
- when we logout, all user's data and credential or token will be wipeout like new one , it all completely remove, like install new app,
- do not trust yourself for security topic, we will create test to always verify. for example: if we logout, all data will completely gone? , on the other hand, if we login and add data, is data exist? always test behavior.
- we will try to enforce security so that even user with root permission on android or jailbreak ios cannot access our user data and credential for security purpose and even user with usb wired to computer to backup cannot get our app user data
- consider using 'Jest' but open to discuss if you disagree

## Authentication Rules

- Auth provider: Auth0.
- Flow: Authorization Code flow with PKCE (S256). NO implicit flow.
- Redirect/Logout URI: `com.bbl.bookmarks://oauth/callback`
- use `https://dev-yg.us.auth0.com/userinfo` per session like one time to get profile data.
- should prevent user when logout, user should not go back to logged in route. (should test)

## Verification & Testing (Eval)

- Do not make blind assertions. Any code related to security (login, logout, data wiping) MUST have corresponding Jest tests.
- When generating code, ensure it is testable.

## Mobile Specifics

- Always use `SafeAreaView`. for ui safety to avoid hardware problem like notch or dynamic island of iphone or status bar
- Handle offline state gracefully (read-only mode for cached SQLite data).
