// apps/mobile_client/test/features/auth/phone_login_screen_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:mobile_client/src/features/auth/phone_login_screen.dart';
import 'package:mobile_client/src/features/auth/auth_controller.dart';
import 'package:mobile_client/src/features/auth/auth_state.dart';
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

  group('PhoneLoginScreen', () {
    testWidgets('renders phone input and send code button', (tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: PhoneLoginScreen(),
          ),
        ),
      );

      await tester.pump();

      expect(find.text('Send Code'), findsOneWidget);
      expect(find.byType(TextField), findsOneWidget);
    });

    testWidgets('button is disabled when sending code', (tester) async {
      final container = ProviderContainer(
        overrides: [
          authControllerProvider.overrideWith(() => AuthController()..state = AuthSendingCode()),
        ],
      );

      await tester.pumpWidget(
        ProviderScope(
          parent: container,
          child: const MaterialApp(
            home: PhoneLoginScreen(),
          ),
        ),
      );

      final button = tester.widget<ElevatedButton>(find.byType(ElevatedButton));
      expect(button.onPressed, isNull);
      
      container.dispose();
    });
  });
}

