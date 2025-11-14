import { Injectable, Inject } from '@nestjs/common';
import { REDIS } from '../redis/redis.module';

interface Location {
  lat: number;
  lng: number;
  accuracy: number;
}

@Injectable()
export class PresenceService {
  private readonly PRESENCE_TTL = 30; // 30 seconds heartbeat

  constructor(@Inject(REDIS) private redis: any) {}

  async setOnline(driverId: string): Promise<void> {
    const key = `driver:presence:${driverId}`;
    await this.redis.setEx(key, this.PRESENCE_TTL, 'online');
  }

  async setOffline(driverId: string): Promise<void> {
    const key = `driver:presence:${driverId}`;
    await this.redis.del(key);
  }

  async updateLocation(driverId: string, location: Location): Promise<void> {
    const key = `driver:location:${driverId}`;
    await this.redis.setEx(
      key,
      this.PRESENCE_TTL,
      JSON.stringify({ ...location, updated_at: Date.now() }),
    );
  }

  async getLocation(driverId: string): Promise<Location | null> {
    const key = `driver:location:${driverId}`;
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async isOnline(driverId: string): Promise<boolean> {
    const key = `driver:presence:${driverId}`;
    const exists = await this.redis.exists(key);
    return exists === 1;
  }

  async getOnlineDrivers(): Promise<string[]> {
    const keys = await this.redis.keys('driver:presence:*');
    return keys.map((key: string) => key.replace('driver:presence:', ''));
  }
}

