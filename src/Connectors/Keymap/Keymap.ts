import _ from 'lodash';
import { IShortcutConverter } from '../Converters/ShortcutConverter';
import { IdeMappings } from "../IdeMappings";
import { Shortcut } from '../Shortcut';
import { UniversalKeymap } from '.';
import { UniversalMappings } from './UniversalKeymap';

export type Mappings<T> = {
  [key: string]: T;
};

export class Keymap<T> {
  protected keymap: Mappings<T[]>;

  constructor(keymap?: Mappings<T[]>) {
    this.keymap = keymap ?? {};
  }

  public overrideKeymap(overrideKm: Keymap<T>): void {
    overrideKm.keys().forEach((key) => {
      this.set(key, overrideKm.get(key));
    });
  }

  public addKeymap(additionalKm: Keymap<T>): void {
    additionalKm.keys().forEach((key) => {
      additionalKm.get(key).forEach((value) => this.add(key, value));
    });
  }

  public removeKeymap(removeKm: Keymap<T>): void {
    removeKm.keys().forEach((key) => {
      removeKm.get(key).forEach((value) => this.remove(key, value));
    });
  }

  public get(key: string): T[] {
    return this.keymap[key] ?? [];
  }

  public add(key: string, shortcut: T): void {
    const current = this.get(key);
    const isNew = current.every((currentSc) => !_.isEqual(currentSc, shortcut));
    if (isNew) {
      if (this.keymap[key]) this.keymap[key].push(shortcut);
      else this.keymap[key] = [shortcut];
    }
  }

  public addAll(key: string, shortcuts: T[]): void {
    shortcuts.forEach((shortcut) => this.add(key, shortcut));
  }

  public set(key: string, shortcuts: T[]): void {
    this.keymap[key] = shortcuts;
  }

  public has(key: string): boolean {
    return !!this.keymap[key];
  }

  public remove(key: string, shortcut?: T): boolean {
    if (!shortcut) {
      delete this.keymap[key];
    } else {
      const array = this.get(key);
      const idx = array.findIndex((currentShortcut) =>
        _.isEqual(currentShortcut, shortcut)
      );
      if (idx >= 0) {
        array.splice(idx, 1);
      } else {
        return false;
      }
    }
    return true;
  }

  public keys(): string[] {
    return Object.keys(this.keymap);
  }
  public toUniKeymap(
    ideMappings: IdeMappings,
    shortcutConverter: IShortcutConverter<T>
  ): UniversalKeymap {
    const mappings = this.keys().reduce<UniversalMappings>(
      (uniKeymap, ideKey) => {
        const uniKey = ideMappings.toUni(ideKey);

        if (uniKey) {
          const sc: Shortcut[] = this.get(ideKey)
            .map((shortcut) => shortcutConverter.toUni(shortcut))
            .filter((shortcut) => shortcut != undefined) as Shortcut[];
          if (sc) uniKeymap[uniKey] = sc;
        }
        return uniKeymap;
      },
      {}
    );

    return new UniversalKeymap(mappings);
  }
}
