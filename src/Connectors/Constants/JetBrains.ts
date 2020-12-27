import { homedir } from "os";
import * as path from "path";

export namespace JB {
  export const FOLDER_PATH = path.join(homedir(), "/Appdata/Roaming/JetBrains");

  export const KEYMAP_OPTION_PATH = "options/keymap.xml";

  export const KEYMAPS_FOLDER_NAME = "keymaps";

  export const KEYMAP_MANAGER = "KeymapManager";

  export const CONFIG_EXTENTION = "xml";
}
