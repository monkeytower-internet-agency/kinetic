#!/bin/bash
# script to merge a development branch to main
# Note: Coolify auto-deploys via GitHub webhook on push — no API trigger needed.
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

BRANCH=$(git rev-parse --abbrev-ref HEAD)
TARGET="main"

if [ "$BRANCH" == "$TARGET" ]; then
    echo "❌ Already on $TARGET. Nothing to merge."
    exit 1
fi

echo "🚢 Merging $BRANCH into $TARGET..."

# Handle worktree case: if TARGET is checked out elsewhere, we push the merge
if git worktree list | grep -q "\[$TARGET\]"; then
    echo "ℹ️  $TARGET is checked out in another worktree. Performing remote merge..."
    git push origin "$BRANCH:$TARGET"
else
    git checkout "$TARGET"
    git pull origin "$TARGET"
    git merge "$BRANCH"
    git push origin "$TARGET"
    git checkout "$BRANCH"
fi

echo "✅ Merged and pushed to $TARGET."
echo "🚀 Coolify will auto-deploy via GitHub webhook."
echo "✨ All done! Use delete-branch.sh $BRANCH to cleanup."
