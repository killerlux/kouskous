#!/bin/bash
# Script pour installer Flutter et lancer les apps mobiles

set -e

echo "🚀 Installation et Configuration Flutter"
echo ""

# Vérifier si Flutter est déjà installé
if command -v flutter &> /dev/null; then
    echo "✅ Flutter est déjà installé"
    flutter --version
else
    echo "📦 Flutter n'est pas installé"
    echo ""
    echo "Pour installer Flutter:"
    echo "1. Téléchargez Flutter: https://docs.flutter.dev/get-started/install/linux"
    echo "2. Extrayez dans un dossier (ex: ~/development/flutter)"
    echo "3. Ajoutez au PATH: export PATH=\"\$PATH:\$HOME/development/flutter/bin\""
    echo "4. Exécutez: flutter doctor"
    echo ""
    exit 1
fi

echo ""
echo "🔍 Vérification de l'environnement..."
flutter doctor

echo ""
echo "✅ Configuration terminée!"
echo ""
echo "Pour lancer les apps:"
echo "  Client:  cd apps/mobile_client && flutter run -d chrome"
echo "  Driver:  cd apps/mobile_driver && flutter run -d chrome"

