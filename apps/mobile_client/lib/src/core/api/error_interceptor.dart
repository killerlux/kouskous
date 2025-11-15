// apps/mobile_client/lib/src/core/api/error_interceptor.dart
import 'package:dio/dio.dart';

class ErrorInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    // Centralize API error mapping/logging
    // e.g., show snackbars, map to domain errors
    handler.next(err);
  }
}

