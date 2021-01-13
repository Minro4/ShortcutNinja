import * as path from 'path';

export const APP_NAME = 'keymap-manager';
export const CONFIG_PATH = path.join('src/Connectors/Config');
export const IDE_MAPPINGS_PATH = path.join(CONFIG_PATH, 'ideMappings');

export const SHORTCUT_DEFINITIONS_PATH = path.join(
  CONFIG_PATH,
  'ShortcutDefinitions.json'
);
