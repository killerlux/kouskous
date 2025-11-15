// apps/mobile_client/test/widget_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_client/src/app.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

void main() {
  testWidgets('App renders without crashing', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(
      const ProviderScope(
        child: TaxiClientApp(),
      ),
    );

    // Verify that the app renders
    expect(find.byType(TaxiClientApp), findsOneWidget);
  });
}
