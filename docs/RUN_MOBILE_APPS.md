# 🚀 Guide pour Lancer les Applications Mobiles

**Date**: 2025-01-14

---

## 📱 **Applications Disponibles**

1. **Mobile Client** - Application pour les passagers
2. **Mobile Driver** - Application pour les chauffeurs

---

## 🔧 **Prérequis**

### **1. Flutter Installé**

Vérifiez que Flutter est installé :
```bash
flutter --version
```

Si Flutter n'est pas installé, suivez : https://docs.flutter.dev/get-started/install

### **2. Émulateur/Simulateur ou Appareil Physique**

#### **Android**
```bash
# Vérifier les appareils disponibles
flutter devices

# Démarrer un émulateur Android
# (via Android Studio ou commande)
```

#### **iOS** (macOS uniquement)
```bash
# Vérifier les simulateurs disponibles
flutter devices

# Ouvrir Simulator
open -a Simulator
```

#### **Web** (pour test rapide)
```bash
# Lancer sur Chrome
flutter run -d chrome
```

---

## 🚀 **Lancer l'Application Client**

### **1. Préparer l'environnement**

```bash
cd apps/mobile_client

# Créer le fichier .env si nécessaire
cp .env.example .env
# Puis éditez .env avec vos valeurs :
# API_BASE_URL=http://localhost:4000
# SOCKET_URL=http://localhost:5000
# GOOGLE_MAPS_API_KEY=votre_clé_api
```

### **2. Installer les dépendances**

```bash
flutter pub get
```

### **3. Lancer l'application**

#### **Sur Web (Chrome)**
```bash
flutter run -d chrome --web-port=8080
```
Ouvrez ensuite : http://localhost:8080

#### **Sur Android**
```bash
# Assurez-vous qu'un émulateur est démarré
flutter devices
flutter run -d <device-id>
```

#### **Sur iOS** (macOS uniquement)
```bash
# Assurez-vous qu'un simulateur est démarré
flutter devices
flutter run -d <device-id>
```

---

## 🚖 **Lancer l'Application Driver**

### **1. Préparer l'environnement**

```bash
cd apps/mobile_driver

# Créer le fichier .env si nécessaire
cp .env.example .env
# Puis éditez .env avec vos valeurs
```

### **2. Installer les dépendances**

```bash
flutter pub get
```

### **3. Lancer l'application**

Même processus que pour l'app client :
```bash
flutter run -d chrome --web-port=8081
```

---

## ⚙️ **Configuration**

### **Fichier .env**

Chaque app nécessite un fichier `.env` avec :

```env
# Backend API URL
API_BASE_URL=http://localhost:4000

# Realtime Socket.IO URL
SOCKET_URL=http://localhost:5000

# Google Maps API Key
GOOGLE_MAPS_API_KEY=AIzaSyBJhAwoY-7WSihkbqPK27Kb1jMkJgPupac
```

### **Pour Android Emulator**
- `API_BASE_URL=http://10.0.2.2:4000` (au lieu de localhost)
- `SOCKET_URL=http://10.0.2.2:5000`

### **Pour iOS Simulator**
- `API_BASE_URL=http://localhost:4000`
- `SOCKET_URL=http://localhost:5000`

### **Pour Appareil Physique**
- Utilisez l'IP locale de votre machine (ex: `http://192.168.1.100:4000`)

---

## 🔥 **Backend et Realtime Services**

Les apps mobiles nécessitent que les services backend soient démarrés :

### **1. Backend API** (port 4000)
```bash
cd apps/backend
pnpm start:dev
```

### **2. Realtime Service** (port 5000)
```bash
cd apps/realtime
pnpm start:dev
```

---

## 🐛 **Dépannage**

### **Erreur: "No devices found"**
- Vérifiez que Flutter détecte les appareils : `flutter devices`
- Pour Android : Démarrez un émulateur via Android Studio
- Pour iOS : Ouvrez Simulator : `open -a Simulator`
- Pour Web : Utilisez `-d chrome`

### **Erreur: "API_BASE_URL not found"**
- Vérifiez que le fichier `.env` existe
- Vérifiez que les variables sont correctement définies

### **Erreur: "Connection refused"**
- Vérifiez que le backend est démarré sur le port 4000
- Vérifiez que le realtime service est démarré sur le port 5000
- Vérifiez l'URL dans `.env` (10.0.2.2 pour Android emulator)

### **Erreur: "Firebase not initialized"**
- Les apps nécessitent Firebase pour l'authentification
- Configurez Firebase : https://firebase.google.com/docs/flutter/setup

---

## 📝 **Commandes Utiles**

```bash
# Voir les appareils disponibles
flutter devices

# Voir les logs en temps réel
flutter logs

# Hot reload (appuyez sur 'r' dans le terminal)
# Hot restart (appuyez sur 'R' dans le terminal)

# Arrêter l'app
# Appuyez sur 'q' dans le terminal ou Ctrl+C
```

---

## 🌐 **Lancer sur Web**

Pour un test rapide sans émulateur :

```bash
# Client app
cd apps/mobile_client
flutter run -d chrome --web-port=8080

# Driver app (dans un autre terminal)
cd apps/mobile_driver
flutter run -d chrome --web-port=8081
```

Puis ouvrez :
- Client : http://localhost:8080
- Driver : http://localhost:8081

**Note** : Certaines fonctionnalités (GPS, notifications) ne fonctionnent pas sur Web.

---

## ✅ **Vérification**

Une fois l'app lancée, vous devriez voir :
- **Client** : Écran de login avec numéro de téléphone
- **Driver** : Écran de login avec numéro de téléphone

Si vous voyez des erreurs de connexion, vérifiez que le backend et realtime sont démarrés.

---

**Bon développement !** 🚀

