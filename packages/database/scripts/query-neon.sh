#!/bin/bash

# Script pour interroger directement Neon via psql

echo "📊 Querying Neon database..."
echo ""

# Charger DATABASE_URL depuis .env
source .env

# Vérifier que psql est installé
if ! command -v psql &> /dev/null; then
    echo "❌ psql n'est pas installé. Installation..."
    sudo apt-get update && sudo apt-get install -y postgresql-client
fi

echo "👥 Users:"
psql "$DATABASE_URL" -c "SELECT id, email, name, \"createdAt\" FROM \"user\" ORDER BY \"createdAt\" DESC;"

echo ""
echo "🔖 Bookmarks:"
psql "$DATABASE_URL" -c "SELECT id, title, url, status, starred, read FROM \"Bookmark\" ORDER BY \"createdAt\" DESC LIMIT 10;"

echo ""
echo "🏷️  Tags:"
psql "$DATABASE_URL" -c "SELECT id, name, type, \"userId\" FROM \"Tag\";"

echo ""
echo "📈 Stats:"
psql "$DATABASE_URL" -c "
SELECT
    'Users' as table_name, COUNT(*) as count FROM \"user\"
UNION ALL
SELECT 'Bookmarks', COUNT(*) FROM \"Bookmark\"
UNION ALL
SELECT 'Tags', COUNT(*) FROM \"Tag\"
UNION ALL
SELECT 'Sessions', COUNT(*) FROM \"session\";
"
