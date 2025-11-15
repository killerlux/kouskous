// apps/mobile_client/test/features/auth/auth_controller_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_client/src/features/auth/auth_controller.dart';
import 'package:mobile_client/src/features/auth/auth_state.dart';
import 'package:mobile_client/src/features/auth/phone_auth_service.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:mocktail/mocktail.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class MockPhoneAuthService extends Mock implements PhoneAuthService {}

void main() {
  setUpAll(() async {
    // Load test environment variables
    dotenv.testLoad(fileInput: '''
API_BASE_URL=http://localhost:4000
SOCKET_URL=http://localhost:5000
GOOGLE_MAPS_API_KEY=test_key
''');
  });

  group('AuthController', () {
    late MockPhoneAuthService mockService;

    setUp(() {
      mockService = MockPhoneAuthService();
    });

    test('initial state is AuthIdle', () {
      final container = ProviderContainer();
      final controller = container.read(authControllerProvider.notifier);
      expect(container.read(authControllerProvider), isA<AuthIdle>());
      container.dispose();
    });

    test('sendCode transitions to AuthSendingCode then AuthCodeSent', () async {
      when(() => mockService.sendCode(any())).thenAnswer((_) async => 'verification_id_123');
      
      final container = ProviderContainer(
        overrides: [
          phoneAuthServiceProvider.overrideWithValue(mockService),
        ],
      );
      
      final controller = container.read(authControllerProvider.notifier);
      await controller.sendCode('+21612345678');
      
      final state = container.read(authControllerProvider);
      expect(state, isA<AuthCodeSent>());
      if (state is AuthCodeSent) {
        expect(state.verificationId, 'verification_id_123');
      }
      
      container.dispose();
    });

    test('sendCode transitions to AuthError on failure', () async {
      when(() => mockService.sendCode(any())).thenThrow(Exception('Network error'));
      
      final container = ProviderContainer(
        overrides: [
          phoneAuthServiceProvider.overrideWithValue(mockService),
        ],
      );
      
      final controller = container.read(authControllerProvider.notifier);
      await controller.sendCode('+21612345678');
      
      final state = container.read(authControllerProvider);
      expect(state, isA<AuthError>());
      
      container.dispose();
    });
  });
}

