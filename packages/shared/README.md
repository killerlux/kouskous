# @taxi/shared

Shared TypeScript SDK, types, and utilities for the Taxi Platform monorepo.

## What's Inside

- **TypeScript SDK**: Auto-generated from OpenAPI spec (`/sdk/generated`)
- **Type Definitions**: OpenAPI schema types (`/sdk/schema.ts`)
- **API Clients**: Ready-to-use API clients for all backend endpoints

## SDK Generation

The SDK is automatically generated from `/docs/openapi.yaml`:

```bash
# Generate everything
pnpm run generate

# Or generate separately
pnpm run generate:types   # TypeScript types only
pnpm run generate:sdk      # Full SDK with Axios clients
```

## Usage in Admin Web

```typescript
import { AuthApi, DepositsApi, Configuration } from '@taxi/shared/sdk';

// Create configuration
const config = new Configuration({
  basePath: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  accessToken: getTokenFromStorage(), // Your JWT token
});

// Create API clients
const authApi = new AuthApi(config);
const depositsApi = new DepositsApi(config);

// Login
const { data } = await authApi.authExchangeTokenPost({
  phone_e164: '+21612345678',
  otp_code: '000000',
});

// Get pending deposits (admin)
const { data: deposits } = await depositsApi.adminDepositsGet();

// Approve a deposit
await depositsApi.depositsIdApprovePost('deposit-id-here');
```

## Usage in Mobile (Flutter)

While this SDK is TypeScript/JavaScript, you can use the OpenAPI spec to generate Dart clients:

```bash
# Install openapi-generator
brew install openapi-generator  # macOS
# or
sudo apt install openapi-generator-cli  # Linux

# Generate Dart client
openapi-generator generate \
  -i ../../docs/openapi.yaml \
  -g dart \
  -o ../mobile_client/lib/api
```

## Available APIs

| API | Description | Endpoints |
|-----|-------------|-----------|
| `AuthApi` | Authentication | verify-phone, exchange-token |
| `UsersApi` | User management | /users/me |
| `DriversApi` | Driver operations | /drivers/me, /drivers/documents |
| `RidesApi` | Ride lifecycle | create, get, cancel, start, complete |
| `DepositsApi` | Deposit management | submit, approve, reject |
| `AdminApi` | Admin operations | verification-queue, deposits |
| `HealthApi` | Health checks | /health, /health/ready, /health/live |

## Type Safety

All API responses are fully typed:

```typescript
import type { paths } from '@taxi/shared/sdk/schema';

// Get response type for any endpoint
type UserResponse = paths['/users/me']['get']['responses'][200]['content']['application/json'];
type RideResponse = paths['/rides']['post']['responses'][201]['content']['application/json'];
```

## Regeneration

Re-generate the SDK whenever `/docs/openapi.yaml` changes:

```bash
cd packages/shared
pnpm run generate
```

**Always commit the generated SDK** to ensure consistency across the team.

## Contributing

- Never edit files in `/sdk/generated` manually
- Update `/docs/openapi.yaml` instead
- Run `pnpm run generate` after OpenAPI changes
- Commit both the spec and generated SDK

## License

MIT

