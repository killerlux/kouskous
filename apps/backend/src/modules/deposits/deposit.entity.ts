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

@Entity('deposits')
export class Deposit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  driver_id: string;

  @ManyToOne(() => Driver, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @Column({ type: 'bigint' })
  amount_cents: number;

  @Column({ type: 'text' })
  receipt_url: string;

  @Column({
    type: 'text',
    enum: ['submitted', 'approved', 'rejected'],
    default: 'submitted',
  })
  status: DepositStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  decided_at?: Date;

  @Column({ type: 'uuid', nullable: true })
  decided_by?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'decided_by' })
  admin?: User;
}
