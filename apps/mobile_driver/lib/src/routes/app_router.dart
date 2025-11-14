import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../features/auth/presentation/phone_login_screen.dart';
import '../features/earnings/presentation/earnings_lock_screen.dart';
import '../features/presence/presentation/dashboard_screen.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/login',
    routes: [
      GoRoute(
        path: '/login',
        name: PhoneLoginScreen.routeName,
        builder: (_, __) => const PhoneLoginScreen(),
      ),
      GoRoute(
        path: '/dashboard',
        name: DashboardScreen.routeName,
        builder: (_, __) => const DashboardScreen(),
      ),
      GoRoute(
        path: '/lock',
        name: EarningsLockScreen.routeName,
        builder: (_, __) => const EarningsLockScreen(),
      ),
    ],
    errorBuilder: (_, state) => Scaffold(
      body: Center(child: Text(state.error.toString())),
    ),
    redirect: (context, state) {
      // TODO: add auth + earnings lock guards.
      return null;
    },
  );
});

