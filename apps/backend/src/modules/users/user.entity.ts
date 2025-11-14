import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne } from 'typeorm';
import { Driver } from '../drivers/driver.entity';

export type Role = 'client' | 'driver' | 'admin';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  phone_e164: string;

  @Column({ nullable: true })
  display_name?: string;

  @Column({ type: 'enum', enum: ['client', 'driver', 'admin'], default: 'client' })
  role: Role;

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => Driver, (driver) => driver.user)
  driver?: Driver;
}

