// apps/mobile_driver/lib/src/features/auth/phone_auth_service.dart
import 'dart:async';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import '../../core/secure/secure_store.dart';
import '../../core/providers.dart';

final phoneAuthServiceProvider = Provider<PhoneAuthService>((ref) {
  return PhoneAuthService(ref.read(secureStoreProvider));
});

class PhoneAuthService {
  final SecureStore store;
  final _auth = FirebaseAuth.instance;

  PhoneAuthService(this.store);

  Future<String> sendCode(String phoneE164) async {
    final completer = Completer<String>();
    await _auth.verifyPhoneNumber(
      phoneNumber: phoneE164,
      verificationCompleted: (_) {},
      verificationFailed: (e) => completer.completeError(e),
      codeSent: (vid, _) => completer.complete(vid),
      codeAutoRetrievalTimeout: (vid) {
        if (!completer.isCompleted) completer.complete(vid);
      },
    );
    return completer.future;
  }

  Future<void> confirmCode(String verificationId, String smsCode) async {
    final cred = PhoneAuthProvider.credential(
      verificationId: verificationId,
      smsCode: smsCode,
    );
    await _auth.signInWithCredential(cred);
    final idToken = await _auth.currentUser?.getIdToken();
    final http = Dio(BaseOptions(
      baseUrl: dotenv.env['API_BASE_URL'] ?? 'http://localhost:4000',
    ));
    final res = await http.post('/auth/exchange-token', data: {
      'firebase_id_token': idToken,
    });
    await store.saveTokens(
      res.data['access_token'],
      res.data['refresh_token'],
    );
  }
}

