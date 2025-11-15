#!/bin/bash
# Script de test pour les apps mobiles
# Usage: ./scripts/test-mobile-apps.sh [client|driver|all]

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🧪 Mobile Apps Testing Script${NC}"
echo "================================"
echo ""

# Check Flutter installation
if ! command -v flutter &> /dev/null; then
    echo -e "${RED}❌ Flutter n'est pas installé${NC}"
    echo "Installez Flutter: https://docs.flutter.dev/get-started/install"
    exit 1
fi

FLUTTER_VERSION=$(flutter --version | head -1)
echo -e "${GREEN}✅ Flutter trouvé: $FLUTTER_VERSION${NC}"
echo ""

# Function to test an app
test_app() {
    local APP_NAME=$1
    local APP_DIR="apps/$APP_NAME"
    
    echo -e "${YELLOW}📱 Testing $APP_NAME...${NC}"
    echo "--------------------------------"
    
    if [ ! -d "$APP_DIR" ]; then
        echo -e "${RED}❌ Directory $APP_DIR not found${NC}"
        return 1
    fi
    
    cd "$APP_DIR"
    
    # Check .env file
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}⚠️  .env file not found, creating from .env.example...${NC}"
        if [ -f ".env.example" ]; then
            cp .env.example .env
            echo -e "${YELLOW}⚠️  Please update .env with your API keys${NC}"
        else
            echo -e "${RED}❌ .env.example not found${NC}"
            return 1
        fi
    else
        echo -e "${GREEN}✅ .env file exists${NC}"
    fi
    
    # Install dependencies
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    flutter pub get
    
    # Analyze
    echo -e "${YELLOW}🔍 Analyzing code...${NC}"
    if flutter analyze; then
        echo -e "${GREEN}✅ Analysis passed${NC}"
    else
        echo -e "${YELLOW}⚠️  Analysis found issues (non-blocking)${NC}"
    fi
    
    # Format check
    echo -e "${YELLOW}📝 Checking formatting...${NC}"
    if flutter format --set-exit-if-changed . > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Formatting OK${NC}"
    else
        echo -e "${YELLOW}⚠️  Formatting issues found (non-blocking)${NC}"
    fi
    
    # Run tests
    echo -e "${YELLOW}🧪 Running tests...${NC}"
    if flutter test --coverage; then
        echo -e "${GREEN}✅ All tests passed${NC}"
        if [ -f "coverage/lcov.info" ]; then
            echo -e "${GREEN}✅ Coverage report generated${NC}"
        fi
    else
        echo -e "${RED}❌ Some tests failed${NC}"
        cd ../..
        return 1
    fi
    
    cd ../..
    echo ""
}

# Main
APP_TO_TEST=${1:-all}

if [ "$APP_TO_TEST" = "client" ]; then
    test_app "mobile_client"
elif [ "$APP_TO_TEST" = "driver" ]; then
    test_app "mobile_driver"
elif [ "$APP_TO_TEST" = "all" ]; then
    test_app "mobile_client"
    test_app "mobile_driver"
    echo -e "${GREEN}✅ All apps tested successfully!${NC}"
else
    echo -e "${RED}❌ Invalid argument: $APP_TO_TEST${NC}"
    echo "Usage: $0 [client|driver|all]"
    exit 1
fi

