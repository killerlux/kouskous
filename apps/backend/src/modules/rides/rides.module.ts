import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RidesService } from './rides.service';
import { RidesController } from './rides.controller';
import { Ride } from './ride.entity';
import { EarningsModule } from '../earnings/earnings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ride]),
    forwardRef(() => EarningsModule),
  ],
  providers: [RidesService],
  controllers: [RidesController],
  exports: [RidesService],
})
export class RidesModule {}

