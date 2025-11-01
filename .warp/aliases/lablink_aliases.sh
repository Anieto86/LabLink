# Warp Aliases for LabLink
# Agregar estas líneas a tu ~/.warp/aliases o ~/.bashrc

# LabLink Sync Commands
alias ll-sync='cd /c/Users/alvar/Documents/LabLink-node && bash scripts/auto-sync-to-obsidian.sh'
alias ll-study='cd /c/Users/alvar/Documents/LabLink-node && bash scripts/auto-sync-to-obsidian.sh && echo "🎯 Listo para estudiar!"'
alias ll-status='cd /c/Users/alvar/Documents/LabLink-node && git status && ls -la /c/Users/alvar/Documents/Obsidian-syc-git/Projects/LabLink/'
alias ll-update='cd /c/Users/alvar/Documents/LabLink-node && git pull && bash scripts/auto-sync-to-obsidian.sh'

# LabLink Functions
lablink_full() {
    echo "🚀 LabLink Full Workflow"
    cd /c/Users/alvar/Documents/LabLink-node
    git pull origin main
    bash scripts/auto-sync-to-obsidian.sh
    echo "✅ Todo listo para estudiar!"
}

lablink_session() {
    local session_name=${1:-"Study Session $(date '+%Y-%m-%d %H:%M')"}
    local session_file="/c/Users/alvar/Documents/Obsidian-syc-git/Projects/LabLink/Session Notes/${session_name}.md"

    mkdir -p "/c/Users/alvar/Documents/Obsidian-syc-git/Projects/LabLink/Session Notes"

    cat > "$session_file" << EOF
---
tags: [lablink, study-session, $(date '+%Y-%m-%d')]
created: $(date '+%Y-%m-%d %H:%M:%S')
---

# 📚 ${session_name}

## 🎯 Goals
- [ ]

## 📝 Notes


## 🔗 Links
- [[🧬 LabLink - Study Hub]]

EOF
    echo "✅ Sesión creada: ${session_name}"
}
