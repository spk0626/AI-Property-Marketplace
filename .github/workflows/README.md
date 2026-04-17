# GitHub Actions Pipeline

This folder contains a two-stage CI/CD setup.

## Workflows

- `ci.yml`
  - Trigger: push to `main`/`develop`, pull requests to `main`
  - Runs in parallel:
    - Client: install, lint, unit tests, build
    - Server: install, lint check, unit tests, build

- `cd.yml`
  - Trigger: after CI completes successfully on `main`
  - Rebuilds client and server for reproducibility
  - Uploads build artifacts (`client/.next`, `server/dist`)
  - Optionally triggers deployment webhook if `DEPLOY_WEBHOOK_URL` secret is set

## Required/Optional Secrets

- Optional: `DEPLOY_WEBHOOK_URL`
  - If set, CD will send a POST request after successful build.
  - If not set, deployment step is skipped and artifacts are still uploaded.

## Notes

- Keep test commands deterministic and non-interactive.
- Avoid mutating lint scripts in CI (`lint:check` is used on server).
- Add more unit tests under:
  - `client/src/**/*.test.tsx`
  - `server/src/**/*.spec.ts`
