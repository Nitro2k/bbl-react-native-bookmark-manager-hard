## AUTH DESIGN

- Each user should not see each other data
- when user A logout, app will clean data in SQList and no token in secure store and user B login, user B should not see user A data
- and i just read information on google about PKCE with S256 work with create and send code_challenge to server to prove app identity that 'https://dev-yg.us.auth0.com/.well-known/openid-configuration' in json format said it support S256 method and respone type that support ['code'], PKCE help us protect our app from fake app that try to get our token.

- IETF Best Practice for OAuth in Native Apps:
  Cited: RFC 8252 - OAuth 2.0 for Native Apps (https://datatracker.ietf.org/doc/html/rfc8252), i see best practice to say that login page should occur on real browser safari on ios, not web-view in app, because when user typing id and password, it likely log in app internal log that risk to be expose or stolen.

- (optional) did not do it yet, i am thinking from question (3.3 An under-specified requirement)('People should be able to read their bookmarks on the plane. And they shouldn't stay logged in forever.'). i think we should not logged in forever with offline mode, for example: if my phone get stolen and keep offline, that mean my data will expose!, maybe set expire period like 7 day or a month... just decide, and it will force logout that will completely remove user data (token included) for security purpose. after thinking about this question, i see that one of my expense app has none of this feature, look like always-offline mode is not good for security.
