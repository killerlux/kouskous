import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Health check endpoint' })
  check() {
    return this.health.check([
      // Database health
      () => this.db.pingCheck('database'),
    ]);
  }

  @Get('ready')
  @HealthCheck()
  @ApiOperation({ summary: 'Readiness check (K8s/Nomad)' })
  readiness() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      // Add more checks: Redis, external APIs, etc.
    ]);
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness check (K8s/Nomad)' })
  liveness() {
    // Simple ping - service is running
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
