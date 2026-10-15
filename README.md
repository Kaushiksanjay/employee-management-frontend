# Employee Management System: Frontend (React + Vite)

Employee listing page that consumes the Spring Boot REST API.

## Features
- Table of employees (ID, name, email, department, designation, status)
- Add and edit employees through a form with required-field and email validation
- Delete with a confirmation dialog
- Server-side pagination (page numbers, Previous/Next, rows per page, "Showing 1–10 of 42")
- Search by name (debounced) and filter by Active / Inactive, applied on the server
- Loading, empty and error states (with retry); API failures never crash the app
- Backend validation errors (e.g. duplicate email, HTTP 409) shown inline on the form

## Setup
Requires Node.js 18+.

```bash
npm install
cp .env.example .env     # already included as .env; edit if needed
npm run dev              # http://localhost:5173
```

Start the Spring Boot backend first (default `http://localhost:8080`).

### Environment variables
| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `/api` | Base URL used by the frontend for API calls |
| `VITE_PROXY_TARGET` | `http://localhost:8080` | Dev-server proxy target for `/api` (avoids CORS) |

For a production build: `npm run build` (output in `dist/`). If the frontend is hosted on a different
origin from the API, set `VITE_API_BASE_URL` to the full URL (e.g. `https://api.example.com/api`)
and enable CORS in Spring Boot.

## Expected API contract
| Method | Endpoint | Notes |
| --- | --- | --- |
| GET | `/api/employees?page=0&size=10&search=&status=` | Spring `Page` JSON (`content`, `totalElements`, `totalPages`); see `docs/backend-pagination.md` |
| GET | `/api/employees/{id}` | Single employee |
| POST | `/api/employees` | Body: `fullName, email, department, designation, status` |
| PUT | `/api/employees/{id}` | Same body |
| DELETE | `/api/employees/{id}` | 204 No Content |

JSON fields: `id, fullName, email, department, designation, status` (`"ACTIVE"` / `"INACTIVE"`).
Errors: `{ "message": "...", "errors": { "email": "..." } }` (both keys optional).

**If your backend uses different field names or status values**, change only:
- `src/api/employeeApi.js` (`fromApi` / `toApi`)
- `src/utils/constants.js` (`STATUS`)

## Structure
```
src/
  api/         httpClient.js (axios instance, error handling), employeeApi.js (endpoints + mapping)
  hooks/       useEmployees.js (list state + mutations), useDebounce.js
  components/  EmployeeTable, EmployeeForm, FormField, Modal, ConfirmDialog,
               SearchBar, StatusFilter, StatusBadge, StateMessages, Toast
  utils/       constants.js, validation.js
  styles/      index.css
  App.jsx      page composition
```
UI components never call the API directly; all API logic lives in `src/api` and `useEmployees`.

## Known limitations
- No column sorting (the backend sorts by ID).
