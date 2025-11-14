import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Vehicle } from './vehicle.entity';

@Entity({ name: 'drivers' })
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  license_number: string;

  @Column({ type: 'date' })
  license_expiry: string;

  @Column({ type: 'timestamptz', nullable: true })
  verified_at?: Date;

  @Column({ type: 'bigint', default: 0 })
  earnings_cents: string; // Use string for bigint in TypeORM

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Vehicle, { nullable: true })
  vehicle?: Vehicle;
}

