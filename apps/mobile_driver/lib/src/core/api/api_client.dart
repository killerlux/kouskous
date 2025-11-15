// apps/mobile_driver/lib/src/core/api/api_client.dart
import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../secure/secure_store.dart';
import 'auth_interceptor.dart';
import 'error_interceptor.dart';
import 'token_repository.dart';

class ApiClient {
  late final Dio dio;
  final SecureStore store;

  ApiClient(this.store) {
    dio = Dio(BaseOptions(
      baseUrl: dotenv.env['API_BASE_URL'] ?? 'http://localhost:4000',
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {'Content-Type': 'application/json'},
    ));
    final tokenRepo = TokenRepository(store);
    dio.interceptors.add(AuthInterceptor(store, tokenRepo));
    dio.interceptors.add(ErrorInterceptor());
  }
}

