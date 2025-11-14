# Mobile Driver (Flutter)

Driver-facing app handling real-time dispatch, earnings lock, and deposit workflows.

## Development

```bash
cd apps/mobile_driver
flutter pub get
flutter run
```

### Code generation

```bash
flutter pub run build_runner watch --delete-conflicting-outputs
```

### Key features to implement

- Firebase phone auth + JWT handoff
- Background location tracking with spoof detection warnings
- Earnings lock UI + Poste deposit upload workflow
- Dispatch socket feed (accept/decline rides)
- Offline caching with Hive

