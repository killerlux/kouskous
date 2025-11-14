# Contributing to Taxi Platform

Thank you for contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. **Read the Architecture**: Start with `/docs/ARCHITECTURE.md` to understand the system design.
2. **Check `.cursorrules`**: Follow the coding standards and conventions.
3. **Set Up Environment**: See README.md for local development setup.

## Development Workflow

### Branch Naming
- `feature/<scope>` - New features
- `fix/<scope>` - Bug fixes
- `refactor/<scope>` - Code refactoring
- `chore/<scope>` - Maintenance tasks
- `docs/<scope>` - Documentation updates

### Commit Messages
Use [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `perf:` - Performance improvement
- `chore:` - Maintenance
- `docs:` - Documentation
- `test:` - Tests
- `build:` - Build system
- `ci:` - CI/CD

Example: `feat(rides): add ride cancellation endpoint`

### Pull Request Process

1. **Create a focused PR**: One feature/fix per PR (<300 LOC diff preferred).
2. **Update Documentation**: If you change APIs, update OpenAPI + regenerate SDK.
3. **Add Tests**: Include unit and integration tests for new code.
4. **Check CI**: Ensure all checks pass before requesting review.
5. **Fill PR Template**: Use the PR template to describe changes.

### PR Checklist

- [ ] Tests added/updated (unit + integration)
- [ ] Documentation updated (architecture, API, runbooks if applicable)
- [ ] No secrets committed
- [ ] CI passing (build, lint, test, scan)
- [ ] OpenAPI updated + SDK regenerated (if API changed)
- [ ] Migration tested (dry-run in CI)
- [ ] Security review (if auth/earnings/deposits changed)
- [ ] Performance impact assessed (if dispatch/algorithms changed)

## Code Standards

### Backend (NestJS)
- TypeScript strict mode
- DTOs with `class-validator`
- Error envelopes: `{ ok: boolean, error?: string, data?: any }`
- ESLint + Prettier enforced

### Realtime (Socket.IO)
- All events must ack
- Typed event payloads
- Handle backpressure gracefully

### Flutter
- Riverpod for state management
- Freezed for models
- Repositories for all I/O
- No business logic in Widgets

### Admin (Next.js)
- Use generated SDK (no direct fetch)
- Accessible components (WCAG AA)
- React Query for data fetching

## Testing

### Backend
- Unit tests: ≥80% coverage on core modules
- Integration tests: Use Testcontainers for Postgres + Redis
- Socket tests: Simulate client/driver connections

### Flutter
- Widget tests for critical screens
- Integration tests for ride lifecycle
- Golden tests for UI regression

### Admin
- E2E tests with Playwright
- Component tests with React Testing Library

## Security

- **Never commit secrets**: Use `.env.example` and secret managers
- **Validate all inputs**: Use DTOs with validation
- **Rate limit sensitive endpoints**: `/auth` and `/rides`
- **Redact PII from logs**: Phone numbers, names, addresses

## Questions?

- Check `/docs/ARCHITECTURE.md` for system design
- Check `/docs/openapi.yaml` for API contracts
- Ask in PR comments or create an issue

---

**Thank you for contributing!** 🚀

