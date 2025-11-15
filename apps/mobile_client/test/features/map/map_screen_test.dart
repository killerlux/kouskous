// apps/mobile_client/test/features/map/map_screen_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:mobile_client/src/features/map/map_screen.dart';

void main() {
  group('MapScreen', () {
    testWidgets('renders without crashing', (WidgetTester tester) async {
      // Note: Google Maps requires platform channels which are not available in unit tests
      // This test verifies the widget can be instantiated
      // For full integration testing, use integration_test package
      await tester.pumpWidget(
        const MaterialApp(
          home: MapScreen(),
        ),
      );
      
      // Widget should build without errors
      expect(find.byType(MapScreen), findsOneWidget);
    });
  });
}

