// apps/mobile_driver/test/widget_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_driver/src/app.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

void main() {
  testWidgets('App renders without crashing', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(
      const ProviderScope(
        child: TaxiDriverApp(),
      ),
    );

    // Wait for initial frame
    await tester.pump();

    // Verify that the app renders
    expect(find.byType(TaxiDriverApp), findsOneWidget);
  });
}
