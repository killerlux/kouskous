import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../features/auth/phone_login_screen.dart';
import '../features/auth/otp_screen.dart';
import '../features/dashboard/driver_dashboard_screen.dart';
import '../features/ride/ride_controls.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const PhoneLoginScreen(),
    ),
    GoRoute(
      path: '/otp',
      builder: (context, state) => OtpScreen(
        verificationId: state.extra as String,
      ),
    ),
    GoRoute(
      path: '/dashboard',
      builder: (context, state) => const DriverDashboardScreen(),
    ),
    GoRoute(
      path: '/ride/:id',
      builder: (context, state) => RideControls(
        rideId: state.pathParameters['id']!,
      ),
    ),
  ],
  errorBuilder: (context, state) => Scaffold(
    body: Center(child: Text(state.error.toString())),
  ),
);

