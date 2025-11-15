// apps/mobile_driver/lib/src/core/secure/secure_store.dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStore {
  static const _storage = FlutterSecureStorage();
  static const accessKey = 'access_token';
  static const refreshKey = 'refresh_token';

  Future<void> saveTokens(String access, String refresh) async {
    await _storage.write(key: accessKey, value: access);
    await _storage.write(key: refreshKey, value: refresh);
  }

  Future<String?> get access async => _storage.read(key: accessKey);
  Future<String?> get refresh async => _storage.read(key: refreshKey);

  Future<void> clear() async {
    await _storage.delete(key: accessKey);
    await _storage.delete(key: refreshKey);
  }
}

