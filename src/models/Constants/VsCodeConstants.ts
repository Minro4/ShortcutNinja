import { homedir } from "os";
import * as path from "path";
import { VsCodeConverter } from "../Converters/VsCodeConverter";
import { Ide } from "../Ide";

export const folderPath = path.join(homedir(), "/Appdata/Roaming/Code");
export const kbPath = path.join(folderPath, "/User/keybindings.json");