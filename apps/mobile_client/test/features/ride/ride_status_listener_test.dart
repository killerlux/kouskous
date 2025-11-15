// apps/mobile_client/test/features/ride/ride_status_listener_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:mobile_client/src/features/ride/ride_status_listener.dart';
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

