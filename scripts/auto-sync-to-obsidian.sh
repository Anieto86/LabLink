#!/bin/bash
# auto-sync-to-obsidian.sh
# Script para sincronizar automáticamente LabLink con Obsidian

LABLINK_DIR="/c/Users/alvar/Documents/LabLink-node"
OBSIDIAN_DIR="/c/Users/alvar/Documents/Obsidian-syc-git/Projects/LabLink"

echo "🔄 Sincronizando LabLink → Obsidian..."

# Función para sincronizar directorio
sync_dir() {
    local source_dir=$1
    local target_dir=$2
    local dir_name=$3

    echo "📁 Sincronizando $dir_name..."

    # Eliminar directorio anterior si existe
    if [ -d "$target_dir" ]; then
        rm -rf "$target_dir"
    fi

    # Copiar directorio completo
    cp -r "$source_dir" "$target_dir"

    echo "✅ $dir_name actualizado"
}

# Sincronizar directorios principales
sync_dir "$LABLINK_DIR/src" "$OBSIDIAN_DIR/src" "Source Code"
sync_dir "$LABLINK_DIR/docs" "$OBSIDIAN_DIR/docs" "Documentation"

# Copiar archivos importantes
echo "📄 Copiando archivos importantes..."
cp "$LABLINK_DIR/package.json" "$OBSIDIAN_DIR/"
cp "$LABLINK_DIR/README.md" "$OBSIDIAN_DIR/Project-README.md"
cp "$LABLINK_DIR/tsconfig.json" "$OBSIDIAN_DIR/"

# Actualizar timestamp
echo "⏰ Última sincronización: $(date)" > "$OBSIDIAN_DIR/last-sync.txt"

echo "🎯 Sincronización completa!"
echo "📍 Archivos en: $OBSIDIAN_DIR"
