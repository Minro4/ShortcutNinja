export interface IShortcut {
  sc1: ISingleShortcut;
  sc2?: ISingleShortcut;
}

interface ISingleShortcut {
  holdedKeys: Set<HoldableKeys>;
  key: kbKey;
}

type kbKey = string;

const stringLitArray = <L extends string>(arr: L[]) => arr;
const holdableKeys = stringLitArray(["Control", "Shift", "Alt"]);
export type HoldableKeys = typeof holdableKeys[number];
const isHoldableKey = (k: any): k is HoldableKeys => holdableKeys.includes(k);

//const holdableKeys: Set<string> = new Set<string>(["Ctrl", "Shift", "Alt"]);
export class ShortcutCreator {
  private static readonly maxSc = 2;
  private scCreators: SingleShortcutCreator[];

  private currentScCreator: SingleShortcutCreator;

  constructor() {
    this.scCreators = [new SingleShortcutCreator()];
    this.currentScCreator = this.scCreators[0];
  }

  public onKeydown(key: string): IShortcut | undefined {
    if (key === "Enter") return this.create();

    this.currentScCreator.onKeydown(key);
    if (this.currentScCreator.isComplete()) {
      if (this.scCreators.length > ShortcutCreator.maxSc) {
        this.scCreators = [this.currentScCreator];
      }
      this.currentScCreator = new SingleShortcutCreator(this.currentScCreator);
      this.scCreators.push(this.currentScCreator);
    }
  }

  public onKeyup(key: string): void {
    this.currentScCreator.onKeyup(key);
  }

  private create(): IShortcut | undefined {
    let sc1 = this.scCreators[0].create();
    if (sc1) {
      return {
        sc1: sc1,
        sc2: this.scCreators[1].create(),
      };
    }
  }

  public toString(): string {
    return this.scCreators.reduce<string>((str, scCreator, idx, arr) => {
      if (idx === ShortcutCreator.maxSc) return str;
      return (
        str + scCreator.toString() + (idx >= arr.length - 2 ? "" : " chord to ")
      );
    }, "");
  }
}

class SingleShortcutCreator {
  private key?: kbKey;
  private holdedKeys: Set<HoldableKeys>;
  private addedKeys: boolean;

  constructor(previous?: SingleShortcutCreator) {
    this.holdedKeys = previous
      ? new Set<HoldableKeys>(previous.holdedKeys)
      : new Set<HoldableKeys>();
    this.addedKeys = false;
  }

  public onKeydown(key: string): void {
    this.addedKeys = true;
    if (isHoldableKey(key)) {
      this.holdedKeys.add(key);
    } else {
      this.key = key;
    }
  }

  public onKeyup(key: string): void {
    if (isHoldableKey(key)) {
      this.holdedKeys.delete(key);
    }
  }

  public create(): ISingleShortcut | undefined {
    if (this.key) {
      return { holdedKeys: this.holdedKeys, key: this.key };
    }
  }

  public toString(): string {
    if (!this.addedKeys) return "";
    
    let orderedKeys = holdableKeys.filter((key) =>
      this.holdedKeys.has(key)
    ) as string[];
    if (this.key) orderedKeys.push(this.key);

    return orderedKeys.reduce<string>(
      (str, key, idx, keys) =>
        (str += key + (idx === keys.length - 1 ? "" : "+")),
      ""
    );
  }

  public isComplete(): boolean {
    return this.key !== undefined;
  }
}
