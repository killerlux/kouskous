// apps/mobile_driver/test/features/ride/ride_controls_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:mobile_driver/src/features/ride/ride_controls.dart';

void main() {
  group('RideControls', () {
    testWidgets('renders ride controls with action buttons', (tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: RideControls(rideId: 'test_ride_id'),
          ),
        ),
      );

      expect(find.text('Ride test_ride_id'), findsOneWidget);
      expect(find.text('Start'), findsOneWidget);
      expect(find.text('Complete (Cash)'), findsOneWidget);
      expect(find.text('Cancel'), findsOneWidget);
    });
  });
}

