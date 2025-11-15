// apps/mobile_driver/lib/src/core/api/auth_interceptor.dart
import 'package:dio/dio.dart';
import '../secure/secure_store.dart';
import 'token_repository.dart';

class AuthInterceptor extends Interceptor {
  final SecureStore store;
  final TokenRepository tokenRepo;
  AuthInterceptor(this.store, this.tokenRepo);

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    final at = await store.access;
    if (at != null) {
      options.headers['Authorization'] = 'Bearer $at';
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401) {
      try {
        final newAt = await tokenRepo.refresh();
        if (newAt != null) {
          final req = err.requestOptions;
          req.headers['Authorization'] = 'Bearer $newAt';
          final dio = Dio(BaseOptions(baseUrl: req.baseUrl));
          final res = await dio.fetch(req);
          return handler.resolve(res);
        }
      } catch (_) {}
    }
    handler.next(err);
  }
}

