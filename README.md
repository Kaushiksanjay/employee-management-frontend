# Employee Management System

Full-stack assessment project: React + Axios frontend, Java 17 + Spring Boot 3 backend, MySQL.

## Features
- List, create, update and delete employees
- Search by employee name
- Filter by Active/Inactive
- Required-field and email validation
- Duplicate email prevention
- Loading, empty and API error states
- Spring layered architecture: Controller, Service, Repository
- SQL setup and assessment queries

## Requirements
- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8+

## 1. Create database
Run `database/schema.sql` in MySQL.

## 2. Configure and run the backend

The backend reads its settings from environment variables, with defaults in
`backend/src/main/resources/application.properties`.

### Backend environment variables

| Variable | Default | Required | Purpose |
| --- | --- | --- | --- |
| `SERVER_PORT` | `8080` | No | Port the API runs on |
| `DB_URL` | `jdbc:mysql://localhost:3306/employee_management?createDatabaseIfNotExist=true` | No | JDBC connection URL |
| `DB_USERNAME` | `root` | No | MySQL user |
| `DB_PASSWORD` | none | **Yes** | MySQL password |
| `JPA_DDL_AUTO` | `update` | No | Hibernate schema mode |
| `JPA_SHOW_SQL` | `true` | No | Log SQL statements |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | No | Allowed frontend origins (comma-separated) |

### Backend `.env` file

Create `backend/.env` (next to `pom.xml`) from the template:

```bash
cd backend
cp .env.example .env
```

Then edit it:

```properties
SERVER_PORT=8080
DB_URL=jdbc:mysql://localhost:3306/employee_management?createDatabaseIfNotExist=true
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
JPA_DDL_AUTO=update
JPA_SHOW_SQL=true
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

- `.env` is git-ignored. Only `.env.example` is committed.
- If `DB_PASSWORD` is missing, startup fails with "Could not resolve placeholder 'DB_PASSWORD'".
- The `.env` file is read from the folder the app starts in. In IntelliJ, set the run
  configuration's Working directory to `backend`.
- You can set the same variables as system environment variables instead of using a file.

### Run the backend

From `backend/`:
```bash
mvn spring-boot:run
```
Backend URL: `http://localhost:8080`

## 3. Configure and run the React frontend

### Frontend environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `/api` | Base URL used by the frontend for API calls |
| `VITE_PROXY_TARGET` | `http://localhost:8080` | Where the Vite dev server forwards `/api` requests (the backend) |

### Frontend `.env` file

Create `frontend/.env` (next to `package.json`) from the template:

```bash
cd frontend
cp .env.example .env
```

```properties
VITE_API_BASE_URL=/api
VITE_PROXY_TARGET=http://localhost:8080
```

- In development, keep `VITE_API_BASE_URL=/api`. The Vite dev server proxies it to the backend, so there are no CORS issues.
- Only variables starting with `VITE_` are available to the app. Do not put secrets here, because the values are visible in the browser.
- Restart `npm run dev` after changing `.env`.
- If you deploy the frontend on a different address from the API, set `VITE_API_BASE_URL` to the full API URL (for example `https://api.example.com/api`) and add that address to the backend's `CORS_ALLOWED_ORIGINS`.

### Run the frontend

From `frontend/`:
```bash
npm install
npm run dev
```
Frontend URL: `http://localhost:5173`

## API endpoints
- `GET /api/employees`
- `GET /api/employees/{id}`
- `POST /api/employees`
- `PUT /api/employees/{id}`
- `DELETE /api/employees/{id}`
