import { contextBridge, ipcRenderer } from 'electron';

export interface ElectronAPI {
  isDesktop: boolean;
  platform: string;
  getVersion: () => Promise<string>;
  openProjectFile: () => Promise<{ canceled: boolean; filePath?: string; content?: string; error?: string }>;
  saveProjectFile: (defaultName: string, content: string) => Promise<{ canceled: boolean; filePath?: string; error?: string }>;
  minimizeWindow: () => Promise<void>;
  maximizeWindow: () => Promise<void>;
  closeWindow: () => Promise<void>;
  isMaximized: () => Promise<boolean>;
}

const electronAPI: ElectronAPI = {
  isDesktop: true,
  platform: process.platform,
  getVersion: () => ipcRenderer.invoke('app:get-version'),
  openProjectFile: () => ipcRenderer.invoke('dialog:open-project-file'),
  saveProjectFile: (defaultName: string, content: string) =>
    ipcRenderer.invoke('dialog:save-project-file', defaultName, content),
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window:maximize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:is-maximized'),
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
