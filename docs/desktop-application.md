# Windows Desktop Application

HUPA provides a native Windows desktop experience powered by Electron and `electron-builder`.

---

## Desktop Architecture

```
+─────────────────────────────────────────────────────────────+
|               MAIN PROCESS (electron/main.ts)               |
|  - Windows 10/11 Window Management                          |
|  - Window State Persistence (Bounds, Maximized)             |
|  - Native IPC Handlers (Open JSON, Save JSON)               |
+──────────────────────────────┬──────────────────────────────+
                               │ (contextBridge)
+──────────────────────────────┴──────────────────────────────+
|              PRELOAD SCRIPT (electron/preload.ts)           |
|  - Exposes typed window.electronAPI                         |
+──────────────────────────────┬──────────────────────────────+
                               │
+──────────────────────────────┴──────────────────────────────+
|             RENDERER PROCESS (Chromium / React 19)          |
|  - Unified Graph Canvas & Zustand Store                     |
|  - Native IndexedDB Local Storage                           |
|  - Background Sync to Supabase PostgreSQL                   |
+─────────────────────────────────────────────────────────────+
```

---

## Desktop Capabilities

1. **Native File Dialogs**:
   - `window.electronAPI.openProjectFile()`: Opens native Windows file explorer to select and parse `.json` project files.
   - `window.electronAPI.saveProjectFile(defaultName, content)`: Prompts Windows Save As dialog to export architecture graphs.
2. **Window State Persistence**:
   - Stores window geometry and maximized state in `app.getPath('userData')/hupa-window-state.json`.
3. **Hardware Acceleration**:
   - Chromium GPU acceleration delivers smooth 60fps canvas navigation across large graphs.
4. **Single Instance Locking**:
   - Prevents duplicate processes from launching simultaneously.

---

## Building and Packaging

### Development
```bash
npm run dev:desktop
```

### Production Build
```bash
# 1. Compile React/Vite renderer + Electron TypeScript scripts
npm run build:desktop

# 2. Package Windows NSIS Installer and Portable Executable
npm run package:win
```

### Artifact Outputs
- `dist-desktop/HUPA-Setup-0.1.0.exe` — Installer with Start Menu and Desktop shortcuts
- `dist-desktop/win-unpacked/HUPA.exe` — Portable standalone executable
