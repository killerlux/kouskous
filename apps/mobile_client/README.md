# Mobile Client (Flutter)

Passenger-facing Flutter application for the taxi platform.

## Development

```bash
cd apps/mobile_client
flutter pub get
flutter run
```

### Code generation

```bash
flutter pub run build_runner watch --delete-conflicting-outputs
```

### Key packages

- `flutter_riverpod` – state management
- `go_router` – navigation
- `dio` – REST client using generated SDK
- `socket_io_client` – realtime events
- `freezed` + `json_serializable` – immutable models
- `hive` – local offline cache

