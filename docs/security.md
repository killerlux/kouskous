# Security Checklist (v1.2)

**Last Updated**: 2025-11-15  
**Status**: Foundation in place; controls implementation in progress

## Threat Model (STRIDE)

### Authentication & Authorization
- **Spoofing**: Phone OTP verification + device binding prevents account takeover
- **Tampering**: JWT signatures prevent token manipulation; RBAC guards prevent privilege escalation
- **Repudiation**: Audit trail in `admin_actions` table for all sensitive operations

### Dispatch & GPS
- **Spoofing**: GPS anti-spoofing heuristics (accuracy, teleport, speed checks)
- **Tampering**: Server-side road snapping; reject low-accuracy updates
- **Denial of Service**: Rate limiting on ride requests; socket backpressure

### Earnings & Deposits
- **Tampering**: Immutable ledger; materialized view for balance checks
- **Repudiation**: All deposit decisions logged with admin ID and timestamp
- **Information Disclosure**: PII redacted from logs; encrypted backups

---

## Security Controls

### ✅ Authentication & Authorization
- [🚧] Firebase phone OTP → server-issued JWT (15min TTL) — **auth scaffolds exist, not wired to Firebase yet**
- [ ] Refresh token flow with secure storage
- [✅] Device binding via `device_tokens` table — **schema ready**
- [ ] RBAC guards (`@Roles('admin')`) on all admin endpoints — **JwtAuthGuard exists, role checks TODO**
- [ ] Resource ownership checks (drivers can only access their own data) — **partial in RidesService**

### ✅ Input Validation
- [🚧] DTOs with `class-validator` on all endpoints — **DTO skeletons exist, validators incomplete**
- [ ] Centralized sanitization for user-generated content
- [✅] SQL injection prevention (TypeORM parameterized queries) — **TypeORM protects by default**
- [✅] XSS prevention (React/Next.js auto-escaping) — **framework defaults**

### ✅ Rate Limiting
- [ ] IP + user scopes
- [ ] Stricter limits for `/auth` and `/rides`
- [ ] Redis-based rate limiter (`@nestjs/throttler`) — **dependency installed, not configured**

### ✅ GPS Anti-Spoofing
- [ ] Drop updates with `accuracy > 50m` — **gps-validation.service.ts stubbed**
- [ ] Reject teleport jumps >250m in 2s window
- [ ] Flag speeds >160 km/h as suspicious
- [ ] Server-side road snapping (Google Roads API)
- [ ] Driver scoring system for repeat offenders

### ✅ Documents & Receipts
- [ ] EXIF metadata validation
- [ ] Detect image tampering
- [ ] Random liveness photo prompts (future)
- [✅] Manual review channel for all deposits — **deposits table + admin endpoints exist**
- [✅] Audit trail for all approvals/rejections — **admin_actions table ready**

### ✅ Secrets Management
- [✅] Never commit secrets to repo — **.gitignore blocks .env**
- [🚧] Use environment variables + secret managers (DO Secrets/Doppler/Cloudflare) — **env.example provided**
- [ ] Rotate secrets every 90 days
- [✅] Separate secrets per environment — **dev/staging/prod env files**

### ✅ Logging & Monitoring
- [ ] Redact PII (phone numbers, names, addresses) from logs
- [ ] Structured JSON logs with correlation IDs
- [ ] Security events to dedicated index
- [ ] Alert on suspicious patterns (failed auth spikes, GPS anomalies)

### ✅ Backups & Recovery
- [🚧] Nightly Postgres snapshots (14-day retention) — **Terraform provisions managed DB with backups**
- [ ] Encrypt backups at rest
- [🚧] Object storage versioning (S3/DO Spaces) — **Terraform ready, not deployed**
- [ ] Monthly restore drills
- [✅] Documented restore runbook — **infra/terraform/README.md**

### ✅ Infrastructure Security
- [✅] Firewall rules (only HTTPS/WS inbound) — **Terraform firewall configured**
- [✅] VPC isolation (private network for DB/Redis) — **Terraform VPC**
- [🚧] TLS termination at Cloudflare — **referenced in docs, not deployed**
- [🚧] DDoS protection via Cloudflare
- [ ] Regular security patches

### ✅ Dependency Security
- [ ] SBOM generation
- [✅] Trivy scan in CI (HIGH/CRITICAL only) — **ci.yml includes Trivy**
- [✅] Dependency updates via Dependabot — **dependabot.yml configured**
- [ ] Review security advisories monthly

---

## Compliance & Privacy

### Data Retention
- [ ] Define retention policy (e.g., 2 years for ride history)
- [ ] Implement data deletion workflow
- [ ] Right-to-erase flow for GDPR compliance

### Incident Response
- [ ] Triage process documented
- [ ] Containment procedures
- [ ] Eradication steps
- [ ] Recovery checklist
- [ ] Postmortem template

---

## Security Review Checklist

Before deploying changes affecting:
- **Auth/Authorization**: Review RBAC changes, token flows, device binding
- **Earnings/Deposits**: Review ledger logic, balance calculations, approval workflows
- **GPS/Dispatch**: Review anti-spoofing rules, dispatch algorithm
- **Admin Actions**: Review audit logging, access controls

---

**Last Updated**: 2025-01-14  
**Next Review**: 2025-04-14

