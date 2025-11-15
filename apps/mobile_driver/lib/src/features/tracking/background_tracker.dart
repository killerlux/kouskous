// apps/mobile_driver/lib/src/features/tracking/background_tracker.dart
import 'dart:async';
import 'dart:isolate';
import 'package:flutter_foreground_task/flutter_foreground_task.dart';
import 'package:geolocator/geolocator.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import '../../core/socket/socket_client.dart';
import '../../core/providers.dart';

typedef Reader = T Function<T>(ProviderBase<T> provider);

@pragma('vm:entry-point')
void startCallback() {
  FlutterForegroundTask.setTaskHandler(_TrackerTaskHandler());
}

class _TrackerTaskHandler extends TaskHandler {
  Timer? _timer;

  @override
  Future<void> onStart(DateTime timestamp, SendPort? sendPort) async {
    // nothing
  }

  @override
  Future<void> onEvent(DateTime timestamp, SendPort? sendPort) async {
    // not used (we use timer)
  }

  @override
  Future<void> onRepeatEvent(DateTime timestamp, SendPort? sendPort) async {}

  @override
  Future<void> onDestroy(DateTime timestamp, SendPort? sendPort) async {
    _timer?.cancel();
  }
}

class BackgroundTracker {
  final Reader read;
  BackgroundTracker(this.read);

  Future<void> start() async {
    // Permissions
    final perm = await Geolocator.checkPermission();
    if (perm == LocationPermission.denied ||
        perm == LocationPermission.deniedForever) {
      await Geolocator.requestPermission();
    }
    await Geolocator.isLocationServiceEnabled();

    // Foreground service notification (Android) - skip on web
    try {
      FlutterForegroundTask.init(
        androidNotificationOptions: AndroidNotificationOptions(
          channelId: 'driver_tracking',
          channelName: 'Driver Tracking',
          channelDescription: 'Location tracking for ride dispatch',
          channelImportance: NotificationChannelImportance.LOW,
          priority: NotificationPriority.LOW,
          isSticky: true,
        ),
        iosNotificationOptions: const IOSNotificationOptions(showNotification: true),
        foregroundTaskOptions: const ForegroundTaskOptions(
          interval: 15000,
          allowWakeLock: true,
        ),
      );

      await FlutterForegroundTask.startService(
        notificationTitle: 'You are online',
        notificationText: 'Sharing your location with passengers',
        callback: startCallback,
      );
    } catch (e) {
      // Foreground task not available on web - continue without it
    }

    // Emit GPS via Geolocator stream (battery-aware)
    final sc = read(socketProvider(SocketNamespace.driver));
    await sc.connect();
    const settings = LocationSettings(
      accuracy: LocationAccuracy.best,
      distanceFilter: 20, // meters
    );
    Geolocator.getPositionStream(locationSettings: settings).listen((pos) {
      sc.socket.emit('driver:location', {
        'lat': pos.latitude,
        'lng': pos.longitude,
        'accuracy': pos.accuracy,
        'speed': pos.speed,
        'heading': pos.heading,
        'ts': DateTime.now().toIso8601String(),
      });
    });
  }

  Future<void> stop() async {
    try {
      await FlutterForegroundTask.stopService();
    } catch (e) {
      // Ignore errors on web
    }
  }
}

