import { Entity, Column, PrimaryColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

export type Platform = 'ios' | 'android' | 'web';

@Entity('device_tokens')
export class DeviceToken {
  @PrimaryColumn('uuid')
  user_id: string;

  @PrimaryColumn({ type: 'text' })
  platform: Platform;

  @PrimaryColumn({ type: 'text' })
  token: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

