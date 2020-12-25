export interface JetBrainsXmlConfig {
  keymap: {
    $: {
      name?: string;
      parent?: string;
    };
    action: {
      id: string;
      "keyboard-shortcut"?: JetBrainsShortcut;
    }[];
  };
}

export interface JetBrainsShortcut {
  $: {
    "first-keystroke": string;
    "second-keystroke"?: string;
  };
}
