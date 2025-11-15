import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deposit } from './deposit.entity';
import { DepositsService } from './deposits.service';
import { EarningsModule } from '../earnings/earnings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Deposit]),
    forwardRef(() => EarningsModule),
  ],
  providers: [DepositsService],
  exports: [DepositsService],
})
export class DepositsModule {}
