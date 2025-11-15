import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EarningsLedger } from './earnings-ledger.entity';
import { Driver } from '../drivers/driver.entity';
import { EarningsService } from './earnings.service';

@Module({
  imports: [TypeOrmModule.forFeature([EarningsLedger, Driver])],
  providers: [EarningsService],
  exports: [EarningsService],
})
export class EarningsModule {}

