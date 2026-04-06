# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server with full security hardening.

- Entry: `src/index.ts` — reads/validates `PORT`, starts Express
- App setup: `src/app.ts` — Helmet, CORS (origin whitelist), rate limiting, body size limits, routes at `/api`
- `src/lib/env.ts` — Zod-validated environment config (fails fast at startup if missing required vars)
- `src/middleware/rateLimit.ts` — global (100 req/min) + AI-specific (10 req/min) rate limits
- `src/middleware/errorHandler.ts` — centralized error handler; Zod errors → 400, server errors → 500
- `src/middleware/validate.ts` — reusable `validateBody()` / `validateQuery()` helpers
- Routes:
  - `GET /api/healthz` — health check (excluded from rate limiting)
  - `POST /api/ai/generate` — AI message generation placeholder (requires `AI_API_KEY`)
  - `GET /api/subscription/status` — premium status placeholder
  - `POST /api/subscription/verify` — receipt verification placeholder
- Depends on: `@workspace/db`, `@workspace/api-zod`, `zod`, `helmet`, `express-rate-limit`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle

## Security Architecture

### Secrets and environment variables

Never commit secrets. All secrets go in environment variables only.

Required variables — see `.env.example` for full list:
| Variable | Required | Purpose |
|---|---|---|
| `PORT` | Yes | Server listen port |
| `NODE_ENV` | Yes | `development` / `production` |
| `ALLOWED_ORIGINS` | No | Comma-separated CORS origins (default: `*`) |
| `RATE_LIMIT_WINDOW_MS` | No | Rate limit window in ms (default: 60000) |
| `RATE_LIMIT_MAX` | No | Max requests per window (default: 100) |
| `AI_API_KEY` | No | OpenAI / AI provider key (server-side only) |
| `AI_MODEL` | No | AI model to use (default: gpt-4o-mini) |
| `STRIPE_SECRET_KEY` | No | Stripe secret key (server-side only) |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook signature secret |
| `EXPO_PUBLIC_API_URL` | No | Mobile app's API base URL |

### Client/server boundary

- Mobile app (client) — NEVER contains API keys, secrets, or payment logic
- API server — ALL sensitive operations: AI calls, payment verification, subscription checks
- Future AI feature: client sends request to `/api/ai/generate`, server calls AI provider with its own key
- Future payments: client shows paywall, server verifies receipt via Stripe/RevenueCat

### Production checklist (manual steps)

Before going to production:
1. Set `AI_API_KEY` in Replit Secrets if enabling AI generation
2. Set `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` if enabling payments
3. Set `ALLOWED_ORIGINS` to your production domain(s)
4. Set `NODE_ENV=production`
5. Implement actual AI generation logic in `src/routes/ai.ts`
6. Implement actual receipt verification in `src/routes/subscription.ts`

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `artifacts/svar-direkt` (`@workspace/svar-direkt`)

Expo React Native mobile app — Swedish tenant/landlord response management tool.

- Fully offline-first; all data stored in AsyncStorage
- All message generation is client-side (template-based, no AI calls)
- `constants/config.ts` — central app configuration, reads `EXPO_PUBLIC_API_URL`
- `contexts/AppContext.tsx` — global state: history, favorites, notepad, custom templates
- No API keys or secrets in the client bundle

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.
