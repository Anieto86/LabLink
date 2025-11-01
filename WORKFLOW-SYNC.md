# 🔄 Workflow Integrado: Proyecto ↔ Obsidian

Este documento describe el **workflow completo para sincronizar tu proyecto y estudiar con Obsidian**.

---

## 📊 Diagrama General del Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    LABLINK-NODE PROJECT                     │
│                                                              │
│  src/   docs/   package.json   drizzle/   scripts/          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓
                    ┌─────────────────────┐
                    │  WARP WORKFLOWS 🚀  │
                    └─────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                ↓             ↓             ↓
         ✨ Calidad      📚 Documentos   🧪 Tests
         (pnpm check)   (Generar notas) (pnpm test)
                │             │             │
                └─────────────┼─────────────┘
                              ↓
                    ┌─────────────────────┐
                    │  SYNC SCRIPTS 🔄    │
                    └─────────────────────┘
                              ↓
                              │
┌─────────────────────────────────────────────────────────────┐
│                        OBSIDIAN VAULT                       │
│                                                              │
│  ├── 📖 Documentación/                                      │
│  ├── 💻 Código (Revisiones)                                │
│  ├── 📝 Notas-Estudio/                                     │
│  ├── 🏗️  Arquitectura/                                      │
│  └── 📊 cambios-recientes.md                               │
└─────────────────────────────────────────────────────────────┘
                              ↓
                        📚 ESTUDIO
```

---

## 🚀 Comandos Principales

### 1️⃣ Modo Sincronización Rápida
```bash
# Sincroniza cambios + crea nota de estudio
pnpm quick-sync
```
**¿Qué hace?**
- ✅ Verifica estado de git
- ✅ Sincroniza con Obsidian
- ✅ Crea sesión de estudio

**Tiempo:** ~2 minutos

---

### 2️⃣ Modo Workflow Completo
```bash
# Check de calidad + Tests + Sync + Notas
pnpm full-workflow
```
**¿Qué hace?**
- ✅ Verifica estado
- ✅ Ejecuta `pnpm check` (format + lint + typecheck)
- ✅ Ejecuta tests
- ✅ Genera documentación automática
- ✅ Sincroniza con Obsidian
- ✅ Crea sesión de estudio

**Tiempo:** ~10-15 minutos

---

### 3️⃣ Modo Estudio
```bash
# Revisa cambios + genera notas
pnpm study-mode
```
**¿Qué hace?**
- 🔍 Revisa archivos modificados
- 📝 Genera documentación
- 📖 Crea sesión de estudio

**Tiempo:** ~3 minutos

---

### 4️⃣ Preparado para Commit
```bash
# Asegura que todo está listo para commit
pnpm commit-ready
```
**¿Qué hace?**
- ✅ Estado del proyecto
- ✅ Calidad de código
- ✅ Tests pasando
- ℹ️ Info para commit

**Tiempo:** ~10 minutos

---

## 📖 Paso a Paso: Tu Flujo de Trabajo Diario

### Opción A: Rápida (15 minutos)
```bash
# 1. En la mañana: Sincronizar y preparar
pnpm quick-sync

# 2. Abrir Obsidian y revisar
# → Ver últimos cambios
# → Leer documentación
# → Tomar notas de estudio

# 3. Trabajar en el código
pnpm dev

# 4. Al terminar: Commit
git add .
git commit -m "feat: descripción"
```

---

### Opción B: Completa (30 minutos)
```bash
# 1. Iniciar sesión de programación
pnpm full-workflow

# ⏳ Mientras se ejecuta todo:
# → Lee los cambios que genera
# → Comprende qué pasó
# → Toma notas

# 2. Abrir Obsidian para revisar
# → Documentación actualizada
# → Notas de estudio
# → Cambios del proyecto

# 3. Trabajar + estudiar
pnpm dev          # En una terminal
# Obsidian abierto en otro monitor

# 4. Al terminar: Commit completo
pnpm commit-ready  # Verifica todo está bien
git commit -m "feat: descripción"
```

---

## 📁 Estructura de Obsidian que se Genera

```
Obsidian Vault (LabLink)
│
├── 📖 Documentación/
│   ├── 01-overview.md
│   ├── 02-quick-start.md
│   ├── 03-architecture.md
│   ├── 04-development.md
│   └── 05-database.md
│
├── 💻 Código/
│   ├── auth-review.md
│   ├── database-schema.md
│   └── service-examples.md
│
├── 📝 Notas-Estudio/
│   ├── sesion-2025-11-01.md
│   ├── conceptos-aprendidos.md
│   └── dudas-resueltas.md
│
├── 🏗️  Arquitectura/
│   ├── arquitectura.md
│   ├── layers-explicadas.md
│   └── patterns.md
│
├── 📊 cambios-recientes.md
├── 🗂️  estructura-proyecto.md
├── 🔗 referencias-codigo.md
└── 📋 index.md
```

---

## 🔄 Flujo de Sincronización Detallado

### Cuando ejecutas `pnpm quick-sync`:

```
1. GIT STATUS
   └─→ Verifica qué cambió
   
2. SYNC SCRIPT
   ├─→ Lee cambios recientes
   ├─→ Genera notas automáticas
   ├─→ Copia documentación
   └─→ Sincroniza con Obsidian
   
3. CREAR SESIÓN DE ESTUDIO
   ├─→ Crea archivo con fecha
   ├─→ Lista archivos modificados
   ├─→ Incluye plantilla de notas
   └─→ Prepara checklist
   
4. RESULTADO
   └─→ Archivos listos en Obsidian
```

---

## 💡 Cómo Estudiar con Obsidian

### Flujo de Estudio Recomendado:

```
1. SESIÓN DIARIA
   ├─ Abre: sesion-2025-11-01.md
   └─ Revisa cambios recientes

2. REVISAR CÓDIGO
   ├─ Abre archivo específico
   ├─ Lee documentación
   ├─ Usa plantilla: code-review-template.md
   └─ Toma notas

3. APRENDER ARQUITECTURA
   ├─ Abre: Arquitectura/
   ├─ Entiende las capas
   ├─ Revisa patrones
   └─ Conecta conceptos

4. RESOLVER DUDAS
   ├─ Documenta preguntas
   ├─ Busca en referencias
   ├─ Crea enlaces entre notas
   └─ Resuelve y actualiza
```

---

## 🎯 Plantillas Disponibles

### 1. arquitectura-template.md
Para documentar arquitectura:
```markdown
# 🏗️ Arquitectura - [Tema]

## Capas Arquitectónicas
## Flujo de Datos
## Módulos Principales
```

### 2. code-review-template.md
Para revisar código:
```markdown
# 💻 Revisión de Código: [Archivo]

## Análisis Línea por Línea
## Conceptos Aprendidos
## Dudas y Preguntas
## Checklist de Comprensión
```

### 3. sesion-estudio.md
Para sesiones diarias:
```markdown
# 📖 Sesión de Estudio - [Fecha]

## Objetivos
## Qué aprendí
## Dudas
## Próximos pasos
```

---

## ⚙️ Configuración Inicial

### Paso 1: Configurar Variable de Entorno
```bash
# En tu .bashrc o .zshrc
export OBSIDIAN_VAULT="~/ruta/a/tu/vault"

# Ejemplo:
export OBSIDIAN_VAULT="~/Obsidian/LabLink"
```

### Paso 2: Ejecutar Sync por Primera Vez
```bash
bash scripts/sync-to-obsidian.sh
```

### Paso 3: Abrir Obsidian
- Añade la carpeta del vault
- Permite sincronización
- ¡Listo!

---

## 🔍 Troubleshooting

### Problema: Scripts no sincroniza
```bash
# Verificar permisos
chmod +x scripts/sync-to-obsidian.sh

# Ejecutar manualmente
bash scripts/sync-to-obsidian.sh
```

### Problema: Obsidian no ve cambios
```bash
# Obsidian necesita recargarse
# Opción 1: Cerrar y abrir Obsidian
# Opción 2: Usar comando de recarga en Obsidian
```

### Problema: Rutas incorrectas
```bash
# Verificar que OBSIDIAN_VAULT esté configurado
echo $OBSIDIAN_VAULT

# Si está vacío:
export OBSIDIAN_VAULT="~/Obsidian/LabLink"
```

---

## 📊 Estadísticas que se Generan

Cada sincronización captura:
- ✅ Commits recientes
- ✅ Archivos modificados
- ✅ Estado actual
- ✅ Cambios del día
- ✅ Estadísticas de código

---

## 🎓 Cómo Maximizar el Aprendizaje

### 1. Sistema de Notas
```
Código → Script Sync → Obsidian → Notas Personales
```

### 2. Crear Conexiones
- Usa `[[referencia]]` entre notas
- Conecta cambios con arquitectura
- Vincula conceptos

### 3. Revisar Regularmente
- Sesión diaria
- Resumen semanal
- Repaso mensual

### 4. Documentar Aprendizajes
- ¿Qué aprendiste?
- ¿Por qué funciona así?
- ¿Cuándo lo usarías?

---

## 📚 Próximos Pasos

1. ✅ Configura `OBSIDIAN_VAULT`
2. ✅ Ejecuta `pnpm quick-sync` por primera vez
3. ✅ Abre Obsidian y revisa la estructura
4. ✅ Lee las plantillas disponibles
5. ✅ Crea tu primera nota de estudio
6. ✅ ¡Comienza a estudiar!

---

## 🔗 Referencias Rápidas

| Comando | Función |
|---------|---------|
| `pnpm quick-sync` | Sincronización rápida |
| `pnpm full-workflow` | Workflow completo |
| `pnpm study-mode` | Modo estudio |
| `pnpm commit-ready` | Preparado para commit |
| `pnpm dev` | Servidor desarrollo |

---

**Creado:** 2025-11-01  
**Versión:** 1.0.0  
**Estado:** 🟢 Activo
