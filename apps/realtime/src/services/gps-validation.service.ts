import { Injectable, Inject } from '@nestjs/common';
import { REDIS } from '../redis/redis.module';

interface LocationUpdate {
  lat: number;
  lng: number;
  accuracy: number;
  speed?: number;
  heading?: number;
  ts: number;
}

@Injectable()
export class GpsValidationService {
  private readonly ACCURACY_THRESHOLD = 50; // meters
  private readonly SPEED_THRESHOLD = 160; // km/h
  private readonly TELEPORT_THRESHOLD = 250; // meters
  private readonly TELEPORT_WINDOW = 2000; // 2 seconds

  constructor(@Inject(REDIS) private redis: any) {}

  async validateLocation(update: LocationUpdate, driverId: string): Promise<boolean> {
    // 1. Accuracy filter - drop low-accuracy updates
    if (update.accuracy > this.ACCURACY_THRESHOLD) {
      console.log(`Rejected: Low accuracy ${update.accuracy}m`);
      return false;
    }

    // 2. Speed limit check
    if (update.speed && update.speed > this.SPEED_THRESHOLD) {
      console.log(`Flagged: Suspicious speed ${update.speed} km/h`);
      // Don't reject, but flag for scoring
    }

    // 3. Teleport detection
    const lastLocation = await this.getLastLocation(driverId);
    if (lastLocation) {
      const distance = this.calculateDistance(
        lastLocation.lat,
        lastLocation.lng,
        update.lat,
        update.lng,
      );
      const timeDiff = update.ts - lastLocation.ts;

      if (distance > this.TELEPORT_THRESHOLD && timeDiff < this.TELEPORT_WINDOW) {
        console.log(`Rejected: Teleport detected ${distance}m in ${timeDiff}ms`);
        return false;
      }
    }

    // Store valid location
    await this.saveLocation(driverId, update);
    return true;
  }

  private async getLastLocation(driverId: string): Promise<LocationUpdate | null> {
    const key = `driver:last_location:${driverId}`;
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  private async saveLocation(driverId: string, location: LocationUpdate): Promise<void> {
    const key = `driver:last_location:${driverId}`;
    await this.redis.setEx(key, 60, JSON.stringify(location)); // 60s TTL
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    // Haversine formula for distance in meters
    const R = 6371000; // Earth radius in meters
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

