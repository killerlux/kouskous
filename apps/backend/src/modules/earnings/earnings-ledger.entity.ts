import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Driver } from '../drivers/driver.entity';
import { Ride } from '../rides/ride.entity';

export type LedgerDirection = 'credit' | 'debit';
export type LedgerKind =
  | 'ride_cash'
  | 'adjustment'
  | 'deposit_lock'
  | 'deposit_unlock';

@Entity('earnings_ledger')
export class EarningsLedger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  driver_id: string;

  @ManyToOne(() => Driver, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @Column({ type: 'uuid', nullable: true })
  ride_id?: string;

  @ManyToOne(() => Ride, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'ride_id' })
  ride?: Ride;

  @Column({ type: 'bigint' })
  amount_cents: number;

  @Column({
    type: 'text',
    enum: ['credit', 'debit'],
  })
  direction: LedgerDirection;

  @Column({
    type: 'text',
    enum: ['ride_cash', 'adjustment', 'deposit_lock', 'deposit_unlock'],
  })
  kind: LedgerKind;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}

