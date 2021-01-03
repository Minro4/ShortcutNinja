export interface VisualStudioXmlConfig {
  UserSettings: {
    Category: Category[];
  };
}

export interface VisualStudioXmlKeyboardShortcuts {
  ScopeDeginitions: any[];
  DefaultShortcuts: any[];
  ShortcutsScheme: string[];
  UserShortcuts: XmlUserShortcuts[];
}

export interface XmlUserShortcuts {
  Shortcut?: XmlVisualStudioConfigShortcut[];
  RemoveShortcut?: XmlVisualStudioConfigShortcut[];
}

export interface XmlVisualStudioConfigShortcut {
  _: string;
  $: {
    Command: string;
    Scope: string;
  };
}

export interface Category {
  $: {
    name: string;
  };
  Category?: Category[];
  [key: string]: any;
}

export interface VisualStudioConfig {
  scheme: string;
  additionalShortcuts: VisualStudioConfigShortcut;
  removedShortcuts: VisualStudioConfigShortcut;
}

export type VisualStudioConfigShortcut = { command: string; keybind: string }[];

export type VsShortcut = string;
