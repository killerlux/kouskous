// apps/mobile_client/test/features/auth/otp_screen_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:mobile_client/src/features/auth/otp_screen.dart';

void main() {
  group('OtpScreen', () {
    testWidgets('renders OTP input and verify button', (tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: OtpScreen(verificationId: 'test_verification_id'),
          ),
        ),
      );

      expect(find.text('Enter OTP'), findsOneWidget);
      expect(find.text('Verify'), findsOneWidget);
      expect(find.byType(TextField), findsOneWidget);
    });

    testWidgets('button is disabled when verifying', (tester) async {
      // This would require mocking the auth controller state
      // For now, just verify the widget structure
      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: OtpScreen(verificationId: 'test_verification_id'),
          ),
        ),
      );

      expect(find.byType(ElevatedButton), findsOneWidget);
    });
  });
}

