#!/bin/bash
# warp-commands.sh
# Comandos rápidos para Warp

# Configuración de rutas
LABLINK_PROJECT="/c/Users/alvar/Documents/LabLink-node"
OBSIDIAN_VAULT="/c/Users/alvar/Documents/Obsidian-syc-git/Projects/LabLink"

# Alias para comandos frecuentes
alias ll-sync="cd '$LABLINK_PROJECT' && bash scripts/auto-sync-to-obsidian.sh"
alias ll-study="cd '$LABLINK_PROJECT' && bash scripts/auto-sync-to-obsidian.sh && echo '🎯 Listo para estudiar en Obsidian!'"
alias ll-status="cd '$LABLINK_PROJECT' && git status && echo '📊 Sync status:' && ls -la '$OBSIDIAN_VAULT'"
alias ll-quick="cd '$LABLINK_PROJECT' && git pull && bash scripts/auto-sync-to-obsidian.sh"

# Función para workflow completo
lablink_full() {
    echo "🚀 LabLink Full Study Workflow"
    echo "==============================="

    cd "$LABLINK_PROJECT"

    # Git operations
    echo "📥 Updating repository..."
    git fetch origin
    git pull origin main

    # Sync to Obsidian
    echo "🔄 Syncing to Obsidian..."
    bash scripts/auto-sync-to-obsidian.sh

    # Show project stats
    echo "📊 Project Statistics:"
    echo "  - TypeScript files: $(find src -name '*.ts' | wc -l)"
    echo "  - Documentation files: $(find docs -name '*.md' | wc -l)"
    echo "  - Last commit: $(git log -1 --pretty=format:'%h - %s (%cr)')"
    echo "  - Obsidian vault: $OBSIDIAN_VAULT"

    echo "✅ Ready to study! Open Obsidian and navigate to Projects/LabLink"
}

# Función para verificar sincronización
lablink_check() {
    echo "🔍 LabLink Sync Check"
    echo "===================="

    cd "$LABLINK_PROJECT"

    # Check git status
    echo "📊 Git Status:"
    if [ -n "$(git status --porcelain)" ]; then
        echo "  ⚠️ Uncommitted changes detected"
        git status --short
    else
        echo "  ✅ Working directory clean"
    fi

    # Check last sync
    echo ""
    echo "📁 Sync Status:"
    if [ -f "$OBSIDIAN_VAULT/last-sync.txt" ]; then
        echo "  📅 Last sync: $(cat '$OBSIDIAN_VAULT/last-sync.txt')"
    else
        echo "  ❌ No sync detected"
    fi

    # Check file counts
    echo ""
    echo "📊 File Comparison:"
    echo "  🏠 LabLink src files: $(find src -type f | wc -l)"
    echo "  🧠 Obsidian src files: $(find '$OBSIDIAN_VAULT/src' -type f 2>/dev/null | wc -l)"
    echo "  🏠 LabLink doc files: $(find docs -type f | wc -l)"
    echo "  🧠 Obsidian doc files: $(find '$OBSIDIAN_VAULT/docs' -type f 2>/dev/null | wc -l)"
}

# Función para limpiar y resetear
lablink_reset() {
    echo "🧹 LabLink Reset & Clean Sync"
    echo "============================="

    read -p "⚠️ This will delete Obsidian sync data. Continue? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️ Cleaning Obsidian vault..."
        rm -rf "$OBSIDIAN_VAULT/src" "$OBSIDIAN_VAULT/docs"
        rm -f "$OBSIDIAN_VAULT/package.json" "$OBSIDIAN_VAULT/Project-README.md" "$OBSIDIAN_VAULT/last-sync.txt"

        echo "🔄 Full resync..."
        cd "$LABLINK_PROJECT"
        bash scripts/auto-sync-to-obsidian.sh

        echo "✅ Reset completed!"
    else
        echo "❌ Reset cancelled"
    fi
}

# Función para crear sesión de estudio
lablink_session() {
    local session_name=${1:-"Study Session $(date '+%Y-%m-%d %H:%M')"}
    local session_file="$OBSIDIAN_VAULT/Session Notes/${session_name}.md"

    echo "📝 Creating study session: $session_name"

    # Ensure directory exists
    mkdir -p "$OBSIDIAN_VAULT/Session Notes"

    # Create session file
    cat > "$session_file" << EOF
---
tags: [lablink, study-session, $(date '+%Y-%m-%d')]
created: $(date '+%Y-%m-%d %H:%M:%S')
type: study-session
session: $session_name
---

# 📚 $session_name

## 🎯 Session Goals
- [ ]
- [ ]
- [ ]

## 📊 Project Context
- **Sync Time**: $(date '+%Y-%m-%d %H:%M:%S')
- **Last Commit**: $(cd "$LABLINK_PROJECT" && git log -1 --pretty=format:'%h - %s (%cr)')
- **Branch**: $(cd "$LABLINK_PROJECT" && git branch --show-current)

## 🔍 Focus Areas
- [ ] **Architecture**: Understand the layered design
- [ ] **Code Flow**: Trace request/response cycles
- [ ] **Database**: Study schema and queries
- [ ] **Testing**: Analyze test patterns

## 📝 Session Notes


## 💡 Key Insights


## 🎯 Next Steps
- [ ]
- [ ]

## 🔗 Related Files
- [[docs/README|📖 Documentation]]
- [[src/modules|📦 Modules]]
- [[🧬 LabLink - Study Hub|🏠 Study Hub]]

EOF

    echo "✅ Session created: $session_file"
    echo "🎯 Ready to start studying!"
}

echo "🚀 LabLink Warp Commands Loaded!"
echo "Available commands:"
echo "  ll-sync     - Quick sync to Obsidian"
echo "  ll-study    - Sync and prepare for study"
echo "  ll-status   - Check sync status"
echo "  ll-quick    - Git pull + sync"
echo "  lablink_full()    - Complete workflow"
echo "  lablink_check()   - Detailed sync check"
echo "  lablink_reset()   - Clean reset"
echo "  lablink_session() - Create study session"
