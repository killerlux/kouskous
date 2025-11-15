// apps/mobile_driver/lib/src/features/ride/ride_controls.dart
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import '../../core/socket/socket_client.dart';
import '../../core/providers.dart';

class RideControls extends ConsumerWidget {
  final String rideId;
  const RideControls({super.key, required this.rideId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final sc = ref.read(socketProvider(SocketNamespace.driver));
    return Scaffold(
      appBar: AppBar(title: Text('Ride $rideId')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            ElevatedButton(
              onPressed: () {
                sc.socket.emitWithAck('ride:start', {'rideId': rideId},
                    ack: (_) {});
              },
              child: const Text('Start'),
            ),
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: () {
                sc.socket.emitWithAck(
                  'ride:complete',
                  {'rideId': rideId, 'price_cents': 12000},
                  ack: (_) {},
                );
              },
              child: const Text('Complete (Cash)'),
            ),
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: () {
                sc.socket.emitWithAck(
                  'ride:cancel',
                  {'rideId': rideId, 'reason': 'client no-show'},
                  ack: (_) {},
                );
              },
              child: const Text('Cancel'),
            ),
          ],
        ),
      ),
    );
  }
}

