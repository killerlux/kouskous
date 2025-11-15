// apps/mobile_driver/test/features/offers/offers_listener_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:mobile_driver/src/features/offers/offers_listener.dart';

void main() {
  group('OffersListener', () {
    testWidgets('renders waiting message', (tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: OffersListener(),
          ),
        ),
      );

      expect(find.text('Waiting for offers…'), findsOneWidget);
    });
  });
}

