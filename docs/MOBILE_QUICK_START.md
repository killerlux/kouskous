# 🚀 Mobile Apps - Quick Start Guide

**Date**: 2025-01-14  
**Status**: ✅ **Prêt pour les Tests**

---

## ⚡ **Démarrage Rapide**

### **1. Prérequis**

```bash
# Vérifier Flutter
flutter --version  # Doit être >= 3.24.0

# Vérifier les dépendances
cd apps/mobile_client
flutter pub get
```

### **2. Configuration**

Les fichiers `.env` sont déjà créés avec la clé API Google Maps:
- ✅ `apps/mobile_client/.env`
- ✅ `apps/mobile_driver/.env`

**Clé API**: `AIzaSyBJhAwoY-7WSihkbqPK27Kb1jMkJgPupac` (déjà configurée)

### **3. Initialiser les Projets (Première Fois)**

```bash
# Mobile Client
cd apps/mobile_client
flutter create .

# Mobile Driver  
cd apps/mobile_driver
flutter create .
```

### **4. Configurer Android/iOS**

Suivre: `docs/ANDROID_IOS_SETUP.md`

**Résumé rapide**:
- **Android**: Ajouter la clé dans `android/app/src/main/AndroidManifest.xml`
- **iOS**: Ajouter la clé dans `ios/Runner/Info.plist`

### **5. Tester**

```bash
# Tests automatisés
./scripts/test-mobile-apps.sh all

# Ou manuellement
cd apps/mobile_client
flutter test
flutter run
```

---

## 🧪 **Tests des Fonctionnalités**

### **Test 1: Authentification**

```bash
# Lancer l'app
cd apps/mobile_client
flutter run

# Vérifier:
# 1. Écran de login s'affiche
# 2. Entrer numéro: +21612345678
# 3. Cliquer "Send Code"
# 4. Vérifier transition vers OTP
# 5. Entrer code: 000000 (dev mode)
# 6. Vérifier redirection vers Home
```

### **Test 2: Connexion API**

```bash
# Démarrer le backend
cd apps/backend
pnpm dev

# Dans l'app mobile, vérifier:
# - Les appels API fonctionnent
# - Les tokens JWT sont stockés
# - Le refresh token fonctionne
```

### **Test 3: Socket.IO**

```bash
# Démarrer le service realtime
cd apps/realtime
pnpm dev

# Dans l'app mobile, vérifier:
# - Connexion Socket.IO établie
# - Événements reçus en temps réel
```

### **Test 4: Demande de Course (Client)**

1. Sur l'écran Home
2. Entrer pickup: `36.8065,10.1815` (Tunis centre)
3. Entrer dropoff: `36.8441,10.2720` (La Marsa)
4. Cliquer "Request"
5. Vérifier que la demande est envoyée
6. Vérifier l'affichage du statut

### **Test 5: Réception d'Offres (Driver)**

1. Lancer l'app driver
2. Se connecter
3. Activer "Go Online"
4. Depuis le client, créer une demande
5. Vérifier que l'offre apparaît dans l'app driver
6. Tester Accept/Decline

### **Test 6: Contrôles de Course (Driver)**

1. Accepter une course
2. Vérifier l'écran de contrôles
3. Tester "Start"
4. Tester "Complete (Cash)"
5. Tester "Cancel"

---

## ✅ **Checklist Rapide**

- [ ] Flutter installé
- [ ] Dépendances installées (`flutter pub get`)
- [ ] Fichiers `.env` créés (déjà fait ✅)
- [ ] Backend API en cours d'exécution
- [ ] Service Realtime en cours d'exécution
- [ ] Projets Flutter initialisés (`flutter create .`)
- [ ] Android/iOS configurés (voir `ANDROID_IOS_SETUP.md`)
- [ ] Tests automatisés passent
- [ ] Tests manuels effectués

---

## 🐛 **Problèmes Courants**

### **Flutter not found**
```bash
# Installer Flutter
# https://docs.flutter.dev/get-started/install
```

### **.env file not found**
Les fichiers `.env` sont déjà créés. Si manquants:
```bash
cd apps/mobile_client
cp .env.example .env
# Puis éditer avec la clé API
```

### **API connection failed**
- Vérifier que le backend est en cours d'exécution
- Vérifier l'URL dans `.env` (10.0.2.2 pour emulator)

### **Socket.IO connection failed**
- Vérifier que le service realtime est en cours d'exécution
- Vérifier l'URL dans `.env`

---

## 📚 **Documentation Complète**

- **Testing Guide**: `docs/MOBILE_TESTING_GUIDE.md`
- **Android/iOS Setup**: `docs/ANDROID_IOS_SETUP.md`
- **Implementation Status**: `docs/MOBILE_IMPLEMENTATION_STATUS.md`
- **Ready Status**: `docs/MOBILE_APPS_READY.md`

---

**Status**: Tout est prêt! Lancez `flutter run` pour commencer! 🚀

