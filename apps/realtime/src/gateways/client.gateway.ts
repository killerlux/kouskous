import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Inject, forwardRef } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { DispatchService } from '../services/dispatch.service';

interface RideRequest {
  pickup: { lat: number; lng: number };
  dropoff: { lat: number; lng: number };
  idempotency_key?: string;
}

@WebSocketGateway({
  namespace: '/client',
  cors: { origin: '*' },
})
export class ClientGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(@Inject(forwardRef(() => DispatchService)) private dispatchService: DispatchService) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    // TODO: Authenticate client via JWT
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('ride:request')
  async handleRideRequest(
    @MessageBody() body: RideRequest,
    @ConnectedSocket() client: Socket,
  ): Promise<{ ok: boolean; error?: string; data?: { rideId: string } }> {
    // TODO: Get riderUserId from client.data
    const riderUserId = client.data.userId || 'temp-user-id';

    // Enforce idempotency
    if (body.idempotency_key) {
      const existing = await this.dispatchService.checkIdempotency(body.idempotency_key);
      if (existing) {
        return { ok: true, data: { rideId: existing } };
      }
    }

    // Create ride and dispatch
    const rideId = await this.dispatchService.requestRide(riderUserId, {
      pickup: body.pickup,
      dropoff: body.dropoff,
    });

    // Subscribe client to ride updates
    client.join(`ride:${rideId}`);

    return { ok: true, data: { rideId } };
  }

  // Server-side method to push ride status updates
  pushRideStatus(rideId: string, status: string, data?: any): void {
    this.server.to(`ride:${rideId}`).emit('ride:status', { status, ...data });
  }
}

