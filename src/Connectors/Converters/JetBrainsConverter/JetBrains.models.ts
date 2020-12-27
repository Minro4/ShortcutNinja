export interface JbXmlConfig {
  keymap: {
    $: {
      name?: string;
      parent?: string;
    };
    action: {
      $: { id: string };
      "keyboard-shortcut"?: JbShortcut[];
    }[];
  };
}

export interface JbShortcut {
  $: {
    "first-keystroke": string;
    "second-keystroke"?: string;
  };
}

export interface JbKeymapOptions {
  application: {
    component: JbOptionsComponent[];
  };
}

export interface JbOptionsComponent {
  $: { name: string }; //Must be KeymapManager
  active_keymap: {
    $: {
      name: string; //Name of file containing setting
    };
  }[];
}
