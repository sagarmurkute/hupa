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

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
