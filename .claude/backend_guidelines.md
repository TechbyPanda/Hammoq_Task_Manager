# Backend Guidelines

Follow these rules for all backend code in this project.

## 0. Before writing any code

- Read the existing module you are changing and follow its patterns before inventing new ones.
- Check `package.json` for the actual versions of Node, Express, the ORM and the validator — don't assume.
- For any new endpoint, write down first: method + path, request shape, response shape, status codes, which tables it touches, and whether it needs a transaction.
- Prefer the smallest change that solves the task. No drive-by refactors in the same PR.

## 1. Stack defaults

- **Node.js:** current Active LTS. ES modules or CommonJS — match the repo, never mix.
- **TypeScript** for new services (`strict: true`). No `any` without a comment explaining why.
- **Express 5** for new services (async errors reach the error handler natively). On Express 4, every async route goes through `asyncHandler`.
- **Validation:** Zod (or the repo's existing Joi/express-validator — don't add a second library).
- **SQL:** PostgreSQL via the repo's ORM/query builder (Prisma, Drizzle, Knex, Sequelize). **MongoDB:** Mongoose.
- **Cache / locks / rate limits:** Redis. **Queues:** SQS (AWS) or BullMQ (Redis).
- **Logging:** structured JSON logger (pino). **Tests:** Vitest or Jest + Supertest.

## 2. Project structure — feature-first, layered

```
src/
├── app.js            # build the Express app: global middleware, routes, error handler
├── server.js         # app.listen + graceful shutdown (kept separate so tests import app)
├── config/           # env parsing (validated at startup), DB, Redis, AWS clients
├── middlewares/      # auth, validate, rateLimit, requestId, errorHandler
├── errors/           # AppError, NotFoundError, ValidationError, ConflictError, ...
├── utils/            # logger, asyncHandler, small pure helpers
├── modules/
│   └── <feature>/
│       ├── <feature>.routes.js
│       ├── <feature>.validator.js
│       ├── <feature>.controller.js
│       ├── <feature>.service.js
│       └── <feature>.repository.js
├── workers/          # queue consumers and scheduled jobs (never inside the API process)
└── routes/v1.js      # mounts module routers under /api/v1
```

### Layer rules

| Layer | Does | Never does |
|---|---|---|
| Route | URL + method → middlewares → controller | Business logic |
| Validator | Input shape (types, format, required, allowed values) | DB calls |
| Controller | Read `req`, call one service method, send `res` with status | SQL, business rules |
| Service | Business rules, transactions, orchestration, publishing events | Touch `req` / `res` |
| Repository | Queries only | Business rules, HTTP |

- Services take plain arguments and return plain data, so APIs, workers, scripts and tests can all reuse them.
- Identity (`userId`, `staffId`, `role`) comes from the verified token (`req.user`), **never** from the request body.

## 3. API design

- REST, plural nouns, nested only one level: `/api/v1/stores/:storeId/walk-ins`.
- Methods: `GET` read · `POST` create · `PATCH` partial update · `PUT` full replace · `DELETE` remove.
- Status codes:
  - `200` OK · `201` created · `202` accepted for background processing · `204` no content
  - `400` invalid input · `401` not authenticated · `403` not allowed · `404` not found · `409` conflict/duplicate · `422` business rule failed (if the team uses it) · `429` rate limited
  - `500` only for unexpected errors
- One error shape everywhere:
  ```json
  { "error": { "code": "VALIDATION_ERROR", "message": "Invalid input", "details": [{ "field": "phone", "message": "..." }] } }
  ```
- Pagination on every list endpoint. Default and **max** `limit` (e.g. 20 / 100). Prefer cursor pagination for large or fast-changing lists.
- `POST` endpoints that create money- or order-related records accept an `Idempotency-Key` header.
- Version with `/api/v1`. Add `/api/v2` only for breaking changes, and only for the endpoints that changed.
- Never return internal fields (password hashes, internal IDs that leak data, stack traces).

## 4. Validation

- Validate `req.body`, `req.params` and `req.query` in a `validate(schema)` middleware before the controller.
- Strip or reject unknown fields (prevents mass assignment like `isAdmin: true`).
- Replace `req.body` with the parsed result (trimmed, defaulted, coerced).
- **Never** `Model.create(req.body)` — pick fields explicitly.
- Shape checks in the validator; checks that need the DB (exists, belongs to, in stock, not expired) in the service.

## 5. Errors and async

- Throw typed errors (`NotFoundError`, `ConflictError`, ...) carrying a status code; never `res.status(500)` inside services.
- One error-handling middleware, registered last:
  - Operational errors → their status + safe message.
  - Unknown errors → log full details with request ID, respond `500` with a generic message.
- Every promise is awaited or explicitly handled. No floating promises.
- Run independent awaits in parallel with `Promise.all`; use `Promise.allSettled` when partial success is acceptable.
- `process.on('unhandledRejection' | 'uncaughtException')`: log, then exit so the process manager restarts a clean process.

## 6. Security

- Auth: short-lived access token (≈15 min) + rotating refresh token in an `httpOnly`, `Secure`, `SameSite` cookie. Support revocation (refresh-token store or denylist).
- Passwords: bcrypt or argon2. Never log or return them.
- Authorization checked in the service for every resource ("does this staff belong to this store?"), not just "is logged in".
- `helmet()`, strict `cors()` allow-list, body size limit (`express.json({ limit: '100kb' })`).
- Rate-limit auth, OTP and other abuse-prone endpoints (Redis-backed so it works across instances).
- Parameterised queries only. No string-built SQL. Validate types before Mongo queries (blocks `{ "$gt": "" }` injection).
- Secrets from environment / AWS Secrets Manager / SSM. Never commit `.env`. Validate all env vars at startup and fail fast.
- Uploads go to S3 via presigned URLs; never store user files on the app server's disk.
- Run `npm audit` / Dependabot; pin versions with a lockfile.

## 7. Databases

### PostgreSQL

- Every schema change is a migration, committed with the code. Never edit the DB by hand.
- Foreign keys and `NOT NULL` where the business requires them; unique constraints for business uniqueness (phone, SKU, email).
- Use transactions whenever several writes must succeed or fail together.
- Use `INSERT ... ON CONFLICT` (upsert) instead of find-then-insert for "create if not exists".
- Use `SELECT ... FOR UPDATE` or atomic `UPDATE ... SET stock = stock - 1 WHERE stock > 0` to prevent overselling.
- Index columns used in `WHERE`, `JOIN` and `ORDER BY`; verify with `EXPLAIN ANALYZE` for anything on a hot path.
- No N+1 queries: batch with `IN (...)`/joins or the ORM's include/eager loading.
- Connection pool sized for the number of instances; never open a connection per request.
- Bulk inserts in batches (~500–1,000 rows), never row-by-row, never one giant query.

### MongoDB

- Design documents around read patterns: embed what's read together and bounded in size; reference what grows without limit.
- Index every field used in queries and sorts; check with `.explain()`.
- Use `findOneAndUpdate` with `upsert` for create-or-update; use sessions/transactions for multi-document atomic writes.
- Mongoose schemas with `strict` mode; never pass raw `req.body` to queries.

## 8. Caching (Redis)

- Cache-aside: read cache → miss → read DB → write cache with a TTL.
- Every key has a TTL and a namespaced name: `product:v1:{id}`.
- Invalidate (delete) the key on write; don't try to update it in place.
- Protect hot keys from stampedes (lock or request coalescing).
- Never cache per-user sensitive data without the user ID in the key.
- The app must work (slower) if Redis is down.

## 9. Background work and queues

- Anything slow, unreliable or not needed for the response goes to a queue: emails, SMS/WhatsApp, PDFs, image processing, imports, webhooks to third parties.
- API publishes a small message (`{ type, id }`) **after** the DB commit; for guaranteed delivery use the outbox pattern.
- Workers run as a separate process/container, delete the message only on success, and have a dead-letter queue.
- Every job handler is **idempotent** (at-least-once delivery). Use provider idempotency keys or a unique "already processed" record.
- Visibility timeout / job timeout longer than the slowest job.
- CPU-heavy work that must return in the response → worker threads pool, not the main thread.
- Scheduled jobs never run inside API instances. Use EventBridge Scheduler → Lambda/SQS, or a single scheduler process with a Redis lock.

## 10. Large data

- Stream files and large exports (`pipeline(readStream, transform, res)`), never `readFile` on unbounded data.
- Long operations return `202 Accepted` + a job ID; clients poll `GET /jobs/:id` or receive a webhook/WebSocket update.

## 11. Observability

- Structured JSON logs with `requestId`, `userId`, route, status and duration. No `console.log` in committed code.
- Propagate a request ID (`X-Request-Id`) to logs, queue messages and downstream calls.
- Never log secrets, tokens, passwords, full card or ID numbers, or full request bodies with personal data.
- `GET /health` (process alive) and `GET /ready` (DB/Redis reachable) endpoints.
- Metrics and alerts on error rate, p95 latency, queue depth and DLQ size.

## 12. Scaling and runtime

- Stateless app: no sessions, caches, uploads or cron in process memory or local disk.
- One process per container; scale by adding containers behind the load balancer (or PM2 cluster on a single VM).
- Graceful shutdown on `SIGTERM`: stop accepting requests, finish in-flight ones, close DB/Redis/queue connections, then exit.
- Timeouts on every outbound HTTP call; retries only with backoff and only for idempotent operations.

## 13. Testing

- Unit-test services with fake repositories.
- Integration-test endpoints with Supertest against a real test database (Docker/Testcontainers), not mocks.
- Every bug fix comes with a test that fails before the fix.
- Test the unhappy paths: validation errors, unauthorised, not found, duplicates, concurrent requests.
- CI runs lint, type-check, tests and migrations on every PR.

## 14. Code style

- Small functions named for what they do: `findUserByPhone`, `createWalkIn`, `assertStaffBelongsToStore`.
- No magic numbers or strings: constants or config.
- Comments explain **why**, not what.
- Async/await everywhere; no callback-style code in new modules.
- Delete dead code; don't comment it out.

## 15. Never do

- `Model.create(req.body)` or any DB write straight from the request body.
- Business logic in controllers or routes; `req`/`res` inside services.
- String-concatenated SQL.
- Secrets, tokens or personal data in code, logs or error responses.
- Cron jobs inside API processes.
- `readFile` / load-all-rows on data that can grow without limit.
- Find-then-insert for uniqueness without a unique constraint.
- Unbounded list endpoints (no `limit`).
- Swallowing errors with an empty `catch` or `console.log(e)`.
- Adding a new library when an existing one in the repo already does the job.

## 16. Before marking a change done

- Input validated; unknown fields stripped or rejected
- Authorization checked for the specific resource
- Correct status codes and the standard error shape
- Multi-write operations in a transaction; uniqueness enforced by the DB
- Slow or external work moved to a queue; handlers idempotent
- Indexes exist for new query patterns
- Logs are structured and contain no sensitive data
- Tests cover the happy path and main failure paths
- Migrations included and reversible where possible