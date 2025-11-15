// apps/mobile_driver/lib/src/features/auth/phone_auth_service.dart
import 'dart:async';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
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
  FirebaseAuth? _auth;

  PhoneAuthService(this.store) {
    // Only initialize FirebaseAuth if Firebase is initialized
    try {
      Firebase.app(); // Check if Firebase is initialized
      _auth = FirebaseAuth.instance;
    } catch (e) {
      // Firebase not initialized - _auth will remain null
      _auth = null;
    }
  }

  Future<String> sendCode(String phoneE164) async {
    if (_auth == null) {
      throw Exception('Firebase not initialized. Please configure Firebase first.');
    }
    final completer = Completer<String>();
    await _auth!.verifyPhoneNumber(
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
    if (_auth == null) {
      throw Exception('Firebase not initialized. Please configure Firebase first.');
    }
    final cred = PhoneAuthProvider.credential(
      verificationId: verificationId,
      smsCode: smsCode,
    );
    await _auth!.signInWithCredential(cred);
    final idToken = await _auth!.currentUser?.getIdToken();
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

