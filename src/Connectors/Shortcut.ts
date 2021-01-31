import _ from 'lodash';

interface IShortcut {
  sc1: ISingleShortcut;
  sc2?: ISingleShortcut;
}

interface ISingleShortcut {
  holdedKeys: Set<HoldableKeys>;
  key: string;
}

const stringLitArray = <L extends string>(arr: L[]) => arr;
export const holdableKeys = stringLitArray(['ctrl', 'shift', 'alt']);
export type HoldableKeys = typeof holdableKeys[number];
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isHoldableKey = (k: any): k is HoldableKeys =>
  holdableKeys.includes(k);

export class Shortcut implements IShortcut {
  sc1: SingleShortcut;
  sc2?: SingleShortcut | undefined;

  constructor(sc1: SingleShortcut, sc2?: SingleShortcut) {
    this.sc1 = sc1;
    this.sc2 = sc2;
  }

  public toJson(): IJsonShortcut {
    return {
      sc1: this.sc1.toJson(),
      sc2: this.sc2 && this.sc2.toJson(),
    };
  }

  public static fromJson(json: IJsonShortcut): Shortcut {
    return new Shortcut(
      SingleShortcut.fromJson(json.sc1),
      json.sc2 && SingleShortcut.fromJson(json.sc2)
    );
  }

  public equals(other: Shortcut): boolean {
    return _.isEqual(this, other);
  }

  public conflicts(other: Shortcut): boolean {
    if ((this.sc2 === undefined) === (other.sc2 === undefined)) {
      return this.equals(other);
    } else {
      //If they are not of the same length, they conflict when sc1 is the same
      return this.sc1.equals(other.sc1);
    }
  }
}

export class SingleShortcut implements ISingleShortcut {
  holdedKeys: Set<HoldableKeys>;
  key: string;

  constructor(holdedKeys: Set<HoldableKeys>, key: string) {
    this.holdedKeys = new Set<HoldableKeys>(
      Array.from(holdedKeys).map((key) => key.toLowerCase()) as HoldableKeys[]
    );
    this.key = key.split(' ')[0].toLowerCase();
  }

  public orderedHoldedKeys(): HoldableKeys[] {
    return holdableKeys.filter((key) =>
      this.holdedKeys.has(key)
    ) as HoldableKeys[];
  }

  public toJson(): IJsonSingleShortcut {
    return {
      holdedKeys: [...this.holdedKeys],
      key: this.key,
    };
  }

  public static fromJson(json: IJsonSingleShortcut): SingleShortcut {
    return new SingleShortcut(new Set(json.holdedKeys), json.key);
  }

  public equals(other: SingleShortcut): boolean {
    return _.isEqual(this, other);
  }
}

export interface IJsonShortcut {
  sc1: IJsonSingleShortcut;
  sc2?: IJsonSingleShortcut;
}

export interface IJsonSingleShortcut {
  holdedKeys: HoldableKeys[];
  key: string;
}
