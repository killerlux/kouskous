// apps/mobile_client/test/core/api/token_repository_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_client/src/core/api/token_repository.dart';
import 'package:mobile_client/src/core/secure/secure_store.dart';
import 'package:mocktail/mocktail.dart';

class MockSecureStore extends Mock implements SecureStore {}

void main() {
  group('TokenRepository', () {
    late MockSecureStore mockStore;
    late TokenRepository repository;

    setUp(() {
      mockStore = MockSecureStore();
      repository = TokenRepository(mockStore);
    });

    test('refresh returns null when no refresh token', () async {
      when(() => mockStore.refresh).thenAnswer((_) async => null);
      final result = await repository.refresh();
      expect(result, isNull);
    });

    // Note: Full refresh test would require mocking Dio HTTP calls
    // This is a basic structure test
  });
}

