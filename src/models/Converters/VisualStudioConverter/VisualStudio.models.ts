export interface VisualStudioXmlConfig {
  UserSettings: {
    Category: Category[];
  };
}

export interface VisualStudioXmlKeyboardShortcuts {
  ScopeDeginitions: any[];
  DefaultShortcuts: any[];
  ShortcutsScheme: string[];
  UserShortcuts: UserShortcuts[];
}

export interface UserShortcuts {
  Shortcut?: VisualStudioConfigShortcut[];
  RemoveShortcut?: VisualStudioConfigShortcut[];
}

export interface VisualStudioConfigShortcut {
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
  userShortcuts: { command: string; keybind: string }[];
}
