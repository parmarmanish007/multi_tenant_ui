# Sass System — Multi-tenant Task Management (Frontend)

Lightweight React frontend for a multi-tenant task & project management system built for the Sass System project.

## Key features
- Role-based UI:
  - Admin: manage Companies, Projects and Users (create/edit).
  - Member: create Tasks and view/manage tasks assigned to them.
- JWT authentication stored in localStorage.
- Automatic logout + redirect to login when the JWT expires (API 401 handling).
- Pages: Login, Dashboard, Company, Projects, Users, Tasks.
- Project → Tasks linking: `/tasks?projectId=<id>` filters tasks by project.
- Simple form-driven UI (suitable to migrate to styled components / SASS).

## Local storage keys
- `token` — JWT access token
- `role` — user role (`Admin` or `Member`)
- `userid` — logged-in user id

The frontend relies on the backend to include `user.id` and `user.role` in the token response:

Example POST /api/token/ response:
```
{
  "access": "<jwt token>",
  "user": {
    "id": 42,
    "role": "Member",
    ...
  }
}
```

## Environment (.env)
Create a `.env` file at project root (Windows path: m:\Compny Project\Technotha\multi_tenant_ui\sass-system\.env).

Minimum recommended contents:
```
# API base url used by src/api/api.js
REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api/

# optional routes (used for reference)
REACT_APP_LOGIN_PATH=/
REACT_APP_DASHBOARD_PATH=/dashboard

# dev server port (optional)
PORT=3000
```

If you want the app to read env variables, replace the hardcoded baseURL in `src/api/api.js` with `process.env.REACT_APP_API_BASE_URL` and restart the dev server.

## Quick start (Windows)
1. Open project in VS Code.
2. Install dependencies:
   - npm install
3. Start dev server:
   - npm start
4. Open http://localhost:3000 in the browser.

Restart the dev server after editing `.env`.

## API expectations (adjust if your backend differs)
- POST `api/token/` — get token + user object
- CRUD for `api/tasks/`, `api/projects/`, `api/users/`, `api/company/`
- All endpoints protected by JWT; frontend attaches `Authorization: Bearer <token>` automatically.

## Token expiry handling
- `src/api/api.js` includes a response interceptor.
- On 401 responses the interceptor:
  - clears `token`, `role`, `userid` from localStorage
  - shows an alert (best-effort)
  - redirects to the login page (`/`)
- This forces the user to re-login when the token has expired.

## Routing (frontend)
- `/` — Login
- `/dashboard` — Dashboard (shows Admin or Member sections based on `role`)
- `/company` — Admin only
- `/projects` — Admin only (create project, includes description and call fields)
- `/users` — Admin only (create users and assign company/role)
- `/tasks` — Member (create tasks) — Admin can also view tasks depending on role checks

Routes are protected via a RequireRole wrapper that checks `localStorage.role`.

## How role-based views behave
- Member: sees the Task creation form and only tasks assigned to `localStorage.userid`.
- Admin: can create Projects and Users. Projects link to `/tasks?projectId=<id>` to view project tasks.

## Development tips
- If routes or role-based UI don't update after login, ensure `localStorage.role` is correctly set and that the app is not cached.
- To allow Admin to create tasks or change role logic, update `src/pages/Tasks.js` role checks.
- Consider extracting styles from page JS into SASS files for better maintainability.

## Build & production
- `npm run build` — create production build (deploy build folder to static host).
- Make sure to set production API base URL in environment used during build.

## Troubleshooting
- API 401 immediately after login: verify the token from backend and that `localStorage.token` is present; inspect network requests to ensure Authorization header is set.
- If env changes are not picked up: stop and restart the dev server.
- Console errors: open browser devtools and check network + console for error payloads from backend.

## Next improvements (suggestions)
- Add logout button that clears localStorage and navigates to login.
- Improve UI with SASS variables and responsive layout.
- Add form validation and better error messages from backend responses.
- Add refresh token flow if backend supports refresh tokens.

If you want, I can:
- update `src/api/api.js` to use `REACT_APP_API_BASE_URL` and show the exact patch;
- add a persistent logout button in the Navbar;
- scaffold SASS files and move inline styles to SASS.
