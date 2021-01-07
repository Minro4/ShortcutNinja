export type VsCodeConfig = VsCodeKeybinding[];
export interface VsCodeKeybinding {
  key: VsCodeShortcut;
  command: string;
  when?: string;
}

export type VsCodeShortcut = string;
