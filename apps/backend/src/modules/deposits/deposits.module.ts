import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositsService } from './deposits.service';
import { DepositsController } from './deposits.controller';
import { Deposit } from './deposit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deposit])],
  providers: [DepositsService],
  controllers: [DepositsController],
  exports: [DepositsService],
})
export class DepositsModule {}

