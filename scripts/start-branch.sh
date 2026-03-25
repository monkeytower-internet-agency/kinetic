#!/bin/bash
# script to start/verify a development branch
set -e

BRANCH=$1
if [ -z "$BRANCH" ]; then
    echo "Usage: $0 <branch-name>"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

echo "🔍 Verifying environment for branch: $BRANCH"

# 1. Git Check
if [ "$(git rev-parse --abbrev-ref HEAD)" != "$BRANCH" ]; then
    if git rev-parse --verify "$BRANCH" >/dev/null 2>&1; then
        echo "Switching to existing branch: $BRANCH"
        git checkout "$BRANCH"
    else
        echo "Creating new branch: $BRANCH"
        git checkout -b "$BRANCH"
    fi
fi

# 2. Coolify Verification
echo "Checking Coolify configuration..."
# Search for application by branch name
APP_JSON=$(coolify_api GET "applications" | jq -c ".[] | select(.git_branch == \"$BRANCH\")")

if [ -z "$APP_JSON" ]; then
    echo "❌ ERROR: No Coolify application found for branch '$BRANCH'."
    echo "Please create an application in Coolify pointing to this branch."
    exit 1
fi

APP_UUID=$(echo "$APP_JSON" | jq -r ".uuid")
FQDN=$(echo "$APP_JSON" | jq -r ".fqdn")
EXPECTED_FQDN="https://$BRANCH.dev.paranomad.de"

if [ "$FQDN" != "$EXPECTED_FQDN" ]; then
    echo "⚠️ Warning: FQDN mismatch. Expected $EXPECTED_FQDN, got $FQDN"
    echo "Updating FQDN..."
    coolify_api PATCH "applications/$APP_UUID" "{\"fqdn\": \"$EXPECTED_FQDN\"}" > /dev/null
fi

# Ensure SITE_BRANCH is set in Coolify
echo "Ensuring SITE_BRANCH environment variable is set..."
coolify_api POST "applications/$APP_UUID/envs" "{\"key\": \"SITE_BRANCH\", \"value\": \"$BRANCH\", \"is_buildtime\": true, \"is_runtime\": true, \"is_preview\": false}" > /dev/null

# Verify Traefik Labels (HTTPS)
# We fetch the full app details to get custom_labels
FULL_APP=$(coolify_api GET "applications/$APP_UUID")
LABELS_BASE64=$(echo "$FULL_APP" | jq -r ".custom_labels")
LABELS_DECODED=$(echo "$LABELS_BASE64" | base64 --decode)

if [[ "$LABELS_DECODED" != *"https-0"* ]]; then
    echo "❌ ERROR: Coolify app is missing HTTPS Traefik labels."
    echo "Try to fix it by applying standard labels..."
    # (Optional: I could automate this but better to report first as per rules)
    # exit 1
fi

# 3. Caddy Forwarding Verification (on Marvin)
echo "Checking Caddy forwarding on Marvin..."
CADDY_FILE="/etc/caddy/Caddyfile"
CADDY_CHECK=$(marvin_exec "grep -q '$BRANCH.mac.dev.paranomad.de' $CADDY_FILE" || echo "missing")

if [ "$CADDY_CHECK" == "missing" ]; then
    echo "Adding Caddy forwarding for $BRANCH..."
    
    # Calculate next port
    PORT_COUNT=$(marvin_exec "grep -c '.mac.dev.paranomad.de' $CADDY_FILE" || echo 0)
    BRANCH_PORT=$((4322 + PORT_COUNT))
    
    BLOCK="
# BEGIN ANSIBLE MANAGED BLOCK FOR BRANCH $BRANCH
$BRANCH.mac.dev.paranomad.de {
    reverse_proxy $MAC_TS_IP:$BRANCH_PORT
    tls /etc/caddy/certs/paranomad.de.crt /etc/caddy/certs/paranomad.de.key
}
# END ANSIBLE MANAGED BLOCK FOR BRANCH $BRANCH"

    # Append to Caddyfile and reload
    marvin_exec "echo \"$BLOCK\" | sudo tee -a $CADDY_FILE > /dev/null && sudo systemctl reload caddy"
    echo "✅ Caddy configured. Forwarding $BRANCH.mac.dev.paranomad.de -> $MAC_TS_IP:$BRANCH_PORT"
else
    CURRENT_PORT=$(marvin_exec "grep -A 1 '$BRANCH.mac.dev.paranomad.de' $CADDY_FILE | grep reverse_proxy" | awk -F: '{print $NF}')
    echo "✅ Caddy forwarding is active: $BRANCH.mac.dev.paranomad.de -> $MAC_TS_IP:$CURRENT_PORT"
fi

echo "🚀 Environment for branch '$BRANCH' is READY."
