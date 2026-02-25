# Eskalate News API Backend

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up your `.env` file (see sample above).
3. Start Redis using Docker:
   ```bash
   docker run --name eskalate-redis -p 6379:6379 -d redis
   ```
   This will run Redis locally on port 6379. Ensure your `.env` contains:
   ```
   REDIS_URL=redis://localhost:6379
   ```
   If you already have Redis running elsewhere, update `REDIS_URL` accordingly.
4. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Generate Prisma client (required before starting dev server):
   ```bash
   npx prisma generate
   ```
6. Start the server:
   ```bash
   npm run dev
   ```

## Running Tests

This project uses Jest and Supertest for API endpoint testing. All test cases are located in the `tests/` directory.

### To run all tests:

```bash
npm test
```

### Test Structure

- **auth.test.ts**: Tests authentication endpoints (signup, login, duplicate email handling).
- **article.test.ts**: Tests article creation, deletion, and authorization.
- **readLog.test.ts**: Tests article read logging and access.

### Notes

- Tests use unique emails for each run to avoid duplicate errors.
- Article tests ensure articles are published for read access.
- All routes are mounted under `/api`.
- Ensure your database and Redis are running before running tests.

## Troubleshooting

If you see the error:

```
Error: @prisma/client did not initialize yet. Please run "prisma generate" and try to import it again.
```

Run:

```
npx prisma generate
```

If you see a TypeScript error about running app.ts directly, make sure your dev script uses ts-node:

```
"dev": "ts-node src/app.ts"
```

If you see Redis connection errors:

```
Error: Redis connection failed
```

Make sure Redis is running (see Setup step 3) and your `.env` has the correct `REDIS_URL`.

If you add new dependencies, run `npm install` again.

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for signing JWTs
- `REFRESH_TOKEN_SECRET`: Secret for refresh tokens

## Tech Choices

- **Express**: Fast, flexible API framework
- **Prisma**: Type-safe ORM for PostgreSQL
- **JWT**: Secure authentication
- **bcrypt**: Password hashing
- **Zod**: Validation
- **Bull**: Job queue for analytics
- **Jest**: Testing

## Folder Structure

- `src/` - Main codebase
- `prisma/` - Prisma schema
- `tests/` - Unit tests

## Commit & Submission

- Commit frequently with descriptive messages.
- Push to a public GitHub repo.
- Submit the repo link via Google Form.

# Eskalate-backend-assessment
