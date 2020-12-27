import { homedir } from "os";
import * as path from "path";
export namespace VS_CODE {
  export const FOLDER_PATH = path.join(homedir(), "/Appdata/Roaming/Code");
  export const KB_PATH = path.join(FOLDER_PATH, "/User/keybindings.json");
}
