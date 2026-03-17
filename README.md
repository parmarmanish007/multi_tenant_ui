# Sass System — Multi-tenant Task Management (Frontend)

Short frontend for a multi-tenant task/project management UI built with React.

## Features
- Role-based UI:
  - Admin: manage Companies, Projects, Users.
  - Member: create and manage Tasks (only sees tasks assigned to them).
- JWT auth with token saved to localStorage.
- Automatic re-login when JWT expires (API 401 interceptor clears auth and redirects to login).
- Simple pages: Login, Dashboard, Company, Projects, Users, Tasks.
- Query param support: `/tasks?projectId=...` to filter tasks by project.

## Local storage keys
- token — access token (JWT)
- role — user role (`Admin` or `Member`)
- userid — logged-in user id

## Expected backend endpoints
- POST api/token/ — returns { access, user:{ id, role, ... } }
- GET/POST/PUT/PATCH api/tasks/
- GET/POST/PUT/PATCH api/projects/
- GET/POST/PUT/PATCH api/users/
- GET/POST/PUT/PATCH api/company/

Adjust `src/api/api.js` if your backend uses different paths/field names.

## Setup (Windows)
1. Clone / open project folder in VS Code.
2. Install dependencies:
   - npm install
3. Add `.env` (example below) and restart dev server:
   - npm start

Example `.env` (place at project root):
```
REACT_APP_API_URL=http://localhost:8000
# other env variables...
```

## Running the App
- Development:
  - `npm start` — runs the app in development mode.
- Production build:
  - `npm run build` — builds the app for production.

## Troubleshooting
- If `npm run build` fails to minify, refer to the [Create React App troubleshooting guide](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify).
