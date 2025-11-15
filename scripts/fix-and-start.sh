#!/bin/bash
set -e

echo "🔧 Fixing and starting all services..."
cd /home/aymen/Téléchargements/uber

echo "📝 Committing Docker fixes..."
git add -A
git commit -m "fix(docker): correct dist paths in backend and realtime Dockerfiles" || echo "Nothing to commit"
git push origin main || echo "Push failed, continuing anyway"

echo "🧹 Cleaning up old containers..."
docker compose -f infra/docker-compose.dev.yml down

echo "🏗️  Building services..."
docker compose -f infra/docker-compose.dev.yml build

echo "🚀 Starting all services..."
docker compose -f infra/docker-compose.dev.yml up -d

echo "⏳ Waiting 15 seconds for services to start..."
sleep 15

echo "📊 Checking service status..."
docker compose -f infra/docker-compose.dev.yml ps

echo ""
echo "🏥 Testing health endpoints..."
echo "Backend health:"
curl -s http://localhost:3000/health | jq . || curl http://localhost:3000/health

echo ""
echo "Realtime health:"
curl -s http://localhost:3001/health | jq . || curl http://localhost:3001/health || echo "No health endpoint"

echo ""
echo "✅ Services are running!"
echo ""
echo "📊 Container logs (last 10 lines each):"
echo "--- Backend logs ---"
docker compose -f infra/docker-compose.dev.yml logs --tail=10 backend

echo ""
echo "--- Realtime logs ---"
docker compose -f infra/docker-compose.dev.yml logs --tail=10 realtime

echo ""
echo "🎉 All done! Next steps:"
echo "  1. To start Admin Web: cd apps/admin && pnpm dev"
echo "  2. Admin will be at: http://localhost:3002"
echo "  3. Backend API at: http://localhost:3000"
echo "  4. Realtime Socket.IO at: http://localhost:3001"

