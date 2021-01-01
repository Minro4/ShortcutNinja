import { fsUtils } from './Utils';

interface IShortcutDefinitions {
  [key: string]: IShortcutDefinition;
}

export interface IShortcutDefinition {
  id: string;
  label: string;
}

const DEFAULT_SC_DEFINITIONS_PATH = 'src/config/ShortcutDefinitions.json';

export function readShortcutDefinitions(
  path: string = DEFAULT_SC_DEFINITIONS_PATH
): Promise<IShortcutDefinitions> {
  return fsUtils.readJson<IShortcutDefinitions>(path);
}
