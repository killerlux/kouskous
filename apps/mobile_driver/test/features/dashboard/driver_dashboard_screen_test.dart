// apps/mobile_driver/test/features/dashboard/driver_dashboard_screen_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:mobile_driver/src/features/dashboard/driver_dashboard_screen.dart';

void main() {
  group('DriverDashboardScreen', () {
    testWidgets('renders dashboard with online toggle', (tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: DriverDashboardScreen(),
          ),
        ),
      );

      expect(find.text('Driver Dashboard'), findsOneWidget);
      expect(find.text('Go Online (background tracking)'), findsOneWidget);
      expect(find.byType(SwitchListTile), findsOneWidget);
    });
  });
}

