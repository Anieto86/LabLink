#!/bin/bash

# LabLink → Obsidian Sync Script
# Syncs personal documentation from LabLink to Obsidian vault

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Paths
OBSIDIAN_VAULT="c:/Users/alvar/Documents/Obsidian-syc-git/Projects/LabLink"
SOURCE_DIR="docs/obsidian-Lablink"

echo -e "${BLUE}🔄 LabLink → Obsidian Sync${NC}"
echo -e "${YELLOW}Source:${NC} $SOURCE_DIR"
echo -e "${YELLOW}Target:${NC} $OBSIDIAN_VAULT/obsidian-Lablink/"

# Check if source exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ Source directory $SOURCE_DIR not found!"
    exit 1
fi

# Check if Obsidian vault exists
if [ ! -d "$OBSIDIAN_VAULT" ]; then
    echo "❌ Obsidian vault not found at $OBSIDIAN_VAULT"
    exit 1
fi

# Create obsidian-Lablink folder in vault if it doesn't exist
mkdir -p "$OBSIDIAN_VAULT/obsidian-Lablink"

# Sync files
echo "📋 Syncing personal templates and guides..."
cp -r "$SOURCE_DIR"/* "$OBSIDIAN_VAULT/obsidian-Lablink/"

# Count synced files
file_count=$(find "$SOURCE_DIR" -name "*.md" | wc -l)

echo -e "${GREEN}✅ Sync complete!${NC}"
echo -e "${GREEN}📄 Synced $file_count markdown files${NC}"

# Optional: Auto-commit to Obsidian git
read -p "🤖 Auto-commit to Obsidian git? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd "$OBSIDIAN_VAULT/.."
    git add .
    git commit -m "Sync LabLink personal docs: $(date '+%Y-%m-%d %H:%M')"
    git push
    echo -e "${GREEN}🚀 Pushed to Obsidian repository${NC}"
fi

echo -e "${BLUE}🎯 Done! Check your Obsidian vault.${NC}"
echo -e "${YELLOW}💡 Tip: Use 'pnpm sync:obsidian' to run this script${NC}"
