import { IShortcutConverter } from '../Converters/ShortcutConverter';
import { IdeMappings, IdeMappingsUtils } from '../Ide';
import { Keymap } from '.';
import { IJsonShortcut, Shortcut } from '../Shortcut';
import { fsUtils } from '../Utils';
import { Mappings } from './Keymap';


export type UniversalMappings = Mappings<Shortcut[]>

export class UniversalKeymap extends Keymap<Shortcut> {

  constructor(keymap?: UniversalMappings) {
    super(keymap);
  }

  public toIdeKeymap<T>(
    ideMappings: IdeMappings,
    shortcutConverter: IShortcutConverter<T>
  ): Keymap<T> {
    const mappings = this.keys().reduce<Mappings<T[]>>(
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

    return new Keymap(mappings);
  }

  public saveKeymap(path: string): Promise<void> {
    return fsUtils.saveJson<IJsonUniversalKeymap>(path, this.toJson());
  }

  public static async readKeymap(path: string): Promise<UniversalKeymap> {
    return UniversalKeymap.fromJson(await fsUtils.readJson<any>(path));
  }

  public toJson(): IJsonUniversalKeymap {
    return this.keys().reduce<IJsonUniversalKeymap>(
      (json, key) => {
        json[key] = this.keymap[key].map((shortcut) => shortcut.toJson());
        return json;
      },
      {}
    );
  }

  public static fromJson(json: IJsonUniversalKeymap): UniversalKeymap {
    return new UniversalKeymap(
      Object.keys(json).reduce<UniversalMappings>((uniKm, key) => {
        uniKm[key] = json[key].map(Shortcut.fromJson);
        return uniKm;
      }, {})
    );
  }
}

type IJsonUniversalKeymap = Mappings<IJsonShortcut[]>;
