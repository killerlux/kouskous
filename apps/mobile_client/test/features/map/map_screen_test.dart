// apps/mobile_client/test/features/map/map_screen_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:mobile_client/src/features/map/map_screen.dart';

void main() {
  group('MapScreen', () {
    testWidgets('renders without crashing', (WidgetTester tester) async {
      // Note: Google Maps requires platform channels which are not available in unit tests
      // This test will fail if Google Maps tries to initialize
      // For full integration testing, use integration_test package
      // Skip this test in CI or mock the platform channels
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: MapScreen(),
          ),
        ),
      );
      
      // Widget should build without errors (may fail due to platform channels)
      expect(find.byType(MapScreen), findsOneWidget);
    }, skip: 'Google Maps requires platform channels not available in unit tests');
  });
}

