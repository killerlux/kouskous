import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  static const routeName = 'driver-dashboard';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Driver Dashboard'),
        actions: [
          IconButton(
            onPressed: () => context.go('/lock'),
            icon: const Icon(Icons.lock),
          ),
        ],
      ),
      body: const Center(
        child: Text('Online status, live jobs, and GPS accuracy warnings.'),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        label: const Text('Toggle Availability'),
        icon: const Icon(Icons.power_settings_new),
      ),
    );
  }
}

