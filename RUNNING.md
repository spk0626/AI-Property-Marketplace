# How to run this project

This repo has two apps:

- `server/` is the NestJS API on port `5000`
- `client/` is the Next.js frontend on port `3000`

## Prerequisites

- Node.js installed
- Docker installed if you want to run the local PostgreSQL container from `docker-compose.yml`
- The backend environment file at `server/.env` must be present and valid

## Environment

The backend validates these variables at startup:

- `PORT`
- `CLIENT_URL`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `UPSTASH_REDIS_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `GEMINI_API_KEY`

The frontend uses `NEXT_PUBLIC_API_URL` if it is set. If it is not set, it defaults to `http://localhost:5000/api`.

## Start the infrastructure

If you want the local PostgreSQL service from this repo, start it first:

```powershell
docker compose up -d db
```

The compose file also defines Redis, but the backend currently reads `UPSTASH_REDIS_URL` from `server/.env`, so Redis must still be reachable through that value.

## Start the backend

From `server/`:

```powershell
npm run dev
```

The API should come up on `http://localhost:5000` and expose routes under `/api`.

## Start the frontend

From `client/`:

```powershell
npm run dev
```

Open `http://localhost:3000` in your browser.

## Quick run order

1. Start PostgreSQL with `docker compose up -d db` if you need the local database.
2. Start the backend in `server/` with `npm run dev`.
3. Start the frontend in `client/` with `npm run dev`.

## Notes

- The backend health endpoints are available at `/health` and `/metrics`.
- If the backend fails during startup, check `server/.env` first because env validation runs before the app listens.