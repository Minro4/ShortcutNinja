import definitions from './Config/ShortcutDefinitions.json';

export interface IDictShortcutCategory {
  id: string;
  label: string;
  definitions: { [key: string]: IShortcutDefinition };
}

export interface IShortcutCategory {
  id: string;
  label: string;
  definitions: IShortcutDefinition[];
}

export interface IShortcutDefinition {
  id: string;
  label: string;
  metaTags?: string[];
}

export class ShortcutCategories {
  public static readonly baseCategories = new ShortcutCategories(definitions);

  public readonly categories: IShortcutCategory[];

  public constructor(categories?: IShortcutCategory[]) {
    this.categories = categories ?? [];
  }

  public flatten(): IShortcutDefinition[] {
    return this.categories.flatMap<IShortcutDefinition>(
      (categories) => categories.definitions
    );
  }
}
