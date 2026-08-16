## Plan build react native mobile app

- This app is bookmark manager I will name it 'BBL bookmark manager'
- we are building app that we are focus on security/privacy first and also offline first app , private read-later app. A signed-in person
  saves links, organises them into collections, and reads them on their phone whether or not they have signal.
  - authen with AUTH0 TENANT and store everything else on device

# main

- bundle identifier and Android applicationId must be exactly 'com.bbl.bookmarks', Auth0 callback allow-list is an exact match, so an app with a different identifier cannot complete a login.
- (open to discuss, you can read and suggest shape) , Two resources, collections and bookmarks, each supporting: view one, list, create, update, delete, and
  filtering. Plus a profile screen showing the currently signed-in person. with Collection (resource) as fields (id , name , ownerId , createdAt , updatedAt), and Bookmark (resource) as fields (id , url , title , notes? , collectionId? , ownerId , createdAt , updatedAt)
- A bookmark belongs to a collection (nullable — a bookmark can be uncategorised), and both belong
  to a person. Listing a collection's bookmarks is a required view.

- On-device SQL persistence. SQLite, (prefer Expo-sqlite , but open to discuss if you see any more fit) — justify the choice. Not
  AsyncStorage-as-a-database, not an in-memory array that dies with the process.

- Schema migrations. The app must survive being upgraded over an install that already holds data. (Open to dicuss, but i prefer to add key 'v' or 'version' so we can migrate scheme safety by checking version first!)

# Authentication

- OIDC authentication against the Auth0 tenant below.
- Discovery Endpoint : 'https://dev-yg.us.auth0.com/.well-known/openid-configuration'
- Client ID: 'pSy06qYaqa5WT6sAgN537lFlWMC2d0uN'
- Bundle ID / applicationId: 'com.bbl.bookmarks'
- Redirect URI: 'com.bbl.bookmarks://oauth/callback'
- Logout URI: 'com.bbl.bookmarks://oauth/callback'
- Scope: openid profile email offline_access
- API Audience (available): 'https://bbl-candidate-test-api'

# optional (can do later)

- Biometric gate — Face ID / fingerprint on resume.
- An "everything" screen — collections shown together with the bookmarks inside them, rather than two
  lists.
- Full-text search — across bookmark titles and notes.
- CI — a pipeline that type-checks, lints and tests on every push. A build artifact is a bonus on top ofthat.

## Testing

- For manual testing and automated E2E tests, use the provided test accounts: candidate@test.com and candidate2@test.com. Ensure the test instructions in the README reflect this.should test with two users, because we can know that each user should not access to another user data
- 1st Test users: username: 'candidate@test.com' password: '@password1234'
- 2nd Test users: username: 'candidate2@test.com' password: '@password5678'
- Note: If we use react-native-auth0 or react-native-app-auth , the redirect URI those SDKs derive from the bundle
  identifier is registered too — check the tenant's error message before assuming a URI is unregistered.
