import 'package:flutter/foundation.dart' show kIsWeb, kDebugMode;
import 'package:flutter/widgets.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:firebase_core/firebase_core.dart';

Future<void> bootstrap() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await dotenv.load(fileName: '.env');
  } catch (e) {
    // .env file might not exist in test environment
  }
  
  // Hive only works on mobile, skip on web
  if (!kIsWeb) {
    await Hive.initFlutter();
  }
  
  // Firebase initialization - skip if firebase_options.dart doesn't exist
  try {
    await Firebase.initializeApp();
  } catch (e) {
    // Firebase not configured yet - app can still run without it for development
    if (kDebugMode) {
      print('⚠️ Firebase not initialized: $e');
    }
  }
}

