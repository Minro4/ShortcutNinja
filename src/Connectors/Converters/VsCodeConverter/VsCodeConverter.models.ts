export type VsCondeConfig = VsCodeKeybinding[];
export interface VsCodeKeybinding {
  key: string;
  command: string;
  when?: string;
}
