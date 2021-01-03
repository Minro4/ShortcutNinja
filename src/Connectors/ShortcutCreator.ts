import {
  HoldableKeys,
  holdableKeys,
  isHoldableKey,
  Shortcut,
  SingleShortcut,
} from './Shortcut';

export class ShortcutCreator {
  private static readonly maxSc = 2;
  private scCreators: SingleShortcutCreator[];

  private currentScCreator: SingleShortcutCreator;

  constructor() {
    this.scCreators = [new SingleShortcutCreator()];
    this.currentScCreator = this.scCreators[0];
  }

  public onKeydown(key: string): Shortcut | undefined {
    key = this.convertToUnikey(key);
    if (key === 'enter') return this.create();

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
    key = this.convertToUnikey(key);
    this.currentScCreator.onKeyup(key);
  }

  private create(): Shortcut | undefined {
    const sc1 = this.scCreators[0].create();
    if (sc1) {
      return new Shortcut(sc1, this.scCreators[1].create());
    }
  }

  public toString(): string {
    return this.scCreators.reduce<string>((str, scCreator, idx, arr) => {
      if (idx === ShortcutCreator.maxSc) return str;
      return (
        str + scCreator.toString() + (idx >= arr.length - 2 ? '' : ' chord to ')
      );
    }, '');
  }

  private convertToUnikey(key: string): string {
    const km: { [key: string]: string } = {
      Control: 'ctrl',
    };
    return km[key] ?? key.toLowerCase();
  }
}

class SingleShortcutCreator {
  private key?: string;
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

  public create(): SingleShortcut | undefined {
    if (this.key) {
      return new SingleShortcut(this.holdedKeys, this.key);
    }
  }

  public toString(): string {
    if (!this.addedKeys) return '';

    const orderedKeys = holdableKeys.filter((key) =>
      this.holdedKeys.has(key)
    ) as string[];
    if (this.key) orderedKeys.push(this.key);

    return orderedKeys.reduce<string>(
      (str, key, idx, keys) =>
        (str += key + (idx === keys.length - 1 ? '' : '+')),
      ''
    );
  }

  public isComplete(): boolean {
    return this.key !== undefined;
  }
}
