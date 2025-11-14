import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData light() {
    final base = ThemeData.light(useMaterial3: true);
    return base.copyWith(
      colorScheme: base.colorScheme.copyWith(
        primary: const Color(0xff006b54),
        secondary: const Color(0xfff4a100),
      ),
      appBarTheme: const AppBarTheme(centerTitle: true),
    );
  }

  static ThemeData dark() {
    final base = ThemeData.dark(useMaterial3: true);
    return base.copyWith(
      colorScheme: base.colorScheme.copyWith(
        primary: const Color(0xff4dd0e1),
        secondary: const Color(0xffffca28),
      ),
      appBarTheme: const AppBarTheme(centerTitle: true),
    );
  }
}

