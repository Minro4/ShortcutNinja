import { IShortcutConverter } from './Converters/ShortcutConverter';
import { IdeMappings, IdeMappingsUtils } from './Ide';
import { IJsonShortcut, Shortcut } from './Shortcut';
import { fsUtils } from './Utils';

export interface IKeymap<T> {
  [key: string]: T;
}

export type IUniversalKeymap = IKeymap<Shortcut[]>;

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
          const sc: Shortcut[] = ideKm[ideKey]
            .map((shortcut) => shortcutConverter.toUni(shortcut))
            .filter((shortcut) => shortcut != undefined) as Shortcut[];
          if (sc) uniKeymap[uniKey] = sc;
        }
        return uniKeymap;
      }, {})
    );
  }

  public saveKeymap(path: string): Promise<void> {
    return fsUtils.saveJson<IJsonUniversalKeymap>(path, this.toJson());
  }

  public static async readKeymap(path: string): Promise<UniversalKeymap> {
    return UniversalKeymap.fromJson(await fsUtils.readJson<any>(path));
  }

  public overrideKeymap(overrideKm: UniversalKeymap): UniversalKeymap {
    Object.keys(overrideKm.keymap).forEach((key) => {
      this.keymap[key] = overrideKm.get(key);
    });

    return this;
  }

  public addKeymap(additionalKm: UniversalKeymap): UniversalKeymap {
    Object.keys(additionalKm.keymap).forEach((key) => {
      const a = this.get(key);
      a.concat(additionalKm.get(key));
      this.keymap[key] = a;
    });

    return this;
  }

  public get(key: string): Shortcut[] {
    console.log('allo');
    return this.keymap[key] ?? [];
  }

  public toJson(): IJsonUniversalKeymap {
    return Object.keys(this.keymap).reduce<IJsonUniversalKeymap>(
      (json, key) => {
        json[key] = this.keymap[key].map((shortcut) => shortcut.toJson());
        return json;
      },
      {}
    );
  }

  public static fromJson(json: IJsonUniversalKeymap): UniversalKeymap {
    return new UniversalKeymap(
      Object.keys(json).reduce<IUniversalKeymap>((uniKm, key) => {
        uniKm[key] = json[key].map(Shortcut.fromJson);
        return uniKm;
      }, {})
    );
  }
}

type IJsonUniversalKeymap = IKeymap<IJsonShortcut[]>;
