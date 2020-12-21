import { IShortcutConverter } from "./Converters/ShortcutConverters/ShortcutConverter";
import { IdeMappings, IdeMappingsUtils } from "./Ide";
import { IShortcut } from "./Shortcut";

export interface IKeymap<T> {
  [key: string]: T;
}

export type IUniversalKeymap = IKeymap<IShortcut>;

export namespace KeymapUtils {
  export function toIdeKeymap<T>(
    uniKm: IUniversalKeymap,
    ideMappings: IdeMappings,
    shortcutConverter: IShortcutConverter<T>
  ): IKeymap<T> {
    return Object.keys(uniKm).reduce<IKeymap<T>>((ideKeymap, uniKey) => {
      let ideKey = IdeMappingsUtils.toIde(ideMappings, uniKey);
      if (ideKey) ideKeymap[ideKey] = shortcutConverter.toIde(uniKm[uniKey]);
      return ideKeymap;
    }, {});
  }

  export function toUniKeymap<T>(
    ideKm: IKeymap<T>,
    ideMappings: IdeMappings,
    shortcutConverter: IShortcutConverter<T>
  ): IUniversalKeymap {
    return Object.keys(ideKm).reduce<IUniversalKeymap>((uniKeymap, ideKey) => {
      const uniKey = IdeMappingsUtils.toUni(ideMappings, ideKey);
      if (uniKey) {
        const sc = shortcutConverter.toUni(ideKm[ideKey]);
        if (sc) uniKeymap[uniKey] = sc;
      }
      return uniKeymap;
    }, {});
  }
}
