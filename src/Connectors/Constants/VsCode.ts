import { homedir } from 'os';
import * as path from 'path';

export const FOLDER_PATH = path.join(homedir(), '/Appdata/Roaming/Code');
export const KEYBINDINGS_PATH = path.join(FOLDER_PATH, '/User/keybindings.json');
