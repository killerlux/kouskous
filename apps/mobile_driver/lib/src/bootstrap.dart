import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:hive_flutter/hive_flutter.dart';

Future<void> bootstrap() async {
  await dotenv.load(fileName: '.env');
  await Hive.initFlutter();
}

