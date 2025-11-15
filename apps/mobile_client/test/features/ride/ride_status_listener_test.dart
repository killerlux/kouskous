// apps/mobile_client/test/features/ride/ride_status_listener_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:mobile_client/src/features/ride/ride_status_listener.dart';

void main() {
  group('RideStatusListener', () {
    testWidgets('renders initial status', (tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: RideStatusListener(),
            ),
          ),
        ),
      );

      // Wait for post-frame callback to execute
      await tester.pump();

      expect(find.textContaining('Ride status:'), findsOneWidget);
    });
  });
}

