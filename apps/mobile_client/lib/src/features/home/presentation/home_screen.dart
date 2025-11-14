import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  static const routeName = 'home';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Taxi Client')),
      body: const Center(
        child: Text('Map + nearby drivers will appear here.'),
      ),
    );
  }
}

