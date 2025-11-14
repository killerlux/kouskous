import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  static const routeName = 'login';

  @override
  Widget build(BuildContext context) {
    final controller = TextEditingController();

    return Scaffold(
      appBar: AppBar(title: const Text('Sign In')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text('Enter your phone number to continue.'),
            const SizedBox(height: 16),
            TextField(
              controller: controller,
              keyboardType: TextInputType.phone,
              decoration: const InputDecoration(
                labelText: 'Phone (+216...)',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                // TODO: Trigger Firebase phone auth flow
                context.go('/home');
              },
              child: const Text('Continue'),
            ),
          ],
        ),
      ),
    );
  }
}

