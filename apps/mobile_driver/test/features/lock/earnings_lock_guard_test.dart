// apps/mobile_driver/test/features/lock/earnings_lock_guard_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:mobile_driver/src/features/lock/earnings_lock_guard.dart';

void main() {
  group('EarningsLockGuard', () {
    testWidgets('renders child when not locked', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            lockProvider.overrideWith((ref) async => false),
          ],
          child: const MaterialApp(
            home: Scaffold(
              body: EarningsLockGuard(
                child: Text('Child Widget'),
              ),
            ),
          ),
        ),
      );

      expect(find.text('Child Widget'), findsOneWidget);
    });

    testWidgets('renders lock message when locked', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            lockProvider.overrideWith((ref) async => true),
          ],
          child: const MaterialApp(
            home: Scaffold(
              body: EarningsLockGuard(
                child: Text('Child Widget'),
              ),
            ),
          ),
        ),
      );

      expect(find.text('Locked: Please deposit at La Poste and upload receipt.'), findsOneWidget);
      expect(find.text('Upload Receipt'), findsOneWidget);
      expect(find.text('Child Widget'), findsNothing);
    });
  });
}

