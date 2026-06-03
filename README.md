# New Project

> ✨ Bootstrapped with Create Snowpack App (CSA).

## Restricted Google authentication

This repository now includes a backend auth service that:

- verifies Google ID tokens server-side
- checks the signed-in email against an allowlist table
- issues app session tokens only for invited/active users
- blocks non-invited or revoked users
- exposes admin endpoints to add/revoke users without redeploying
- writes auth decision logs for auditability

### Start the backend auth service

```bash
npm run start:server
```

Required environment variables:

- `GOOGLE_CLIENT_ID`: OAuth client ID used by Google Sign-In
- `APP_JWT_SECRET`: secret used to sign app session tokens
- `ADMIN_API_KEY`: API key for invite/admin endpoints

Optional environment variables:

- `PORT` (default `3001`)
- `FRONTEND_ORIGIN` (default `http://localhost:8080`)
- `ALLOWLIST_DB_PATH` (default `server/data/soundchat-allowlist.sqlite`)

### Frontend environment variables

- `SNOWPACK_PUBLIC_GOOGLE_CLIENT_ID`: Google client ID for Google Sign-In button
- `SNOWPACK_PUBLIC_API_BASE_URL`: backend URL (default `http://localhost:3001`)

### Admin allowlist endpoints

Use `x-admin-api-key: <ADMIN_API_KEY>`.

- `POST /api/admin/users` body: `{ "email": "person@example.com", "status": "invited" }`
- `GET /api/admin/users`

## Available Scripts

### npm start

Runs the app in the development mode.
Open http://localhost:8080 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### npm test

Launches the test runner in the interactive watch mode.
See the section about running tests for more information.

### npm run build

Builds a static copy of your site to the `build/` folder.
Your app is ready to be deployed!

**For the best production performance:** Add a build bundler plugin like "@snowpack/plugin-webpack" or "@snowpack/plugin-parcel" to your `snowpack.config.json` config file.

### Q: What about Eject?

No eject needed! Snowpack guarantees zero lock-in, and CSA strives for the same.
