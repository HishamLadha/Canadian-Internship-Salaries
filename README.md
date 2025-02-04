# Canadian Internship Salaries

The purpose of this app is to provide a platform where students can view and report internship salaries in Canada. This helps students get a better understanding of the salary landscape in various industries and companies.

## Description

### Frontend

**Tech Stack:**
- Next.js
- React
- TypeScript
- Tailwind
- Shadcn

### Backend

**Tech Stack:**
- FastAPI
- Python
- SQLModel
- PostgreSQL

## Getting Started

To get started with the project, make sure you have `docker` and `docker-compose` installed on your machine.
Then, create a .env file and populate it with the following, replacing the appropriate values:

```bash
POSTGRES_USER=replace_with_your_username
POSTGRES_PASSWORD=replace_with_your_password
POSTGRES_DB=replace_with_your_database_name
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db/${POSTGRES_DB}
```
Then, run the following commands:

```bash
docker-compose up --build
```

To stop running the containers, run the following command:

```bash
docker-compose down
```
Add an optional -v to remove the volumes as well.

```bash
docker-compose down -v
```

