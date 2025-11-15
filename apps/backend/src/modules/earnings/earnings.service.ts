import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { EarningsLedger } from './earnings-ledger.entity';
import { Driver } from '../drivers/driver.entity';

interface DriverBalance {
  driver_id: string;
  balance_cents: number;
  last_tx_at: Date | null;
}

interface DriverLockStatus {
  locked: boolean;
  balance_cents: number;
  threshold_cents: number;
}

const LOCK_THRESHOLD_CENTS = 100000; // 1000 TND

@Injectable()
export class EarningsService {
  private readonly logger = new Logger(EarningsService.name);

  constructor(
    @InjectRepository(EarningsLedger)
    private readonly ledgerRepository: Repository<EarningsLedger>,
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Credit a driver's earnings from a completed ride
   * Triggers materialized view refresh
   */
  async creditRide(
    driverId: string,
    rideId: string,
    amountCents: number,
  ): Promise<void> {
    if (amountCents < 0) {
      throw new BadRequestException('Amount cannot be negative');
    }

    const entry = this.ledgerRepository.create({
      driver_id: driverId,
      ride_id: rideId,
      amount_cents: amountCents,
      direction: 'credit',
      kind: 'ride_cash',
    });

    await this.ledgerRepository.save(entry);
    this.logger.log(
      `Credited ${amountCents} cents to driver ${driverId} for ride ${rideId}`,
    );

    // Refresh materialized view
    await this.refreshBalances();
  }

  /**
   * Debit driver's balance when they make a deposit
   */
  async debitDeposit(
    driverId: string,
    amountCents: number,
    note?: string,
  ): Promise<void> {
    if (amountCents < 0) {
      throw new BadRequestException('Amount cannot be negative');
    }

    const entry = this.ledgerRepository.create({
      driver_id: driverId,
      // ride_id is omitted (undefined) for deposits
      amount_cents: amountCents,
      direction: 'debit',
      kind: 'deposit_lock',
      note: note || 'Deposit to La Poste',
    });

    await this.ledgerRepository.save(entry);
    this.logger.log(
      `Debited ${amountCents} cents from driver ${driverId} for deposit`,
    );

    // Refresh materialized view
    await this.refreshBalances();
  }

  /**
   * Get driver's current balance from materialized view
   * Fast query, updated after every ledger write
   */
  async getDriverBalance(driverId: string): Promise<DriverBalance> {
    const result = await this.dataSource.query(
      'SELECT * FROM driver_balances_mv WHERE driver_id = $1',
      [driverId],
    );

    if (!result || result.length === 0) {
      return {
        driver_id: driverId,
        balance_cents: 0,
        last_tx_at: null,
      };
    }

    return {
      driver_id: result[0].driver_id,
      balance_cents: parseInt(result[0].balance_cents, 10),
      last_tx_at: result[0].last_tx_at,
    };
  }

  /**
   * Check if driver should be locked due to earnings >= 1000 TND
   * This is the critical business rule
   */
  async checkDriverLock(driverId: string): Promise<DriverLockStatus> {
    const balance = await this.getDriverBalance(driverId);

    const locked = balance.balance_cents >= LOCK_THRESHOLD_CENTS;

    if (locked) {
      this.logger.warn(
        `Driver ${driverId} is LOCKED: balance ${balance.balance_cents} >= ${LOCK_THRESHOLD_CENTS}`,
      );
    }

    return {
      locked,
      balance_cents: balance.balance_cents,
      threshold_cents: LOCK_THRESHOLD_CENTS,
    };
  }

  /**
   * Get driver's transaction history (ledger)
   */
  async getDriverLedger(
    driverId: string,
    limit: number = 50,
  ): Promise<EarningsLedger[]> {
    return this.ledgerRepository.find({
      where: { driver_id: driverId },
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  /**
   * Refresh the materialized view
   * Called after every ledger write
   */
  private async refreshBalances(): Promise<void> {
    await this.dataSource.query('SELECT refresh_driver_balances()');
    this.logger.debug('Refreshed driver_balances_mv');
  }
}

