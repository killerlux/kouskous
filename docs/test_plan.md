# Test Plan — Taxi Platform (v1.0)

_Last updated: 2025-11-14_

## 1. Objectives
- Guarantee ride lifecycle, dispatch, earnings lock, and deposit workflows behave as described in `/docs/ARCHITECTURE.md`.
- Detect regressions early through automated tests (unit → integration → e2e).
- Validate non-functional qualities: performance (dispatch p95 < 4 s), reliability, battery usage, GPS integrity.
- Provide clear release gates and ownership for QA sign-off.

## 2. Test Pyramid & Coverage Goals
| Layer              | Target Coverage / Scope                                                                                   | Tooling                                                                 |
|--------------------|------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| Unit               | ≥80 % critical modules (backend services, Flutter blocs/providers)                                        | Jest (NestJS), Flutter test/golden, React Testing Library               |
| Integration        | Core flows: auth, ride lifecycle, driver lock, socket flows                                                | Jest + Testcontainers (Postgres, Redis), Supertest, Socket.IO harness  |
| End-to-end (E2E)   | Admin web happy paths, mobile ride lifecycle (client + driver)                                             | Playwright (admin), Flutter integration tests                          |
| Non-functional     | Realtime load (1,000 concurrent drivers), failover drills, battery/GPS edge cases                          | k6, custom chaos scripts, Android/iOS profiler                          |

## 3. Test Matrix
| Feature                    | Unit                         | Integration / E2E                           | Notes                                                        |
|----------------------------|------------------------------|---------------------------------------------|--------------------------------------------------------------|
| Auth & JWT                 | Nest Auth service tests      | OTP → JWT happy path                        | Mock Firebase Admin for unit; hit staging for e2e            |
| Ride request lifecycle     | RidesService (unit)          | Client ↔ driver ↔ realtime end-to-end       | Includes cancel/start/complete & earnings ledger             |
| Dispatch/Realtime          | Gateway utility unit tests   | k6 load test + socket acceptance scenarios  | Validate ack contract `{ ok, error?, data? }`                |
| Earnings lock & deposits   | Ledger/domain units          | Admin approves deposit → driver unlock      | Ensure balancing view refresh + lock/unlock events           |
| Driver documents           | Document service             | Admin verification queue flow               | Document EXIF / liveness tests (manual + automated)          |
| Admin dashboards           | Component testing            | Playwright per page (dashboard, queues)     | Accessibility checks (axe)                                   |
| Mobile client              | Riverpod units, golden tests | Flutter integration: request → complete ride| Emulate GPS, offline caching, translations                   |
| Mobile driver              | State machines, location svc | Flutter integration: accept → deposit lock  | Battery-aware location, forced lock scenario                 |

## 4. Automation Details
### Backend (NestJS)
- `apps/backend/test/**.spec.ts` for unit/integration (ts-jest).
- `test:cov` enforces coverage thresholds (configured via Jest).
- Integration uses `@testcontainers/postgresql` + `redis` to mirror production schema.

### Realtime
- Socket harness under `apps/realtime/test/` simulates `/driver` + `/client` namespaces.
- Load tests via `tests/load/k6/dispatch.js` (target 1k concurrent drivers, accept latency < 4 s).

### Flutter Apps
- Unit & golden tests via `flutter test`.
- Integration tests using `flutter test integration_test` with mocked backend (or staging env).
- Battery/GPS scenarios executed with Android Emulator `adb shell dumpsys batterystats` and Xcode Instruments.

### Admin (Next.js)
- Component tests using React Testing Library.
- Playwright E2E flows in `.github/workflows/ci.yml` (gated on staging env readiness).

## 5. Manual / Exploratory Checklists
1. Driver onboarding verifying Tunisian license numbers (edge-case docs).
2. GPS spoof attempts (mock location apps, teleport, inaccurate sensors).
3. Cash-only settlement (ensure no payment UI leaks).
4. iOS/Android permission prompts accurate translations (AR/FR/EN).
5. App store review checklist (test accounts, permission descriptions, demo video).

## 6. Non-Functional Testing
- **Load / Soak**: `k6` script simulating 1,000 drivers + 500 concurrent riders for 10 min; ensure CPU < 70 %, memory < 75 %.
- **Failover**: terminate realtime droplet → verify auto-reconnect + monitoring alert.
- **Battery**: run driver app for 2 h route; ensure <15 % battery drain (baseline).
- **Security**: run Trivy, npm audit, dependency review in CI; manual pen-test checklist (see `/docs/security.md`).

## 7. CI/CD Gates
1. `pnpm lint` / `pnpm test` (backend, realtime, admin, shared) — required.
2. Flutter unit tests — required.
3. Playwright smoke suite (staging) — required before prod release.
4. `k6` load test — nightly; must pass or escalate.
5. Trivy scan (fs + images) — required.
6. Testcontainers integration — required for backend modules touching DB.

## 8. Release Readiness Checklist
- ✅ All blocking bugs closed (severity P1/P2).
- ✅ Coverage ≥ targets, no flaky tests.
- ✅ Load + failover tests pass within SLOs.
- ✅ Observability dashboards updated; alerts green.
- ✅ App store builds smoke-tested on physical devices (iOS + Android).
- ✅ Runbook updated for release, rollback, migrations.

## 9. Ownership
- Backend QA owner: Backend Lead.
- Realtime & load: Realtime Lead + DevOps.
- Mobile QA leads: respective Flutter leads.
- Admin QA: Frontend lead.
- Test plan maintenance: QA lead (updates w/ every major feature).

> Keep this document updated alongside `/docs/ARCHITECTURE.md` for every meaningful change. PRs affecting workflows must include test plan adjustments.

