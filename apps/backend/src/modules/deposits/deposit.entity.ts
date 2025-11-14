import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Driver } from '../drivers/driver.entity';
import { User } from '../users/user.entity';

export type DepositStatus = 'submitted' | 'approved' | 'rejected';

@Entity({ name: 'deposits' })
export class Deposit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Driver, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @Column({ type: 'bigint' })
  amount_cents: string;

  @Column()
  receipt_url: string;

  @Column({
    type: 'enum',
    enum: ['submitted', 'approved', 'rejected'],
    default: 'submitted',
  })
  status: DepositStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  decided_at?: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'decided_by' })
  decided_by?: User;
}

