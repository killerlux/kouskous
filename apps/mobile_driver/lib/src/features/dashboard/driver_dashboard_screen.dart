// apps/mobile_driver/lib/src/features/dashboard/driver_dashboard_screen.dart
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import '../offers/offers_listener.dart';
import '../lock/earnings_lock_guard.dart';
import '../tracking/background_tracker.dart';
import '../../core/providers.dart';

class DriverDashboardScreen extends ConsumerStatefulWidget {
  const DriverDashboardScreen({super.key});

  @override
  ConsumerState<DriverDashboardScreen> createState() =>
      _DriverDashboardScreenState();
}

class _DriverDashboardScreenState
    extends ConsumerState<DriverDashboardScreen> {
  bool online = false;

  @override
  Widget build(BuildContext context) {
    final tracker = ref.read(backgroundTrackerProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('Driver Dashboard')),
      body: Column(
        children: [
          EarningsLockGuard(
            child: SwitchListTile(
              title: const Text('Go Online (background tracking)'),
              value: online,
              onChanged: (v) async {
                if (v) {
                  await tracker.start();
                } else {
                  await tracker.stop();
                }
                setState(() => online = v);
              },
            ),
          ),
          const Expanded(child: OffersListener()),
        ],
      ),
    );
  }
}

