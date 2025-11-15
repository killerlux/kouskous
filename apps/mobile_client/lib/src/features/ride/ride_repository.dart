// apps/mobile_client/lib/src/features/ride/ride_repository.dart
import 'dart:async';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import '../../core/socket/socket_client.dart';
import '../../core/providers.dart';

final rideRepoProvider = Provider((ref) {
  final s = ref.read(socketProvider(SocketNamespace.client));
  return RideRepository(s);
});

class RideRepository {
  final SocketClient sc;

  RideRepository(this.sc);

  Future<String?> requestRide(
    double pLat,
    double pLng,
    double dLat,
    double dLng,
  ) async {
    await sc.connect();
    final c = sc.socket;
    final completer = Completer<String?>();
    c.emitWithAck(
      'ride:request',
      {
        'pickup': {'lat': pLat, 'lng': pLng},
        'dropoff': {'lat': dLat, 'lng': dLng},
        'idempotency_key': DateTime.now().microsecondsSinceEpoch.toString()
      },
      ack: (data) {
        if (data is Map && data['ok'] == true) {
          completer.complete(data['data']?['rideId'] as String?);
        } else {
          completer.complete(null);
        }
      },
    );
    return completer.future;
  }
}

