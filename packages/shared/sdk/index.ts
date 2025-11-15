/**
 * Taxi Platform TypeScript SDK
 * 
 * Auto-generated from OpenAPI specification
 * 
 * Usage:
 * ```typescript
 * import { AuthApi, RidesApi, DepositsApi } from '@taxi/shared/sdk';
 * import { Configuration } from '@taxi/shared/sdk/generated';
 * 
 * const config = new Configuration({
 *   basePath: 'http://localhost:4000',
 *   accessToken: 'your_jwt_token_here'
 * });
 * 
 * const authApi = new AuthApi(config);
 * const ridesApi = new RidesApi(config);
 * 
 * // Exchange OTP for token
 * const { data } = await authApi.authExchangeTokenPost({
 *   phone_e164: '+21612345678',
 *   otp_code: '123456'
 * });
 * 
 * // Create a ride
 * const ride = await ridesApi.ridesPost({
 *   pickup: { lat: 36.8065, lng: 10.1815 },
 *   dropoff: { lat: 36.8027, lng: 10.1658 }
 * });
 * ```
 */

// Export all APIs
export {
  AdminApi,
  AuthApi,
  DepositsApi,
  DriversApi,
  HealthApi,
  RidesApi,
  UsersApi,
} from './generated/api';

// Export configuration
export { Configuration } from './generated/configuration';

// Export common types
export * from './generated/common';
export * from './generated/base';

// Export models (if any are generated)
export * from './generated/models';

// Export TypeScript schema types (from openapi-typescript)
export type { paths, components, operations } from './schema';

