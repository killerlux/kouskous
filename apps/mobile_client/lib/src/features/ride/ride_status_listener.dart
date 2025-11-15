// apps/mobile_client/lib/src/features/ride/ride_status_listener.dart
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import '../../core/socket/socket_client.dart';
import '../../core/providers.dart';

class RideStatusListener extends ConsumerStatefulWidget {
  const RideStatusListener({super.key});

  @override
  ConsumerState<RideStatusListener> createState() =>
      _RideStatusListenerState();
}

class _RideStatusListenerState extends ConsumerState<RideStatusListener> {
  String status = 'idle';

  @override
  void initState() {
    super.initState();
    // Use WidgetsBinding to ensure ref is available
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final sc = ref.read(socketProvider(SocketNamespace.client));
      sc.connect().then((_) {
        sc.socket.on('ride:status', (data) {
          if (mounted) {
            setState(() {
              status = data?['status'] ?? 'unknown';
            });
          }
        });
      });
    });
  }

  @override
  Widget build(BuildContext context) =>
      Center(child: Text('Ride status: $status'));
}

