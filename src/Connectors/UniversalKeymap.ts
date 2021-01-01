import { IShortcutConverter } from './Converters/ShortcutConverter';
import { IdeMappings, IdeMappingsUtils } from './Ide';
import { IShortcut } from './Shortcut';
import { fsUtils } from './Utils';

export interface IKeymap<T> {
  [key: string]: T;
}

export type IUniversalKeymap = IKeymap<IShortcut[]>;

export class UniversalKeymap {
  public keymap: IUniversalKeymap;

  constructor(keymap?: IUniversalKeymap) {
    this.keymap = keymap ?? {};
  }

  public toIdeKeymap<T>(
    ideMappings: IdeMappings,
    shortcutConverter: IShortcutConverter<T>
  ): IKeymap<T[]> {
    return Object.keys(this.keymap).reduce<IKeymap<T[]>>(
      (ideKeymap, uniKey) => {
        const ideKey = IdeMappingsUtils.toIde(ideMappings, uniKey);
        if (ideKey) {
          ideKeymap[ideKey] = this.keymap[uniKey].map((shortcut) =>
            shortcutConverter.toIde(shortcut)
          );
        }
        return ideKeymap;
      },
      {}
    );
  }

  public static fromIdeKeymap<T>(
    ideKm: IKeymap<T[]>,
    ideMappings: IdeMappings,
    shortcutConverter: IShortcutConverter<T>
  ): UniversalKeymap {
    return new UniversalKeymap(
      Object.keys(ideKm).reduce<IUniversalKeymap>((uniKeymap, ideKey) => {
        const uniKey = IdeMappingsUtils.toUni(ideMappings, ideKey);
        if (uniKey) {
          const sc: IShortcut[] = ideKm[ideKey]
            .map((shortcut) => shortcutConverter.toUni(shortcut))
            .filter((shortcut) => shortcut != undefined) as IShortcut[];
          if (sc) uniKeymap[uniKey] = sc;
        }
        return uniKeymap;
      }, {})
    );
  }

  public saveKeymap(path: string): Promise<void> {
    return fsUtils.saveJson<IUniversalKeymap>(
      path,
      this.keymap,
      undefined,
      UniversalKeymap.jsonReplacer
    );
  }

  public static async readKeymap(path: string): Promise<UniversalKeymap> {
    const json = await fsUtils.readJson<any>(path);
    Object.values<any[]>(json).forEach((shortcuts) => {
      shortcuts.forEach((shortcut) => {
        shortcut.sc1.holdedKeys = new Set(shortcut.sc1.holdedKeys);
        if (shortcut.sc2)
          shortcut.sc2.holdedKeys = new Set(shortcut.sc2.holdedKeys);
      });
    });

    return new UniversalKeymap(json as IUniversalKeymap);
  }

  private static jsonReplacer(_key: any, value: any): any {
    if (value && value instanceof Set) {
      return [...value];
    } else {
      return value;
    }
  }

  public overrideKeymap(overrideKm: UniversalKeymap): UniversalKeymap {
    return new UniversalKeymap({ ...this.keymap, ...overrideKm.keymap });
  }
}
