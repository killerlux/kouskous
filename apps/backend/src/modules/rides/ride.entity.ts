import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Driver } from '../drivers/driver.entity';

export type RideStatus =
  | 'requested'
  | 'offered'
  | 'assigned'
  | 'driver_arrived'
  | 'started'
  | 'completed'
  | 'cancelled';

@Entity({ name: 'rides' })
export class Ride {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'rider_user_id' })
  rider_user: User;

  @ManyToOne(() => Driver, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'driver_id' })
  driver?: Driver;

  @Column({
    type: 'enum',
    enum: ['requested', 'offered', 'assigned', 'driver_arrived', 'started', 'completed', 'cancelled'],
    default: 'requested',
  })
  status: RideStatus;

  // PostGIS geometry columns - stored as text in TypeORM, use raw SQL for spatial queries
  @Column({ type: 'geometry', spatialFeatureType: 'Point', srid: 4326 })
  pickup: string;

  @Column({ type: 'geometry', spatialFeatureType: 'Point', srid: 4326 })
  dropoff: string;

  @Column({ type: 'int', nullable: true })
  est_price_cents?: number;

  @Column({ type: 'int', nullable: true })
  price_cents?: number;

  @Column({ type: 'int', nullable: true })
  distance_m?: number;

  @Column({ type: 'int', nullable: true })
  duration_s?: number;

  @CreateDateColumn()
  requested_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  assigned_at?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  started_at?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  completed_at?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  cancelled_at?: Date;

  @Column({ type: 'text', nullable: true })
  cancellation_reason?: string;
}

