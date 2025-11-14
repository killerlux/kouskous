import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/admin',
  cors: { origin: '*' },
})
export class AdminGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    console.log(`Admin connected: ${client.id}`);
    // TODO: Authenticate admin via JWT
  }

  async handleDisconnect(client: Socket) {
    console.log(`Admin disconnected: ${client.id}`);
  }

  // Server-side method to push monitoring updates
  pushMonitoring(data: any): void {
    this.server.emit('admin:monitor', data);
  }

  pushDepositDecision(depositId: string, decision: 'approved' | 'rejected'): void {
    this.server.emit('deposit:decision', { depositId, decision });
  }
}

