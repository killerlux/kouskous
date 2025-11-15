import 'package:flutter/material.dart';

import 'src/app.dart';
import 'src/bootstrap.dart';

Future<void> main() async {
  await bootstrap();
  runApp(const TaxiDriverApp());
}

