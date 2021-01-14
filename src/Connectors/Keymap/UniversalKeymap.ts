import { IShortcutConverter } from '../Converters/ShortcutConverter';
import { IdeMappings } from "../IdeMappings";
import { Keymap } from '.';
import { IJsonShortcut, Shortcut } from '../Shortcut';
import { fsUtils } from '../Utils';
import { Mappings } from './Keymap';
import _ from 'lodash';

export type UniversalMappings = Mappings<Shortcut[]>;

export class UniversalKeymap extends Keymap<Shortcut> {
  constructor(keymap?: UniversalMappings) {
    super(keymap);
  }

  public toIdeKeymap<T>(
    ideMappings: IdeMappings,
    shortcutConverter: IShortcutConverter<T>
  ): Keymap<T> {
    const mappings = this.keys().reduce<Mappings<T[]>>((ideKeymap, uniKey) => {
      const ideKeys = ideMappings.toIde(uniKey);
      if (ideKeys) {
        ideKeys.forEach((ideKey) => {
          ideKeymap[ideKey] = this.keymap[uniKey].map((shortcut) =>
            shortcutConverter.toIde(shortcut)
          );
        });
      }
      return ideKeymap;
    }, {});

    return new Keymap(mappings);
  }

  public conflicts(shortcut: Shortcut, except?: string): string[] {
    return this.keys().reduce<string[]>((arr, key) => {
      if (key !== except) {
        const shortcuts = this.get(key);
        if (shortcuts.some((sc) => shortcut.conflicts(sc))) {
          arr.push(key);
        }
      }
      return arr;
    }, []);
  }

  public saveKeymap(path: string): Promise<void> {
    return fsUtils.saveJson<IJsonUniversalKeymap>(path, this.toJson());
  }

  public static async readKeymap(path: string): Promise<UniversalKeymap> {
    return UniversalKeymap.fromJson(await fsUtils.readJson<any>(path));
  }

  public clone(): UniversalKeymap {
    return _.cloneDeep(this);
  }

  public toJson(): IJsonUniversalKeymap {
    return this.keys().reduce<IJsonUniversalKeymap>((json, key) => {
      json[key] = this.keymap[key].map((shortcut) => shortcut.toJson());
      return json;
    }, {});
  }

  public static fromJson(json: IJsonUniversalKeymap): UniversalKeymap {
    return new UniversalKeymap(
      Object.keys(json).reduce<UniversalMappings>((uniKm, key) => {
        uniKm[key] = json[key].map(Shortcut.fromJson);
        return uniKm;
      }, {})
    );
  }

   //Removes in both keymaps, mappings that are shared.
   public removeSharedMappings(other: UniversalKeymap): void {
     const toRemove = new UniversalKeymap();
    this.keys().forEach(key => {
      const otherShortcuts = other.get(key);
      this.get(key).forEach(shortcut => {
        otherShortcuts.forEach(otherShortcut => {
          if (shortcut.equals(otherShortcut)){
            toRemove.add(key,shortcut);
          }
        });
      })
    });

    this.removeKeymap(toRemove);
    other.removeKeymap(toRemove);
  }
}

export type IJsonUniversalKeymap = Mappings<IJsonShortcut[]>;
