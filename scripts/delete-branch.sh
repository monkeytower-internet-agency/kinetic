#!/bin/bash
# script to interactively choose and cleanup a development branch
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# ─── 1. Collect branches (local + remote, excluding main and HEAD) ─────────────
echo ""
echo "🔍 Fetching branch information..."
git fetch --prune --quiet 2>/dev/null || true

# All unique branch names (local + remote), never main or HEAD
ALL_BRANCHES=$(git branch -a \
  | sed 's/^[* +]*//' \
  | sed 's|remotes/origin/||' \
  | grep -v '^HEAD' \
  | grep -v '^main$' \
  | sort -u)

if [ -z "$ALL_BRANCHES" ]; then
    echo "✅ No branches to delete (only main exists)."
    exit 0
fi

# ─── 2. Display branch table ───────────────────────────────────────────────────
echo ""
printf "  %-4s  %-24s  %-20s  %-10s  %s\n" "#" "Branch" "Last Commit" "Age" "Status"
printf "  %-4s  %-24s  %-20s  %-10s  %s\n" "----" "------------------------" "--------------------" "----------" "------"

INDEX=0
declare -a BRANCH_NAMES

while IFS= read -r BRANCH; do
    INDEX=$((INDEX + 1))
    BRANCH_NAMES[$INDEX]="$BRANCH"

    # Last commit info
    COMMIT_MSG=$(git log "origin/$BRANCH" --oneline -1 2>/dev/null \
                 || git log "$BRANCH" --oneline -1 2>/dev/null \
                 || echo "unknown")
    COMMIT_MSG=$(echo "$COMMIT_MSG" | cut -c1-20)

    # Relative age
    AGE=$(git log "origin/$BRANCH" --format="%ar" -1 2>/dev/null \
          || git log "$BRANCH" --format="%ar" -1 2>/dev/null \
          || echo "unknown")

    # Is it merged into main?
    MERGED_LOCALLY=$(git branch --merged main 2>/dev/null | grep -w "$BRANCH" | xargs || true)
    MERGED_REMOTE=$(git branch -r --merged origin/main 2>/dev/null | grep -w "$BRANCH" | xargs || true)

    if [ -n "$MERGED_LOCALLY" ] || [ -n "$MERGED_REMOTE" ]; then
        STATUS="✅ merged"
    else
        STATUS="🔶 unmerged"
    fi

    # Annotate current working branch
    LABEL=""
    [ "$BRANCH" = "$CURRENT_BRANCH" ] && LABEL=" ← current"

    printf "  %-4s  %-24s  %-20s  %-10s  %s%s\n" \
        "$INDEX" "$BRANCH" "$COMMIT_MSG" "$AGE" "$STATUS" "$LABEL"

done <<< "$ALL_BRANCHES"

# ─── 3. Ask which branch to delete ───────────────────────────────────────────
echo ""
echo "  0  → Cancel"
echo ""
printf "Enter branch number to delete: "
read -r CHOICE

if [ -z "$CHOICE" ] || [ "$CHOICE" = "0" ]; then
    echo "Aborted."
    exit 0
fi

if ! [[ "$CHOICE" =~ ^[0-9]+$ ]] || [ "$CHOICE" -lt 1 ] || [ "$CHOICE" -gt "$INDEX" ]; then
    echo "❌ Invalid selection."
    exit 1
fi

BRANCH="${BRANCH_NAMES[$CHOICE]}"

# ─── 4. Safety confirmation ───────────────────────────────────────────────────
echo ""
echo "⚠️  You are about to PERMANENTLY delete branch: '$BRANCH'"
echo "   This removes: local branch, remote branch, and Caddy proxy on Marvin."
echo ""
printf "Type 'yes' to confirm: "
read -r CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Aborted."
    exit 0
fi

# ─── 5. Execute cleanup ───────────────────────────────────────────────────────
echo ""
echo "🧹 Cleaning up branch: $BRANCH"

# Caddy on Marvin
echo "→ Removing Caddy forwarding on Marvin..."
CADDY_FILE="/etc/caddy/Caddyfile"
marvin_exec "sudo sed -i '/# BEGIN ANSIBLE MANAGED BLOCK FOR BRANCH $BRANCH/,/# END ANSIBLE MANAGED BLOCK FOR BRANCH $BRANCH/d' $CADDY_FILE && sudo systemctl reload caddy" \
    && echo "  ✅ Caddy cleaned up." \
    || echo "  ⚠️  Caddy block not found or already removed."

# Git: local branch
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
    git branch -D "$BRANCH" && echo "  ✅ Local branch deleted."
else
    echo "  ℹ️  No local branch to delete."
fi

# Git: remote branch
if git ls-remote --exit-code origin "$BRANCH" >/dev/null 2>&1; then
    git push origin --delete "$BRANCH" && echo "  ✅ Remote branch deleted."
else
    echo "  ℹ️  No remote branch to delete."
fi

echo ""
echo "📌 Note: Coolify application for '$BRANCH' was NOT deleted."
echo "   Remove it manually in Coolify if it's no longer needed."
echo ""
echo "✨ Cleanup complete for '$BRANCH'!"
