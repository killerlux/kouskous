# Taxi Platform — Tunisian Ride-Hailing System

> **Scope**: Ride-hailing for **Tunisian licensed taxis** only. **Cash-only**; when a driver's **earnings ≥ 1000 TND**, the system **locks availability** until a **La Poste deposit** receipt is uploaded and **approved by admin**.

## 🏗️ Architecture

See [`/docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for full system architecture, C4 diagrams, and technical details.

## 📁 Project Structure

```
/apps
  /backend          # NestJS REST API
  /realtime         # Socket.IO dispatch service
  /admin            # Next.js admin web
  /mobile_client    # Flutter client app
  /mobile_driver    # Flutter driver app
/packages
  /shared           # Types, generated SDK, shared configs
/infra              # Terraform, Docker, Compose, Prometheus, Grafana
/docs               # Architecture, security, test plans, runbooks
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16+ with PostGIS extension
- Redis 7+
- pnpm (or npm)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd uber
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database**
   ```bash
   # Create database and enable PostGIS
   createdb taxi
   psql taxi -c "CREATE EXTENSION IF NOT EXISTS postgis;"
   
   # Run migrations
   cd apps/backend
   pnpm typeorm migration:run
   ```

5. **Start services**
   ```bash
   # Backend API
   cd apps/backend && pnpm start:dev
   
   # Realtime service (in another terminal)
   cd apps/realtime && pnpm start:dev
   
   # Admin web (in another terminal)
   cd apps/admin && pnpm dev
   ```

## 📚 Documentation

- [`/docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) - System architecture
- [`/docs/openapi.yaml`](./docs/openapi.yaml) - API contract (OpenAPI 3.0)
- [`/docs/schema.sql`](./docs/schema.sql) - Database schema
- [`/docs/security.md`](./docs/security.md) - Security checklist
- [`.cursorrules`](./.cursorrules) - Development guidelines

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Backend tests
cd apps/backend && pnpm test

# Flutter tests
cd apps/mobile_client && flutter test
```

## 🔒 Security

- Never commit secrets. Use `.env.example` and secret managers.
- See [`/docs/security.md`](./docs/security.md) for security checklist.
- All inputs validated via DTOs.
- PII redacted from logs.

## 🤝 Contributing

See [`.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md) for contribution guidelines.

## 📄 License

[Add your license here]

---

**Version**: 1.1  
**Last Updated**: 2025-01-14

