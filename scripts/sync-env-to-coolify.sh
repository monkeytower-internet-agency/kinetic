#!/bin/bash
# sync-env-to-coolify.sh
# Syncs local .env variables to Coolify via API
# Run on Magrathea: bash /path/to/sync-env-to-coolify.sh
# Or remotely: scp .env + script to magrathea, then ssh run

set -euo pipefail

TOKEN="${COOLIFY_TOKEN:-$(cat /etc/coolify/api-token 2>/dev/null || cat ~/.config/coolify/api-token 2>/dev/null || echo '')}"
APP_UUID="lk0s8cok404gog44g8c8o0o8"
API="http://localhost:8000/api/v1/applications/$APP_UUID/envs"
AUTH="Authorization: Bearer $TOKEN"

if [ -z "$TOKEN" ]; then
    echo "❌ No Coolify API token found. Set COOLIFY_TOKEN or place in /etc/coolify/api-token"
    exit 1
fi

echo "🔄 Syncing .env to Coolify for ParaNomad ($APP_UUID)"
echo ""

# Step 1: Clean up old vars with wrong names
echo "🧹 Cleaning up old GMAIL_* variables..."
UUIDS=$(curl -s -H "$AUTH" "$API" | python3 -c "
import sys, json
for e in json.load(sys.stdin):
    if e['key'].startswith('GMAIL_'):
        print(e['uuid'], e['key'])
" 2>/dev/null || true)

if [ -n "$UUIDS" ]; then
    echo "$UUIDS" | while read uuid key; do
        CODE=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$API/$uuid" -H "$AUTH")
        echo "  Deleted $key -> HTTP $CODE"
    done
else
    echo "  No GMAIL_* vars found. Clean."
fi

echo ""

# Step 2: Set variables from .env
ENV_FILE="${1:-.env}"
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ No .env file found at: $ENV_FILE"
    exit 1
fi

echo "📦 Setting environment variables from $ENV_FILE ..."
while IFS='=' read -r key value; do
    [ -z "$key" ] && continue
    [[ "$key" =~ ^# ]] && continue
    CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API" \
        -H "$AUTH" \
        -H "Content-Type: application/json" \
        -d "{\"key\": \"$key\", \"value\": \"$value\", \"is_buildtime\": true, \"is_runtime\": true, \"is_preview\": false}")
    echo "  $key -> HTTP $CODE"
done < "$ENV_FILE"

echo ""
echo "✅ Done! Verify at deploy.dalm.de -> ParaNomad -> Environment"
