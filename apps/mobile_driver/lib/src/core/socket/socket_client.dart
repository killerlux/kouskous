// apps/mobile_driver/lib/src/core/socket/socket_client.dart
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../secure/secure_store.dart';

enum SocketNamespace { client, driver, admin }

class SocketClient {
  final SecureStore store;
  final SocketNamespace ns;
  late final IO.Socket socket;

  SocketClient(this.store, this.ns);

  Future<void> connect() async {
    final token = await store.access;
    final base = dotenv.env['SOCKET_URL'] ?? 'http://localhost:5000';
    final path = switch (ns) {
      SocketNamespace.client => '/client',
      SocketNamespace.driver => '/driver',
      SocketNamespace.admin => '/admin',
    };

    socket = IO.io(
      base,
      IO.OptionBuilder()
        .setTransports(['websocket'])
        .setAuth({'token': token})
        .enableAutoConnect()
        .enableReconnection()
        .setReconnectionDelay(500)
        .setTimeout(8000)
        .setPath(path)
        .build(),
    );

    socket.onConnect((_) {});
    socket.onReconnect((_) {});
    socket.onReconnectError((e) {});
    socket.onError((e) {});
  }

  Future<void> disconnect() async {
    socket.dispose();
  }
}

