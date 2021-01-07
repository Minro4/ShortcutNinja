import { fsUtils } from './Utils';

export interface IShortcutDefinition {
  id: string;
  label: string;
  metaTags?: string[]
}

export class ShortcutDefinitions {
  private static readonly DEFAULT_SC_DEFINITIONS_PATH =
    'src/Connectors/Config/ShortcutDefinitions.json';

  public definitions: IShortcutDefinition[];

  constructor(definitions?: IShortcutDefinition[]) {
    this.definitions = definitions ?? [];
  }

  public static async read(
    path: string = ShortcutDefinitions.DEFAULT_SC_DEFINITIONS_PATH
  ): Promise<ShortcutDefinitions> {
    return new ShortcutDefinitions(
      await fsUtils.readJson<IShortcutDefinition[]>(path)
    );
  }
}
