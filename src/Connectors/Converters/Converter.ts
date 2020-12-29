import { IdeMappings } from "../Ide";
import { IKeymap, IUniversalKeymap, KeymapUtils } from "../IUniversalKeymap";
import { fsUtils } from "../Utils";
import * as path from "path";
import { IShortcutConverter } from "./ShortcutConverter";
import { IDE_MAPPINGS_PATH } from "../Constants/general";

export interface IConverter {
  save(keymap: IUniversalKeymap): Promise<any>;
  load(): Promise<IUniversalKeymap>;
}

export abstract class Converter<IdeShortcut> implements IConverter {
  protected ideMappings: Promise<IdeMappings>;
  protected scConverter: IShortcutConverter<IdeShortcut>;

  constructor(
    ideMappingsName: string,
    scConverter: IShortcutConverter<IdeShortcut>
  ) {
    this.ideMappings = fsUtils.readJson<IdeMappings>(
      path.join(IDE_MAPPINGS_PATH, ideMappingsName)
    );
    this.scConverter = scConverter;
  }

  public async save(uniKm: IUniversalKeymap): Promise<any> {
    let ideKm = KeymapUtils.toIdeKeymap(
      uniKm,
      await this.ideMappings,
      this.scConverter
    );

    return this.writeIdeKeymap(ideKm);
  }
  public async load(): Promise<IUniversalKeymap> {
    return KeymapUtils.toUniKeymap(
      await this.readIdeKeymap(),
      await this.ideMappings,
      this.scConverter
    );
  }

  protected abstract readIdeKeymap(): Promise<IKeymap<IdeShortcut[]>>;
  protected abstract writeIdeKeymap(
    ideKeymap: IKeymap<IdeShortcut[]>
  ): Promise<any>;
}
