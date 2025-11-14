import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deposit } from './deposit.entity';

@Injectable()
export class DepositsService {
  constructor(
    @InjectRepository(Deposit)
    private depositsRepository: Repository<Deposit>,
  ) {}

  async create(driverId: string, amount_cents: number, receipt_url: string): Promise<Deposit> {
    const deposit = this.depositsRepository.create({
      driver: { id: driverId },
      amount_cents: amount_cents.toString(),
      receipt_url,
      status: 'submitted',
    });
    return this.depositsRepository.save(deposit);
  }

  async findById(id: string): Promise<Deposit> {
    const deposit = await this.depositsRepository.findOne({
      where: { id },
      relations: ['driver', 'decided_by'],
    });
    if (!deposit) {
      throw new NotFoundException(`Deposit with ID ${id} not found`);
    }
    return deposit;
  }

  async approve(id: string, adminUserId: string): Promise<void> {
    const deposit = await this.findById(id);
    if (deposit.status !== 'submitted') {
      throw new BadRequestException(`Cannot approve deposit in status: ${deposit.status}`);
    }
    deposit.status = 'approved';
    deposit.decided_at = new Date();
    deposit.decided_by = { id: adminUserId } as any;
    await this.depositsRepository.save(deposit);

    // TODO: Unlock driver availability
    // TODO: Create earnings ledger entry for deposit_unlock
  }

  async reject(id: string, adminUserId: string, reason?: string): Promise<void> {
    const deposit = await this.findById(id);
    if (deposit.status !== 'submitted') {
      throw new BadRequestException(`Cannot reject deposit in status: ${deposit.status}`);
    }
    deposit.status = 'rejected';
    deposit.decided_at = new Date();
    deposit.decided_by = { id: adminUserId } as any;
    deposit.notes = reason;
    await this.depositsRepository.save(deposit);
  }
}

