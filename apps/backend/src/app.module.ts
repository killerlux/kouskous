import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './modules/users/users.module';
import { DriversModule } from './modules/drivers/drivers.module';
import { RidesModule } from './modules/rides/rides.module';
import { EarningsModule } from './modules/earnings/earnings.module';
import { DepositsModule } from './modules/deposits/deposits.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { AuthModule } from './modules/auth/auth.module';
import { DeviceTokensModule } from './modules/device-tokens/device-tokens.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Database
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false, // Never true in prod - migrations only
      logging: process.env.NODE_ENV === 'development',
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // Feature modules
    AuthModule,
    UsersModule,
    DeviceTokensModule,
    DriversModule,
    RidesModule,
    EarningsModule,
    DepositsModule,
    DocumentsModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

