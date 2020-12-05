import {
  HoldableKeys,
  holdableKeys,
  isHoldableKey,
  IShortcut,
  ISingleShortcut,
} from "../../Shortcut";

export interface IShortcutConverter<T> {
  toIde(shortcut: IShortcut): T;
  toUni(shortcut: T): IShortcut | undefined;
}

export class StrShortcutConverter implements IShortcutConverter<string> {
  protected keyLink: string;
  protected scLink: string;

  constructor(keyLink: string = "+", scLink: string = " ") {
    this.keyLink = keyLink;
    this.scLink = scLink;
  }

  toIde(shortcut: IShortcut): string {
    return (
      this.singleScToStr(shortcut.sc1) +
      (shortcut.sc2 ? this.scLink + this.singleScToStr(shortcut.sc2) : "")
    ).toLowerCase();
  }
  toUni(shortcut: string): IShortcut | undefined {
    let sc = shortcut.split(this.scLink);
    let singles = sc.map((s) => this.strToSingle(s));
    if (!singles[0]) return undefined;
    return {
      sc1: singles[0],
      sc2: singles[1],
    };
  }
  private strToSingle(singleScStr: string): ISingleShortcut | undefined {
    let keys = singleScStr.split(this.keyLink);
    let key = keys.pop();
    if (!key || (holdableKeys as string[]).includes(key)) return undefined;

    try {
      let holdedKeys = keys.map<HoldableKeys>((holdedKey) => {
        if (isHoldableKey(holdedKey)) return holdedKey;
        throw Error();
      });

      return {
        holdedKeys: new Set<HoldableKeys>(holdedKeys),
        key: key,
      };
    } catch (err) {
      return undefined;
    }
  }

  private singleScToStr(sc: ISingleShortcut): string {
    let orderedKeys = holdableKeys.filter((key) =>
      sc.holdedKeys.has(key)
    ) as string[];
    orderedKeys.push(sc.key);

    return orderedKeys.reduce<string>(
      (str, key, idx, keys) =>
        (str += key + (idx === keys.length - 1 ? "" : this.keyLink)),
      ""
    );
  }
}
