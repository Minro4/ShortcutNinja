import * as path from 'path';
import { homedir } from 'os';

export const APP_NAME = 'ShortcutDirector';
export const CONFIG_PATH = path.join('src/Connectors/Config');
export const IDE_MAPPINGS_PATH = path.join(CONFIG_PATH, 'ideMappings');

export const SHORTCUT_DEFINITIONS_PATH = path.join(
  CONFIG_PATH,
  'ShortcutDefinitions.json'
);

export const APP_FOLDER = path.join(homedir(), `Appdata/Roaming/${APP_NAME}`)
