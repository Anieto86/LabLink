# LabLink Tools

This directory contains tools and integrations for enhanced development and study workflows.

## 📁 Directory Structure

```
tools/
├── obsidian-integration/        # Obsidian vault integration
│   └── templates/              # Study templates for Obsidian
│       ├── Code Analysis Template.md
│       ├── Code Flow Trace Template.md
│       ├── Learning Game Template.md
│       ├── Learning Session Template.md
│       ├── Project Map Template.md
│       └── Reverse Engineering Template.md
└── warp-workflows/             # Warp terminal workflows
    ├── .warprc                 # Warp configuration
    ├── lablink-study-sync.yml  # Main workflow
    └── warp-commands.sh        # Command aliases and functions
```

## 🚀 Quick Setup

### Obsidian Integration
```bash
# Sync project to Obsidian vault
npm run obsidian:sync

# Watch for changes and auto-sync
npm run obsidian:watch
```

### Warp Workflows
```bash
# Load LabLink commands
source tools/warp-workflows/warp-commands.sh

# Available commands:
ll-sync      # Quick sync to Obsidian
ll-study     # Prepare for study session
ll-status    # Check sync status
lablink_full # Complete workflow
```

## 📚 Usage

### Study Workflow
1. **Sync project**: `ll-sync`
2. **Create study session**: `lablink_session "Topic Name"`
3. **Open Obsidian**: Navigate to `Projects/LabLink/`
4. **Start studying**: Use templates for structured learning

### Development Workflow
1. **Make changes** in LabLink project
2. **Auto-sync**: `npm run obsidian:watch` (background)
3. **Manual sync**: `ll-sync` (when needed)
4. **Study changes**: Use Obsidian vault for analysis

## 🔧 Configuration

All paths and settings are configured in:
- `scripts/auto-sync-to-obsidian.sh` - Sync script configuration
- `tools/warp-workflows/warp-commands.sh` - Command definitions
- `package.json` - NPM scripts

## 📋 Available Templates

- **Code Analysis**: Deep dive into specific code files
- **Code Flow Trace**: Follow request/response flows
- **Learning Session**: Structured study sessions
- **Learning Game**: Gamified learning progress
- **Project Map**: Architecture and structure mapping
- **Reverse Engineering**: Discovery-based learning

## 🎯 Benefits

- **Automated synchronization** between development and study environments
- **Structured learning** with predefined templates
- **Version controlled** study notes alongside code
- **Quick access** to project context while studying
- **Visual connections** between concepts in Obsidian graph view
