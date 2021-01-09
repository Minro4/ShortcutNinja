import { fsUtils } from './Utils';

export interface IShortcutCategory {
  label: string;
  shortcuts: IShortcutDefinition[];
}

export interface IShortcutDefinition {
  id: string;
  label: string;
  metaTags?: string[];
}

export class ShortcutDefinitions {
  public definitions: IShortcutDefinition[];

  constructor(definitions?: IShortcutDefinition[]) {
    this.definitions = definitions ?? [];
  }

  public static async read(): Promise<ShortcutDefinitions> {
    const categories = await ShortcutCategories.read();
    const definitions = categories.categories.flatMap(
      (category) => category.shortcuts
    );
    return new ShortcutDefinitions(definitions);
  }
}

export class ShortcutCategories {
  public static readonly DEFAULT_SC_DEFINITIONS_PATH =
    'src/Connectors/Config/ShortcutDefinitions.json';

  public categories: IShortcutCategory[];

  constructor(categories?: IShortcutCategory[]) {
    this.categories = categories ?? [];
  }

  public static async read(
    path: string = ShortcutCategories.DEFAULT_SC_DEFINITIONS_PATH
  ): Promise<ShortcutCategories> {
    return new ShortcutCategories(
      await fsUtils.readJson<IShortcutCategory[]>(path)
    );
  }
}
