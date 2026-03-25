#!/bin/bash
# High-Performance Dev Server & Proxy Sync (Bulletproof V1)

# 1. Config
PORT_REGISTRY=".local-ports"
BASE_PORT=4330
DOMAIN="kinetic.dalm.de"
PROJECT="KINETIC"

# 2. Get Context
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ -z "$BRANCH" ]; then
    echo "FAIL: Not in a git repository."
    exit 1
fi

# 3. Port Discovery
if [ -f "$PORT_REGISTRY" ]; then
    PORT=$(grep "^$BRANCH=" "$PORT_REGISTRY" | cut -d'=' -f2)
fi

if [ -z "$PORT" ]; then
    echo "--> No port assigned for branch '$BRANCH'. Finding free port..."
    CURRENT=$BASE_PORT
    while lsof -Pi :$CURRENT -sTCP:LISTEN -t >/dev/null ; do
        ((CURRENT++))
    done
    PORT=$CURRENT
    echo "$BRANCH=$PORT" >> "$PORT_REGISTRY"
fi

echo "--> Branch: $BRANCH"
echo "--> Port:   $PORT"

# 4. Sync Marvin Proxy (Headless & Fast)
echo "--> Syncing Marvin Proxy (Caddy)..."
HOSTNAME="${BRANCH}.mac.dev.${DOMAIN}"
if [ "$BRANCH" == "main" ]; then
    HOSTNAME="mac.dev.${DOMAIN}"
fi

ssh -o ConnectTimeout=5 -o BatchMode=yes ok@marvin "sudo sed -i \"/${HOSTNAME}/,/}/ s/reverse_proxy 100.64.0.5:[0-9]*/reverse_proxy 100.64.0.5:${PORT}/\" /etc/caddy/Caddyfile && sudo systemctl reload caddy"

if [ $? -eq 0 ]; then
    echo "OK: Marvin proxy updated to $PORT"
else
    echo "WARN: Marvin sync failed. Check connectivity to Marvin."
fi

# 5. Start Dev Server
echo "🚀 Starting $PROJECT ($BRANCH) on https://${HOSTNAME}..."
# EXPLICITLY set SITE_BRANCH so the page title is correct
export SITE_BRANCH="$BRANCH"
exec npm run dev -- --port $PORT --host
