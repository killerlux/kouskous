// apps/mobile_driver/lib/src/core/providers.dart
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'secure/secure_store.dart';
import 'api/api_client.dart';
import 'socket/socket_client.dart';
import '../features/tracking/background_tracker.dart';

final secureStoreProvider = Provider((_) => SecureStore());
final apiClientProvider = Provider((ref) => ApiClient(ref.read(secureStoreProvider)));
final socketProvider = Provider.family<SocketClient, SocketNamespace>((ref, ns) {
  final store = ref.read(secureStoreProvider);
  return SocketClient(store, ns);
});
final backgroundTrackerProvider = Provider((ref) => BackgroundTracker(ref.read(socketProvider(SocketNamespace.driver))));

