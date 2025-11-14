import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { DriverGateway } from './gateways/driver.gateway';
import { ClientGateway } from './gateways/client.gateway';
import { AdminGateway } from './gateways/admin.gateway';
import { DispatchService } from './services/dispatch.service';
import { PresenceService } from './services/presence.service';
import { GpsValidationService } from './services/gps-validation.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    RedisModule,
  ],
  providers: [
    DriverGateway,
    ClientGateway,
    AdminGateway,
    DispatchService,
    PresenceService,
    GpsValidationService,
  ],
})
export class AppModule {}

