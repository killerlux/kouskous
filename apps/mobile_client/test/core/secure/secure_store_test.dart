// apps/mobile_client/test/core/secure/secure_store_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_client/src/core/secure/secure_store.dart';

void main() {
  group('SecureStore', () {
    late SecureStore store;

    setUp(() {
      store = SecureStore();
    });

    test('save and read tokens', () async {
      await store.saveTokens('access_token_123', 'refresh_token_456');
      expect(await store.access, 'access_token_123');
      expect(await store.refresh, 'refresh_token_456');
    });

    test('clear tokens', () async {
      await store.saveTokens('access_token_123', 'refresh_token_456');
      await store.clear();
      expect(await store.access, isNull);
      expect(await store.refresh, isNull);
    });

    test('returns null when no tokens stored', () async {
      expect(await store.access, isNull);
      expect(await store.refresh, isNull);
    });
  });
}

