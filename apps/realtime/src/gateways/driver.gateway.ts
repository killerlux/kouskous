import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import { REDIS } from '../redis/redis.module';
import { PresenceService } from '../services/presence.service';
import { GpsValidationService } from '../services/gps-validation.service';
import { DispatchService } from '../services/dispatch.service';

interface LocationUpdate {
  lat: number;
  lng: number;
  accuracy: number;
  speed?: number;
  heading?: number;
  ts: number;
}

@WebSocketGateway({
  namespace: '/driver',
  cors: { origin: '*' },
})
export class DriverGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(REDIS) private redis: any,
    private presenceService: PresenceService,
    private gpsValidationService: GpsValidationService,
    private dispatchService: DispatchService,
  ) {}

  async handleConnection(client: Socket) {
    console.log(`Driver connected: ${client.id}`);
    // TODO: Authenticate driver via JWT from handshake
    // TODO: Set client.data.driverId
  }

  async handleDisconnect(client: Socket) {
    console.log(`Driver disconnected: ${client.id}`);
    // TODO: Remove from presence
    if (client.data.driverId) {
      await this.presenceService.setOffline(client.data.driverId);
    }
  }

  @SubscribeMessage('driver:location')
  async handleLocation(
    @MessageBody() body: LocationUpdate,
    @ConnectedSocket() client: Socket,
  ): Promise<{ ok: boolean; error?: string }> {
    // GPS Anti-spoofing: Validate location update
    const isValid = await this.gpsValidationService.validateLocation(
      body,
      client.data.driverId,
    );

    if (!isValid) {
      return { ok: false, error: 'Invalid GPS data rejected' };
    }

    // Update presence with location
    if (client.data.driverId) {
      await this.presenceService.updateLocation(client.data.driverId, {
        lat: body.lat,
        lng: body.lng,
        accuracy: body.accuracy,
      });
    }

    return { ok: true };
  }

  @SubscribeMessage('driver:online')
  async handleOnline(@ConnectedSocket() client: Socket): Promise<{ ok: boolean; error?: string }> {
    if (!client.data.driverId) {
      return { ok: false, error: 'Not authenticated' };
    }

    // Check balance lock (earnings >= 1000 TND)
    const isLocked = await this.dispatchService.checkDriverLock(client.data.driverId);
    if (isLocked) {
      this.server.to(client.id).emit('system:lock', {
        message: 'Earnings threshold reached. Please submit deposit receipt.',
      });
      return { ok: false, error: 'Driver locked - deposit required' };
    }

    await this.presenceService.setOnline(client.data.driverId);
    return { ok: true };
  }

  @SubscribeMessage('driver:offline')
  async handleOffline(@ConnectedSocket() client: Socket): Promise<{ ok: boolean }> {
    if (client.data.driverId) {
      await this.presenceService.setOffline(client.data.driverId);
    }
    return { ok: true };
  }

  @SubscribeMessage('ride:accept')
  async handleRideAccept(
    @MessageBody() body: { rideId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<{ ok: boolean; error?: string }> {
    if (!client.data.driverId) {
      return { ok: false, error: 'Not authenticated' };
    }

    const result = await this.dispatchService.acceptRide(body.rideId, client.data.driverId);
    return result;
  }

  @SubscribeMessage('ride:decline')
  async handleRideDecline(
    @MessageBody() body: { rideId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<{ ok: boolean }> {
    if (client.data.driverId) {
      await this.dispatchService.declineRide(body.rideId, client.data.driverId);
    }
    return { ok: true };
  }

  // Server-side method to offer ride to driver
  async offerRide(driverSocketId: string, payload: {
    rideId: string;
    pickup: { lat: number; lng: number };
    dropoff: { lat: number; lng: number };
    est_fare?: number;
  }): Promise<void> {
    this.server.to(driverSocketId).emit('ride:offer', payload, (ack: { ok: boolean; error?: string }) => {
      // Handle ack
      if (!ack.ok) {
        console.log(`Driver ${driverSocketId} declined ride: ${ack.error}`);
      }
    });
  }
}

