# 🧪 Mobile Apps Testing Guide

**Last Updated**: 2025-01-14  
**API Key**: Configured in `.env` files (not committed)

---

## ✅ **Configuration Complète**

### **1. Fichiers .env Créés**

Les fichiers `.env` ont été créés avec la nouvelle clé API Google Maps :
- ✅ `apps/mobile_client/.env`
- ✅ `apps/mobile_driver/.env`

**⚠️ IMPORTANT**: Ces fichiers sont dans `.gitignore` et ne seront jamais commités.

---

## 🧪 **Tests Disponibles**

### **Mobile Client Tests** (8 fichiers)

1. **Core Tests**:
   - `test/core/secure/secure_store_test.dart` - Token storage
   - `test/core/api/token_repository_test.dart` - Token refresh
   - `test/core/api/api_client_test.dart` - API client setup

2. **Auth Tests**:
   - `test/features/auth/auth_controller_test.dart` - State management
   - `test/features/auth/phone_login_screen_test.dart` - Login UI
   - `test/features/auth/otp_screen_test.dart` - OTP verification

3. **Ride Tests**:
   - `test/features/ride/ride_repository_test.dart` - Ride requests
   - `test/features/ride/ride_status_listener_test.dart` - Status updates

### **Mobile Driver Tests** (9 fichiers)

1. **Core Tests**:
   - `test/core/secure/secure_store_test.dart` - Token storage
   - `test/core/api/api_client_test.dart` - API client setup

2. **Auth Tests**:
   - `test/features/auth/auth_controller_test.dart` - State management

3. **Feature Tests**:
   - `test/features/dashboard/driver_dashboard_screen_test.dart` - Dashboard UI
   - `test/features/offers/offers_listener_test.dart` - Ride offers
   - `test/features/lock/earnings_lock_guard_test.dart` - Lock mechanism
   - `test/features/ride/ride_controls_test.dart` - Ride controls

---

## 🚀 **Comment Tester**

### **Prérequis**

1. **Installer Flutter**:
   ```bash
   # Vérifier l'installation
   flutter --version
   # Devrait être >= 3.24.0
   ```

2. **Installer les dépendances**:
   ```bash
   cd apps/mobile_client
   flutter pub get
   
   cd ../mobile_driver
   flutter pub get
   ```

### **Tests Unitaires & Widgets**

#### **Mobile Client**
```bash
cd apps/mobile_client
flutter test
```

#### **Mobile Driver**
```bash
cd apps/mobile_driver
flutter test
```

#### **Avec Couverture**
```bash
flutter test --coverage
genhtml coverage/lcov.info -o coverage/html
open coverage/html/index.html  # macOS
# ou
xdg-open coverage/html/index.html  # Linux
```

### **Tests d'Analyse de Code**

```bash
# Mobile Client
cd apps/mobile_client
flutter analyze

# Mobile Driver
cd apps/mobile_driver
flutter analyze
```

### **Tests de Formatage**

```bash
# Vérifier le formatage
flutter format --set-exit-if-changed .

# Auto-formater
flutter format .
```

---

## 📱 **Tests Manuels (Fonctionnalités)**

### **1. Authentification**

#### **Test Client App**:
1. Lancer l'app: `flutter run`
2. Vérifier l'écran de login s'affiche
3. Entrer un numéro de téléphone (+216...)
4. Cliquer sur "Send Code"
5. Vérifier la transition vers l'écran OTP
6. Entrer le code OTP
7. Vérifier la redirection vers l'écran Home

#### **Test Driver App**:
1. Lancer l'app: `flutter run`
2. Même flow que le client
3. Vérifier la redirection vers le Dashboard

### **2. Connexion API**

#### **Test Backend Connection**:
1. Démarrer le backend: `cd apps/backend && pnpm dev`
2. Dans l'app mobile, vérifier que les appels API fonctionnent
3. Vérifier les logs du backend pour les requêtes

#### **Test Socket.IO**:
1. Démarrer le service realtime: `cd apps/realtime && pnpm dev`
2. Dans l'app mobile, vérifier la connexion Socket.IO
3. Vérifier les événements reçus

### **3. Fonctionnalités Client**

#### **Demande de Course**:
1. Sur l'écran Home, entrer des coordonnées de pickup/dropoff
2. Cliquer sur "Request"
3. Vérifier que la demande est envoyée via Socket.IO
4. Vérifier l'affichage du statut de la course

#### **Écoute des Statuts**:
1. Après une demande, vérifier que les mises à jour de statut arrivent
2. Vérifier l'affichage en temps réel

### **4. Fonctionnalités Driver**

#### **Dashboard**:
1. Vérifier l'affichage du dashboard
2. Vérifier le toggle "Go Online"
3. Vérifier l'affichage des offres

#### **Réception d'Offres**:
1. Mettre le driver en ligne
2. Créer une demande de course depuis le client
3. Vérifier que l'offre apparaît dans l'app driver
4. Tester Accept/Decline

#### **Contrôles de Course**:
1. Accepter une course
2. Vérifier l'écran de contrôles
3. Tester Start/Complete/Cancel

#### **Verrouillage des Gains**:
1. Simuler un solde >= 1000 TND
2. Vérifier que le toggle "Go Online" est désactivé
3. Vérifier l'affichage du message de verrouillage

#### **Suivi GPS en Arrière-plan**:
1. Activer "Go Online"
2. Vérifier que la localisation est partagée
3. Vérifier les logs du serveur pour les mises à jour GPS

---

## 🔧 **Configuration Android/iOS**

### **Android - Google Maps**

Une fois les dossiers `android/` créés par Flutter, ajouter dans `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest>
  <application>
    <meta-data
      android:name="com.google.android.geo.API_KEY"
      android:value="AIzaSyBJhAwoY-7WSihkbqPK27Kb1jMkJgPupac"/>
  </application>
  
  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
  <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
</manifest>
```

### **iOS - Google Maps**

Dans `ios/Runner/Info.plist`:

```xml
<key>GMSApiKey</key>
<string>AIzaSyBJhAwoY-7WSihkbqPK27Kb1jMkJgPupac</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to find nearby taxis</string>
```

---

## ✅ **Checklist de Test**

### **Infrastructure**
- [ ] Flutter installé et configuré
- [ ] Dépendances installées (`flutter pub get`)
- [ ] Fichiers `.env` créés avec la clé API
- [ ] Backend API en cours d'exécution
- [ ] Service Realtime en cours d'exécution

### **Tests Automatisés**
- [ ] Tous les tests unitaires passent
- [ ] Tous les tests de widgets passent
- [ ] Analyse de code sans erreurs
- [ ] Formatage correct

### **Tests Manuels - Client**
- [ ] Login fonctionne
- [ ] OTP fonctionne
- [ ] Connexion API fonctionne
- [ ] Socket.IO connecté
- [ ] Demande de course fonctionne
- [ ] Statuts en temps réel fonctionnent

### **Tests Manuels - Driver**
- [ ] Login fonctionne
- [ ] Dashboard s'affiche
- [ ] Toggle Online/Offline fonctionne
- [ ] Réception d'offres fonctionne
- [ ] Accept/Decline fonctionne
- [ ] Contrôles de course fonctionnent
- [ ] Verrouillage des gains fonctionne
- [ ] GPS en arrière-plan fonctionne

---

## 🐛 **Dépannage**

### **Erreur: Flutter not found**
```bash
# Installer Flutter
# Voir: https://docs.flutter.dev/get-started/install
```

### **Erreur: .env file not found**
```bash
# Vérifier que les fichiers .env existent
ls -la apps/mobile_client/.env
ls -la apps/mobile_driver/.env
```

### **Erreur: API connection failed**
- Vérifier que le backend est en cours d'exécution
- Vérifier l'URL dans `.env` (10.0.2.2 pour emulator, localhost pour simulator)
- Vérifier les logs du backend

### **Erreur: Socket.IO connection failed**
- Vérifier que le service realtime est en cours d'exécution
- Vérifier l'URL dans `.env`
- Vérifier les logs du service realtime

---

## 📊 **Résultats Attendus**

### **Tests Automatisés**
- ✅ 17+ tests passent
- ✅ 0 erreurs d'analyse
- ✅ Formatage correct

### **Tests Manuels**
- ✅ Toutes les fonctionnalités principales fonctionnent
- ✅ Pas d'erreurs dans les logs
- ✅ UI responsive et fonctionnelle

---

**Status**: Prêt pour les tests! 🚀

