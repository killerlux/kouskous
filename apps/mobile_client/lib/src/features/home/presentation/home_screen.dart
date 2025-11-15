import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import '../../ride/ride_repository.dart';
import '../../ride/ride_status_listener.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  final _pickupCtrl = TextEditingController(text: '36.8065,10.1815');
  final _dropoffCtrl = TextEditingController(text: '36.8441,10.2720');

  @override
  Widget build(BuildContext context) {
    final rideRepo = ref.read(rideRepoProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('Request a Ride')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: _pickupCtrl,
              decoration: const InputDecoration(
                labelText: 'Pickup lat,lng',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _dropoffCtrl,
              decoration: const InputDecoration(
                labelText: 'Dropoff lat,lng',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: () async {
                final p = _pickupCtrl.text.split(',');
                final d = _dropoffCtrl.text.split(',');
                final id = await rideRepo.requestRide(
                  double.parse(p[0]),
                  double.parse(p[1]),
                  double.parse(d[0]),
                  double.parse(d[1]),
                );
                if (!context.mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(id != null ? 'Ride $id requested' : 'Ride request failed'),
                  ),
                );
              },
              child: const Text('Request'),
            ),
            const Divider(),
            const Expanded(child: RideStatusListener()),
          ],
        ),
      ),
    );
  }
}

