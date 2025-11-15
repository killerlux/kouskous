# Mobile Client App

Flutter app for passengers to request and track taxi rides.

## Setup

### 1. Environment Configuration

Create a `.env` file in this directory:

```bash
cat > .env << 'EOF'
API_BASE_URL=http://10.0.2.2:4000
SOCKET_URL=http://10.0.2.2:5000
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
EOF
```

**⚠️ SECURITY**: Never commit `.env` files. They are in `.gitignore`.

### 2. Install Dependencies

```bash
flutter pub get
```

### 3. Run

```bash
flutter run
```

### 4. Run Tests

```bash
flutter test
```

## Environment Variables

- `API_BASE_URL`: Backend API URL
  - Android emulator: `http://10.0.2.2:4000`
  - iOS simulator: `http://localhost:4000`
  - Physical device: `http://YOUR_LOCAL_IP:4000`

- `SOCKET_URL`: Realtime Socket.IO URL
  - Android emulator: `http://10.0.2.2:5000`
  - iOS simulator: `http://localhost:5000`
  - Physical device: `http://YOUR_LOCAL_IP:5000`

- `GOOGLE_MAPS_API_KEY`: Google Maps API key from Google Cloud Console

## Firebase Setup

1. Run `flutterfire configure` to set up Firebase
2. Enable Phone Authentication in Firebase Console
3. Add your app's package name and SHA-1 fingerprint

## See Also

- [Security Guide](../../docs/SECURITY_GUIDE.md)
- [Mobile Implementation Status](../../docs/MOBILE_IMPLEMENTATION_STATUS.md)
