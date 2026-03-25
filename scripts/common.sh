#!/bin/bash
set -e

# Configuration
COOLIFY_API_TOKEN=$(cat ~/.config/coolify/api-token)
COOLIFY_URL="https://deploy.dalm.de/api/v1"
MARVIN_HOST="marvin" # Assumes SSH config is set up
MAC_TS_IP="100.64.0.5"

# Helper to call Coolify API (Internal route via Tailscale for security)
coolify_api() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    # Using internal IP 100.64.0.7 (Magrathea) with Host header to stay within mesh
    local curl_cmd="curl -sk -X \"$method\" -H \"Authorization: Bearer $COOLIFY_API_TOKEN\" -H \"Content-Type: application/json\" -H \"Host: deploy.dalm.de\" \"https://100.64.0.7/api/v1/$endpoint\""
    
    if [ -n "$data" ]; then
        curl_cmd="$curl_cmd -d '$data'"
    fi
    
    ssh -q "$MARVIN_HOST" "$curl_cmd"
}

# Helper to run command on Marvin
marvin_exec() {
    local cmd=$1
    ssh -q "$MARVIN_HOST" "$cmd"
}
