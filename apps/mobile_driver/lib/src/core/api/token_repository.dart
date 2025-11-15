// apps/mobile_driver/lib/src/core/api/token_repository.dart
import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../secure/secure_store.dart';

class TokenRepository {
  final SecureStore store;
  final Dio http;

  TokenRepository(this.store)
      : http = Dio(BaseOptions(baseUrl: dotenv.env['API_BASE_URL']!));

  Future<String?> refresh() async {
    final rt = await store.refresh;
    if (rt == null) return null;
    try {
      final res = await http.post('/auth/refresh', data: {
        'refresh_token': rt,
      });
      final at = res.data['access_token'] as String;
      final newRt = res.data['refresh_token'] as String? ?? rt;
      await store.saveTokens(at, newRt);
      return at;
    } catch (e) {
      return null;
    }
  }
}

