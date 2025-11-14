import 'package:flutter/material.dart';

class EarningsLockScreen extends StatelessWidget {
  const EarningsLockScreen({super.key});

  static const routeName = 'earnings-lock';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Earnings Locked')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'You have reached 1000 TND. Upload your Poste deposit receipt to unlock availability.',
            ),
            const SizedBox(height: 24),
            OutlinedButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.camera_alt_outlined),
              label: const Text('Upload Receipt Photo'),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {},
              child: const Text('Submit for Review'),
            ),
          ],
        ),
      ),
    );
  }
}

