// apps/mobile_driver/test/core/api/api_client_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_driver/src/core/api/api_client.dart';
import 'package:mobile_driver/src/core/secure/secure_store.dart';
import 'package:mocktail/mocktail.dart';

class MockSecureStore extends Mock implements SecureStore {}

void main() {
  group('ApiClient', () {
    late MockSecureStore mockStore;
    late ApiClient apiClient;

    setUp(() {
      mockStore = MockSecureStore();
      when(() => mockStore.access).thenAnswer((_) async => null);
      when(() => mockStore.refresh).thenAnswer((_) async => null);
      apiClient = ApiClient(mockStore);
    });

    test('can be instantiated', () {
      expect(apiClient, isNotNull);
      expect(apiClient.dio, isNotNull);
    });

    test('dio has correct base configuration', () {
      expect(apiClient.dio.options.connectTimeout, const Duration(seconds: 10));
      expect(apiClient.dio.options.receiveTimeout, const Duration(seconds: 10));
    });
  });
}

