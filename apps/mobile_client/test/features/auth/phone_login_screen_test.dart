// apps/mobile_client/test/features/auth/phone_login_screen_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:mobile_client/src/features/auth/phone_login_screen.dart';
import 'package:mobile_client/src/features/auth/auth_controller.dart';
import 'package:mobile_client/src/features/auth/auth_state.dart';

void main() {
  group('PhoneLoginScreen', () {
    testWidgets('renders phone input and send code button', (tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: PhoneLoginScreen(),
          ),
        ),
      );

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

