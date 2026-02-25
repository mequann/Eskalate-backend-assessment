## Bonus: ReadLog Deduplication

To prevent users from generating excessive ReadLog entries (e.g., 100 reads in 10 seconds), this project uses Redis for deduplication:

- Before logging a read, the system checks Redis for a key like `read:{userId}:{articleId}` (or `read:{ip}:{articleId}` for guests).
- If the key exists (recent read), the log is skipped.
- If not, the read is logged and the key is set with a short expiry (default: 60 seconds).
- This prevents duplicate reads from the same user/IP within the window, ensuring accurate analytics and performance.

You can adjust the deduplication window in `src/services/readTracking.service.ts` by changing `RATE_LIMIT_WINDOW`.

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
6. Start the development server (with auto-reload):
   ```bash
   cd backend
   npm run dev
   ```
7. Build the project (compile TypeScript to JavaScript):
   ```bash
   cd backend
   npm run build
   ```
8. Start the production server (after building):
   ```bash
   cd backend
   npm start
   ```

## Running, Building, and Testing

All commands below must be run from the `/backend` directory, as all code and tests reside there.

### Development server (auto-reload):

```bash
cd backend
npm run dev
```

### Build the project:

```bash
cd backend
npm run build
```

### Start the production server:

> **Important:** You must run `npm run build` before `npm start` to generate the `dist/app.js` file. If you see a `MODULE_NOT_FOUND` error for `dist/app.js`, it means the build step was skipped.

```bash
cd backend
npm run build
npm start
```

### Run all tests:

```bash
cd backend
npm test
```

### Test Structure

All test files are in `backend/tests/`:

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
Error: Cannot find module 'dist/app.js'
```

Run:

```
npm run build
```

Then try `npm start` again.

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

- `backend/src/` - Main codebase
- `backend/prisma/` - Prisma schema
- `backend/tests/` - Unit tests

## Commit & Submission

- Commit frequently with descriptive messages.
- Push to a public GitHub repo.
- Submit the repo link via Google Form.

# Eskalate-backend-assessment
