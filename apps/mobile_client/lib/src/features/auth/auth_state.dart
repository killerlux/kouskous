// apps/mobile_client/lib/src/features/auth/auth_state.dart
sealed class AuthState {}

class AuthIdle extends AuthState {}

class AuthSendingCode extends AuthState {}

class AuthCodeSent extends AuthState {
  final String verificationId;
  AuthCodeSent(this.verificationId);
}

class AuthVerifying extends AuthState {}

class AuthAuthenticated extends AuthState {}

class AuthError extends AuthState {
  final String message;
  AuthError(this.message);
}

