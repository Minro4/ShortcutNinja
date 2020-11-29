import { fsUtils } from "./Utils";

interface IShortcutDefinitions {
  [key: string]: IShortcutDefinition;
}

export interface IShortcutDefinition {
  id: string;
  label: string;
}

export namespace ShortcutDefinitionsUtils {
  const defaultDefinitionsPath: string = "src/config/ShortcutDefinitions.json";

  export function loadFromDir(
    path: string = defaultDefinitionsPath
  ): Promise<IShortcutDefinitions> {
    return fsUtils.readJson<IShortcutDefinitions>(path);
    /* const configs = await readAllFilesInDir<ShortcutDefinition>(dirPath);
    return configs.reduce<ShortcutDefinitions>(
      (acc: ShortcutDefinitions, value: ShortcutDefinition) => {
        acc[value.id] = value;
        return acc;
      },
      new ShortcutDefinitions()
    );
  }*/
  }
}
