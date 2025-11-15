# 📱 Android & iOS Configuration Guide

**Last Updated**: 2025-01-14  
**Google Maps API Key**: `AIzaSyBJhAwoY-7WSihkbqPK27Kb1jMkJgPupac`

---

## ⚠️ **Important**

Les dossiers `android/` et `ios/` seront créés automatiquement quand vous exécuterez `flutter create` ou `flutter run` pour la première fois.

---

## 🤖 **Android Configuration**

### **1. Créer le projet Android (si pas déjà fait)**

```bash
cd apps/mobile_client  # ou mobile_driver
flutter create .
```

### **2. Configurer AndroidManifest.xml**

Éditer `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
  <!-- Permissions -->
  <uses-permission android:name="android.permission.INTERNET"/>
  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
  <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
  
  <!-- Driver app only: Background location -->
  <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION"/>
  <uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
  <uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION"/>

  <application
    android:label="Taxi Client"  <!-- ou "Taxi Driver" -->
    android:name="${applicationName}"
    android:icon="@mipmap/ic_launcher">
    
    <!-- Google Maps API Key -->
    <meta-data
      android:name="com.google.android.geo.API_KEY"
      android:value="AIzaSyBJhAwoY-7WSihkbqPK27Kb1jMkJgPupac"/>
    
    <!-- Driver app: Foreground service -->
    <service
      android:name="com.pravera.flutter_foreground_task.service.ForegroundService"
      android:foregroundServiceType="location"
      android:exported="false"/>
    
    <activity
      android:name=".MainActivity"
      android:exported="true"
      android:launchMode="singleTop"
      android:theme="@style/LaunchTheme"
      android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
      android:hardwareAccelerated="true"
      android:windowSoftInputMode="adjustResize">
      <meta-data
        android:name="io.flutter.embedding.android.NormalTheme"
        android:resource="@style/NormalTheme"/>
      <intent-filter>
        <action android:name="android.intent.action.MAIN"/>
        <category android:name="android.intent.category.LAUNCHER"/>
      </intent-filter>
    </activity>
    
    <meta-data
      android:name="flutterEmbedding"
      android:value="2"/>
  </application>
</manifest>
```

### **3. Configurer build.gradle**

Vérifier `android/app/build.gradle`:

```gradle
android {
    compileSdkVersion 34
    minSdkVersion 21  // Minimum pour Google Maps
    targetSdkVersion 34
    
    defaultConfig {
        applicationId "tn.yourdomain.taxi.client"  // ou .driver
        minSdkVersion 21
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }
}
```

---

## 🍎 **iOS Configuration**

### **1. Créer le projet iOS (si pas déjà fait)**

```bash
cd apps/mobile_client  # ou mobile_driver
flutter create .
```

### **2. Configurer Info.plist**

Éditer `ios/Runner/Info.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <!-- Google Maps API Key -->
  <key>GMSApiKey</key>
  <string>AIzaSyBJhAwoY-7WSihkbqPK27Kb1jMkJgPupac</string>
  
  <!-- Location Permissions -->
  <key>NSLocationWhenInUseUsageDescription</key>
  <string>We need your location to find nearby taxis and provide accurate ETAs.</string>
  
  <!-- Driver app: Background location -->
  <key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
  <string>Background location is used to update passengers about your position while online.</string>
  
  <!-- Background Modes (Driver app only) -->
  <key>UIBackgroundModes</key>
  <array>
    <string>location</string>
  </array>
  
  <!-- Other standard Flutter keys -->
  <key>CFBundleDevelopmentRegion</key>
  <string>$(DEVELOPMENT_LANGUAGE)</string>
  <key>CFBundleDisplayName</key>
  <string>Taxi Client</string>  <!-- ou "Taxi Driver" -->
  <key>CFBundleExecutable</key>
  <string>$(EXECUTABLE_NAME)</string>
  <key>CFBundleIdentifier</key>
  <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
  <key>CFBundleInfoDictionaryVersion</key>
  <string>6.0</string>
  <key>CFBundleName</key>
  <string>taxi_client</string>  <!-- ou taxi_driver -->
  <key>CFBundlePackageType</key>
  <string>APPL</string>
  <key>CFBundleShortVersionString</key>
  <string>$(FLUTTER_BUILD_NAME)</string>
  <key>CFBundleSignature</key>
  <string>????</string>
  <key>CFBundleVersion</key>
  <string>$(FLUTTER_BUILD_NUMBER)</string>
  <key>LSRequiresIPhoneOS</key>
  <true/>
  <key>UILaunchStoryboardName</key>
  <string>LaunchScreen</string>
  <key>UIMainStoryboardFile</key>
  <string>Main</string>
  <key>UISupportedInterfaceOrientations</key>
  <array>
    <string>UIInterfaceOrientationPortrait</string>
    <string>UIInterfaceOrientationLandscapeLeft</string>
    <string>UIInterfaceOrientationLandscapeRight</string>
  </array>
  <key>UISupportedInterfaceOrientations~ipad</key>
  <array>
    <string>UIInterfaceOrientationPortrait</string>
    <string>UIInterfaceOrientationPortraitUpsideDown</string>
    <string>UIInterfaceOrientationLandscapeLeft</string>
    <string>UIInterfaceOrientationLandscapeRight</string>
  </array>
  <key>CADisableMinimumFrameDurationOnPhone</key>
  <true/>
  <key>UIApplicationSupportsIndirectInputEvents</key>
  <true/>
</dict>
</plist>
```

### **3. Configurer AppDelegate.swift**

Éditer `ios/Runner/AppDelegate.swift` (si existe) ou créer:

```swift
import UIKit
import Flutter
import GoogleMaps

@UIApplicationMain
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    // Initialize Google Maps
    if let path = Bundle.main.path(forResource: "Info", ofType: "plist"),
       let plist = NSDictionary(contentsOfFile: path),
       let apiKey = plist["GMSApiKey"] as? String {
      GMSServices.provideAPIKey(apiKey)
    }
    
    GeneratedPluginRegistrant.register(with: self)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}
```

---

## 🔑 **Restrictions de la Clé API**

### **Dans Google Cloud Console**

1. Aller sur: https://console.cloud.google.com/google/maps-apis/credentials
2. Sélectionner la clé: `AIzaSyBJhAwoY-7WSihkbqPK27Kb1jMkJgPupac`
3. Configurer les restrictions:

#### **Restrictions d'Application**:
- **Android**: 
  - Package name: `tn.yourdomain.taxi.client` (et `.driver`)
  - SHA-1 fingerprint: (obtenir avec `keytool -list -v -keystore ~/.android/debug.keystore`)
- **iOS**: 
  - Bundle ID: `tn.yourdomain.taxi.client` (et `.driver`)

#### **Restrictions d'API**:
- ✅ Maps SDK for Android
- ✅ Maps SDK for iOS
- ✅ Geocoding API
- ✅ Directions API
- ✅ Distance Matrix API
- ✅ Roads API (optionnel, pour road snapping)

---

## ✅ **Vérification**

### **Android**
```bash
cd apps/mobile_client
flutter run -d android
# Vérifier que la carte Google Maps s'affiche
```

### **iOS**
```bash
cd apps/mobile_client
flutter run -d ios
# Vérifier que la carte Google Maps s'affiche
```

---

## 📝 **Notes**

- La clé API est aussi dans les fichiers `.env` pour usage dans le code Dart
- Les fichiers de configuration Android/iOS utilisent la clé directement
- Assurez-vous de restreindre la clé dans Google Cloud Console

---

**Status**: Configuration prête! Créez les projets Flutter avec `flutter create` pour générer les dossiers android/ios. 🚀

