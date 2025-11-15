// apps/mobile_client/test/widget_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_client/src/app.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

void main() {
  setUpAll(() async {
    // Load test environment variables
    dotenv.testLoad(fileInput: '''
API_BASE_URL=http://localhost:4000
SOCKET_URL=http://localhost:5000
GOOGLE_MAPS_API_KEY=test_key
''');
  });

  testWidgets('App renders without crashing', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    // Note: This test may fail if Firebase/Hive initialization is required
    // For full testing, use integration_test package
    await tester.pumpWidget(
      const ProviderScope(
        child: TaxiClientApp(),
      ),
    );

    // Wait for initial frame and router initialization
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 100));

    // Verify that the app renders (may show error screen if Firebase not initialized)
    expect(find.byType(TaxiClientApp), findsOneWidget);
  }, skip: 'Requires Firebase/Hive initialization - use integration_test for full testing');
}
