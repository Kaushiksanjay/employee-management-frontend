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

## Architecture file and Postman Evidence
both file are inside `employee-management-backend/Employee Management System Architecture (1)` and `employee-management-backend/Postman Evidence` 

## 1. Create database
Run `database/schema.sql` in MySQL.
schema file attached in `employee-management-backend/src/main/resources/schema.sql`.
configuration of schema.sql in MySQL is given below


## 2. Configure and run the backend

The backend reads its settings from environment variables, with defaults in
`employee-management-backend/src/main/resources/application.properties`.

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

Create `employee-management-backend/.env` (next to `pom.xml`) from the template:

```bash
cd employee-management-backend
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

From `employee-management-backend/`:
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

Create `employee-management-frontend/.env` (next to `package.json`) from the template:

```bash
cd employee-management-fronted
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

From `employee-management-frontend/`:
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

# MySQL Schema Configuration Guide

This guide explains how to import and configure the `schema.sql` file using **MySQL Command Prompt (CMD)** and **MySQL Workbench**.

## Prerequisites

- MySQL Server installed and running.
- MySQL Command Line Client or CMD access.
- MySQL Workbench installed (optional).
- The `schema.sql` file available locally or cloned from this repository.

## 1. Configure `schema.sql` Using CMD

### Step 1: Open Command Prompt

Open Windows CMD and navigate to the folder containing your `schema.sql` file.

```cmd
cd C:\path\to\your\project
```

Replace the path with your actual project directory.

### Step 2: Log in to MySQL

```cmd
mysql -u root -p
```

Enter your MySQL root password when prompted.

### Step 3: Create a Database

Create a database to store the schema.

```sql
CREATE DATABASE employee_management;
```

Select the database:

```sql
USE employee_management;
```

If the database already exists, skip the `CREATE DATABASE` command.

### Step 4: Import the Schema

Exit the MySQL prompt:

```sql
EXIT;
```

Execute the following command in CMD:

```cmd
mysql -u root -p employee_management < schema.sql
```

If `schema.sql` is located in a different directory, provide its full path:

```cmd
mysql -u root -p employee_management < "C:\path\to\your\project\schema.sql"
```

Enter the MySQL password when prompted.

**Note:** If the script already contains `CREATE DATABASE` and `USE` statements, review the file before importing it. You may need to remove the database name from the command or adjust the script to avoid conflicts.

### Step 5: Verify the Imported Schema

Log in to MySQL:

```cmd
mysql -u root -p
```

Run:

```sql
USE employee_management;
SHOW TABLES;
```

To inspect a table structure:

```sql
DESCRIBE employees;
```

Replace `employees` with the actual table name in your schema.

## 2. Configure `schema.sql` Using MySQL Workbench

### Step 1: Open MySQL Workbench

Launch MySQL Workbench and connect to your local MySQL Server instance.

### Step 2: Open the SQL File

1. Select **File → Open SQL Script**.
2. Browse to your project's `schema.sql` file.
3. Open the file in the SQL Editor.

### Step 3: Create and Select the Database

If your schema does not create a database automatically, execute:

```sql
CREATE DATABASE employee_management;
USE employee_management;
```

Select these statements and click the lightning bolt icon to execute them.

Alternatively, create the database through the **Schemas** panel.

### Step 4: Execute the Schema

1. Ensure the correct database is selected.
2. Review the SQL statements in `schema.sql`.
3. Click the lightning bolt icon to execute the script.
4. Check the **Action Output** panel for errors.

If the script includes its own `CREATE DATABASE` and `USE` statements, verify that they reference the intended database.

### Step 5: Verify the Tables

Refresh the **Schemas** panel.

Expand:

`employee_management → Tables`

You should see the tables created by the script.

You can also verify them by executing:

```sql
USE employee_management;
SHOW TABLES;
```

## 3. Troubleshooting

| Error | Solution |
|---|---|
| `mysql is not recognized` | Add the MySQL Server `bin` directory to your Windows PATH, or run the command from that directory. |
| `Access denied for user 'root'` | Verify your MySQL username and password. |
| `Unknown database` | Create the database or correct the database name. |
| `No such file or directory` | Verify the `schema.sql` path and filename. |
| `Table already exists` | Check whether the schema has already been imported. |
| SQL syntax error | Review the indicated line in `schema.sql` and check compatibility with your MySQL version. |

## 4. Important Notes

- Importing `schema.sql` creates the database objects defined in the script, such as tables, indexes, constraints, and relationships.
- The script creates only the objects and data explicitly defined in it.
- Do not commit passwords, database credentials, or other secrets to Git.
- Review destructive statements such as `DROP DATABASE` or `DROP TABLE` before execution.
- If the project uses Spring Boot, ensure the database name and connection settings in `application.properties` match the database configured here.

## 5. Example Project Structure

```text
employee-management-backend/
    ├── README.md
    └── src/
        └── main/
            └── resources/
                ├── application.properties
                └── schema.sql