// apps/mobile_client/lib/src/features/auth/auth_controller.dart
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'auth_state.dart';
import 'phone_auth_service.dart';

final authControllerProvider =
    NotifierProvider<AuthController, AuthState>(() => AuthController());

class AuthController extends Notifier<AuthState> {
  late final PhoneAuthService _svc;

  @override
  AuthState build() {
    _svc = ref.read(phoneAuthServiceProvider);
    return AuthIdle();
  }

  Future<void> sendCode(String phoneE164) async {
    state = AuthSendingCode();
    try {
      final vid = await _svc.sendCode(phoneE164);
      state = AuthCodeSent(vid);
    } catch (e) {
      state = AuthError('Cannot send code: ${e.toString()}');
    }
  }

  Future<void> confirmCode(String verificationId, String smsCode) async {
    state = AuthVerifying();
    try {
      await _svc.confirmCode(verificationId, smsCode);
      state = AuthAuthenticated();
    } catch (e) {
      state = AuthError('Invalid code: ${e.toString()}');
    }
  }
}

