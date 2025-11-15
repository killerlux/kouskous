import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deposit } from './deposit.entity';
import { EarningsService } from '../earnings/earnings.service';

@Injectable()
export class DepositsService {
  private readonly logger = new Logger(DepositsService.name);

  constructor(
    @InjectRepository(Deposit)
    private readonly depositsRepository: Repository<Deposit>,
    @Inject(forwardRef(() => EarningsService))
    private readonly earningsService: EarningsService,
  ) {}

  /**
   * Submit a deposit receipt for admin approval
   * Only allowed if driver is locked (balance >= 1000 TND)
   */
  async submitDeposit(
    driverId: string,
    amountCents: number,
    receiptUrl: string,
  ): Promise<Deposit> {
    // Validate inputs
    if (amountCents <= 0) {
      throw new BadRequestException('Amount must be positive');
    }
    if (!receiptUrl || receiptUrl.trim() === '') {
      throw new BadRequestException('Receipt URL is required');
    }

    // Check if driver is locked (balance >= threshold)
    const lockStatus = await this.earningsService.checkDriverLock(driverId);
    if (!lockStatus.locked) {
      throw new BadRequestException(
        `Driver is not locked. Current balance: ${lockStatus.balance_cents} cents, threshold: ${lockStatus.threshold_cents} cents`,
      );
    }

    const deposit = this.depositsRepository.create({
      driver_id: driverId,
      amount_cents: amountCents,
      receipt_url: receiptUrl,
      status: 'submitted',
    });

    const saved = await this.depositsRepository.save(deposit);
    this.logger.log(
      `Deposit ${saved.id} submitted by driver ${driverId} for ${amountCents} cents`,
    );
    return saved;
  }

  /**
   * Find deposit by ID with relations
   */
  async findById(depositId: string): Promise<Deposit> {
    const deposit = await this.depositsRepository.findOne({
      where: { id: depositId },
      relations: ['driver'],
    });

    if (!deposit) {
      throw new NotFoundException(`Deposit ${depositId} not found`);
    }

    return deposit;
  }

  /**
   * Admin approves deposit
   * Debits driver's earnings ledger and unlocks driver
   */
  async approveDeposit(depositId: string, adminId: string): Promise<Deposit> {
    const deposit = await this.findById(depositId);

    if (deposit.status !== 'submitted') {
      throw new BadRequestException(
        `Cannot approve deposit in status ${deposit.status}`,
      );
    }

    // Debit the earnings ledger
    await this.earningsService.debitDeposit(
      deposit.driver_id,
      deposit.amount_cents,
      `Approved deposit ${depositId} to La Poste`,
    );

    deposit.status = 'approved';
    deposit.decided_at = new Date();
    deposit.decided_by = adminId;

    const updated = await this.depositsRepository.save(deposit);
    this.logger.log(
      `Deposit ${depositId} approved by admin ${adminId}. Driver ${deposit.driver_id} unlocked.`,
    );
    return updated;
  }

  /**
   * Admin rejects deposit
   * Driver remains locked
   */
  async rejectDeposit(
    depositId: string,
    adminId: string,
    reason: string,
  ): Promise<Deposit> {
    const deposit = await this.findById(depositId);

    if (deposit.status !== 'submitted') {
      throw new BadRequestException(
        `Cannot reject deposit in status ${deposit.status}`,
      );
    }

    deposit.status = 'rejected';
    deposit.decided_at = new Date();
    deposit.decided_by = adminId;
    deposit.notes = reason;

    const updated = await this.depositsRepository.save(deposit);
    this.logger.warn(
      `Deposit ${depositId} rejected by admin ${adminId}. Reason: ${reason}`,
    );
    return updated;
  }

  /**
   * Get all deposits for a driver
   */
  async getDriverDeposits(driverId: string): Promise<Deposit[]> {
    return this.depositsRepository.find({
      where: { driver_id: driverId },
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Get all pending deposits (for admin review)
   */
  async getPendingDeposits(): Promise<Deposit[]> {
    return this.depositsRepository.find({
      where: { status: 'submitted' },
      order: { created_at: 'ASC' }, // FIFO
      relations: ['driver'],
    });
  }
}
