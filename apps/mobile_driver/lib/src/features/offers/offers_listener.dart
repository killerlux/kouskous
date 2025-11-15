// apps/mobile_driver/lib/src/features/offers/offers_listener.dart
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/socket/socket_client.dart';
import '../../core/providers.dart';
import '../ride/ride_controls.dart';

class OffersListener extends ConsumerStatefulWidget {
  const OffersListener({super.key});

  @override
  ConsumerState<OffersListener> createState() => _OffersListenerState();
}

class _OffersListenerState extends ConsumerState<OffersListener> {
  @override
  void initState() {
    super.initState();
    // Use WidgetsBinding to ensure ref is available
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final sc = ref.read(socketProvider(SocketNamespace.driver));
      sc.connect().then((_) {
        sc.socket.on('ride:offer', (data, [ack]) async {
          if (!mounted) return;
          final accepted = await showDialog<bool>(
            context: context,
            builder: (_) => AlertDialog(
              title: const Text('New Ride Offer'),
              content: Text(
                'Pickup: ${data['pickup']}  Fare: ${data['est_fare'] ?? '-'}',
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context, false),
                  child: const Text('Decline'),
                ),
                ElevatedButton(
                  onPressed: () => Navigator.pop(context, true),
                  child: const Text('Accept'),
                ),
              ],
            ),
          ) ?? false;

          if (accepted) {
            sc.socket.emitWithAck('ride:accept', {'rideId': data['rideId']},
                ack: (resp) {});
            if (!mounted) return;
            context.push('/ride/${data['rideId']}');
          } else {
            sc.socket.emitWithAck('ride:decline', {'rideId': data['rideId']},
                ack: (resp) {});
          }
        });
        sc.socket.on('system:lock', (_) {
          if (!mounted) return;
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Earnings lock reached')),
          );
        });
      });
    });
  }

  @override
  Widget build(BuildContext context) =>
      const Center(child: Text('Waiting for offers…'));
}

