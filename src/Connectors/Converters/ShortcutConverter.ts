import {
  HoldableKeys,
  holdableKeys,
  isHoldableKey,
  Shortcut,
  SingleShortcut,
} from '../Shortcut';

export interface IShortcutConverter<T> {
  toIde(shortcut: Shortcut): T;
  toUni(shortcut: T): Shortcut | undefined;
}

export class StrShortcutConverter implements IShortcutConverter<string> {
  protected keyLink: string;
  protected scLink: string;

  constructor(keyLink = '+', scLink = ' ') {
    this.keyLink = keyLink;
    this.scLink = scLink;
  }

  public toIde(shortcut: Shortcut): string {
    return (
      this.toIdeSingleSc(shortcut.sc1) +
      (shortcut.sc2 ? this.scLink + this.toIdeSingleSc(shortcut.sc2) : '')
    ).toLowerCase();
  }

  public toUni(shortcut: string): Shortcut | undefined {
    const sc = shortcut.split(this.scLink);
    const singles = sc.map((s) => this.toUniSingleSc(s));
    if (!singles[0]) return undefined;
    return new Shortcut(singles[0], singles[1]);
  }

  public toUniSingleSc(singleScStr: string): SingleShortcut | undefined {
    const keys = singleScStr
      .split(this.keyLink)
      .map((key) => key.toLowerCase());
    const key = keys.pop();
    if (!key || (holdableKeys as string[]).includes(key)) return undefined;

    try {
      const holdedKeys = keys.map<HoldableKeys>((holdedKey) => {
        if (isHoldableKey(holdedKey)) return holdedKey;
        throw Error();
      });

      return new SingleShortcut(new Set<HoldableKeys>(holdedKeys), key);
    } catch (err) {
      return undefined;
    }
  }

  public toIdeSingleSc(sc: SingleShortcut): string {
    const orderedKeys = holdableKeys.filter((key) =>
      sc.holdedKeys.has(key)
    ) as string[];
    orderedKeys.push(sc.key);

    return orderedKeys.reduce<string>(
      (str, key, idx, keys) =>
        (str += key + (idx === keys.length - 1 ? '' : this.keyLink)),
      ''
    );
  }
}
