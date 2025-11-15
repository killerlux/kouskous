// apps/mobile_driver/lib/src/features/lock/earnings_lock_guard.dart
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import '../../core/providers.dart';

final lockProvider = FutureProvider<bool>((ref) async {
  final api = ref.read(apiClientProvider).dio;
  try {
    final res = await api.get('/drivers/me');
    final locked = (res.data?['locked'] as bool?) ?? false;
    return locked;
  } catch (e) {
    return false;
  }
});

class EarningsLockGuard extends ConsumerWidget {
  final Widget child;
  const EarningsLockGuard({super.key, required this.child});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final locked = ref.watch(lockProvider).value ?? false;
    if (locked) {
      return Card(
        margin: const EdgeInsets.all(12),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            children: [
              const Text(
                'Locked: Please deposit at La Poste and upload receipt.',
              ),
              const SizedBox(height: 8),
              ElevatedButton(
                onPressed: () {},
                child: const Text('Upload Receipt'),
              ),
            ],
          ),
        ),
      );
    }
    return child;
  }
}

