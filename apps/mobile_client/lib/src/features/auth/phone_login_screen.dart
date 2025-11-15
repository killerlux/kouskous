// apps/mobile_client/lib/src/features/auth/phone_login_screen.dart
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'auth_controller.dart';
import 'auth_state.dart';

class PhoneLoginScreen extends ConsumerStatefulWidget {
  const PhoneLoginScreen({super.key});

  @override
  ConsumerState<PhoneLoginScreen> createState() => _PhoneLoginScreenState();
}

class _PhoneLoginScreenState extends ConsumerState<PhoneLoginScreen> {
  final _ctrl = TextEditingController(text: '+216');

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(authControllerProvider);
    final busy = state is AuthSendingCode;

    return Scaffold(
      appBar: AppBar(title: const Text('Login')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: _ctrl,
              keyboardType: TextInputType.phone,
              decoration: const InputDecoration(
                labelText: 'Phone (+216...)',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: busy
                  ? null
                  : () async {
                      await ref
                          .read(authControllerProvider.notifier)
                          .sendCode(_ctrl.text.trim());
                      final s = ref.read(authControllerProvider);
                      if (s is AuthCodeSent) {
                        if (!context.mounted) return;
                        context.push('/otp', extra: s.verificationId);
                      } else if (s is AuthError) {
                        if (!context.mounted) return;
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text(s.message)),
                        );
                      }
                    },
              child: busy
                  ? const CircularProgressIndicator()
                  : const Text('Send Code'),
            ),
          ],
        ),
      ),
    );
  }
}

