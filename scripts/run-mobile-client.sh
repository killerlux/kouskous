#!/bin/bash
# Script pour lancer l'application mobile client

set -e

cd "$(dirname "$0")/../apps/mobile_client"

echo "📱 Lancement de l'application Mobile Client..."
echo ""

# Vérifier que .env existe
if [ ! -f .env ]; then
    echo "⚠️  Fichier .env manquant, création..."
    cat > .env << EOF
API_BASE_URL=http://localhost:4000
SOCKET_URL=http://localhost:5000
GOOGLE_MAPS_API_KEY=AIzaSyBJhAwoY-7WSihkbqPK27Kb1jMkJgPupac
EOF
fi

# Installer les dépendances
echo "📦 Installation des dépendances..."
flutter pub get

# Vérifier les appareils disponibles
echo ""
echo "🔍 Appareils disponibles:"
flutter devices

echo ""
echo "🚀 Lancement de l'application..."
echo "   (Appuyez sur 'q' pour quitter)"
echo ""

# Lancer sur Chrome par défaut, ou le premier appareil disponible
if flutter devices | grep -q "Chrome"; then
    flutter run -d chrome --web-port=8080
else
    flutter run
fi

