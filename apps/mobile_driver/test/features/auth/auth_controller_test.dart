// apps/mobile_driver/test/features/auth/auth_controller_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_driver/src/features/auth/auth_controller.dart';
import 'package:mobile_driver/src/features/auth/auth_state.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

void main() {
  group('AuthController', () {
    test('initial state is AuthIdle', () {
      final container = ProviderContainer();
      expect(container.read(authControllerProvider), isA<AuthIdle>());
      container.dispose();
    });
  });
}

