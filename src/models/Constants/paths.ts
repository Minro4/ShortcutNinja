import { homedir } from "os";
import * as path from "path";

export const vsCodeFolderPath = path.join(homedir(), "/Appdata/Roaming/Code");
export const vsCodeKbPath = path.join(vsCodeFolderPath, "/User/keybindings.json");

export const visualStudioFolderPath = "Program Files (x86)/Microsoft Visual Studio"; //path.join(homedir(), "/AppData/Local/Microsoft/VisualStudio");
export const visualStudiodevenv = "Common7/IDE/devenv.exe";

export const visualStudioKbName = "ApplicationPrivateSettings.xml";