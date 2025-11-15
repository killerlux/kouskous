import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceToken, Platform } from './device-token.entity';

@Injectable()
export class DeviceTokensService {
  private readonly logger = new Logger(DeviceTokensService.name);

  constructor(
    @InjectRepository(DeviceToken)
    private readonly deviceTokensRepository: Repository<DeviceToken>,
  ) {}

  /**
   * Register a device token for push notifications
   * Idempotent - won't create duplicates
   */
  async registerToken(
    userId: string,
    platform: Platform,
    token: string,
  ): Promise<void> {
    const existing = await this.deviceTokensRepository.findOne({
      where: { user_id: userId, platform, token },
    });

    if (existing) {
      this.logger.debug(`Token already registered for user ${userId}`);
      return;
    }

    const deviceToken = this.deviceTokensRepository.create({
      user_id: userId,
      platform,
      token,
    });

    await this.deviceTokensRepository.save(deviceToken);
    this.logger.log(`Registered ${platform} token for user ${userId}`);
  }

  /**
   * Remove a device token (on logout or token refresh)
   */
  async removeToken(
    userId: string,
    platform: Platform,
    token: string,
  ): Promise<void> {
    await this.deviceTokensRepository.delete({
      user_id: userId,
      platform,
      token,
    });
    this.logger.log(`Removed ${platform} token for user ${userId}`);
  }

  /**
   * Get all registered tokens for a user
   */
  async getUserTokens(userId: string): Promise<DeviceToken[]> {
    return this.deviceTokensRepository.find({
      where: { user_id: userId },
    });
  }

  /**
   * Check if a specific token is registered for a user
   * Used for device binding verification
   */
  async hasToken(
    userId: string,
    platform: Platform,
    token: string,
  ): Promise<boolean> {
    const exists = await this.deviceTokensRepository.findOne({
      where: { user_id: userId, platform, token },
    });
    return !!exists;
  }
}

