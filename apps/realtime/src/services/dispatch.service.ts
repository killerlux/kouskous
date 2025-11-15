import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { REDIS } from '../redis/redis.module';
import { PresenceService } from './presence.service';
import { DriverGateway } from '../gateways/driver.gateway';
import { ClientGateway } from '../gateways/client.gateway';

interface RideRequest {
  pickup: { lat: number; lng: number };
  dropoff: { lat: number; lng: number };
}

@Injectable()
export class DispatchService {
  private readonly OFFER_TIMEOUT = 20000; // 20 seconds
  private readonly MAX_RETRIES = 2;
  private readonly SEARCH_RADIUS = 5000; // 5km in meters

  constructor(
    @Inject(REDIS) private redis: any,
    private presenceService: PresenceService,
    @Inject(forwardRef(() => DriverGateway)) private driverGateway: DriverGateway,
    @Inject(forwardRef(() => ClientGateway)) private clientGateway: ClientGateway,
  ) {}

  async requestRide(riderUserId: string, request: RideRequest): Promise<string> {
    // TODO: Create ride in database via API call or shared service
    const rideId = `ride-${Date.now()}`; // Placeholder

    // Find nearest drivers
    const drivers = await this.findNearestDrivers(request.pickup);

    // Try to assign driver
    let assigned = false;
    for (let attempt = 0; attempt < this.MAX_RETRIES && !assigned; attempt++) {
      for (const driverId of drivers) {
        const socketId = await this.getDriverSocketId(driverId);
        if (!socketId) continue;

        // Offer ride
        await this.driverGateway.offerRide(socketId, {
          rideId,
          pickup: request.pickup,
          dropoff: request.dropoff,
        });

        // Wait for response (with timeout)
        const accepted = await this.waitForAccept(rideId, driverId);
        if (accepted) {
          assigned = true;
          // TODO: Update ride status in DB
          this.clientGateway.pushRideStatus(rideId, 'assigned', { driverId });
          break;
        }
      }
    }

    if (!assigned) {
      // Fallback to broadcast
      // TODO: Implement broadcast dispatch
      this.clientGateway.pushRideStatus(rideId, 'offered', { message: 'Searching for driver...' });
    }

    return rideId;
  }

  async acceptRide(rideId: string, driverId: string): Promise<{ ok: boolean; error?: string }> {
    // TODO: Check if ride is still available
    // TODO: Update ride status in DB
    // TODO: Notify client
    this.clientGateway.pushRideStatus(rideId, 'assigned', { driverId });
    return { ok: true };
  }

  async declineRide(rideId: string, driverId: string): Promise<void> {
    // TODO: Log decline
    // TODO: Retry dispatch if needed
  }

  async checkDriverLock(driverId: string): Promise<boolean> {
    // TODO: Query driver_balances_mv to check if balance >= 1000 TND
    // Placeholder
    return false;
  }

  async checkIdempotency(key: string): Promise<string | null> {
    const rideId = await this.redis.get(`idempotency:${key}`);
    return rideId;
  }

  private async findNearestDrivers(pickup: { lat: number; lng: number }): Promise<string[]> {
    // TODO: Implement PostGIS KNN search
    // For now, return all online drivers
    return this.presenceService.getOnlineDrivers();
  }

  private async getDriverSocketId(driverId: string): Promise<string | null> {
    // TODO: Map driverId to socketId
    return null;
  }

  private async waitForAccept(rideId: string, driverId: string): Promise<boolean> {
    // TODO: Implement promise-based wait with timeout
    return false;
  }
}

