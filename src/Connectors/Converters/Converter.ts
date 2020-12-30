import { IdeMappings } from "../Ide";
import { IKeymap, IUniversalKeymap, KeymapUtils } from "../IUniversalKeymap";
import { fsUtils } from "../Utils";
import * as path from "path";
import { IShortcutConverter } from "./ShortcutConverter";
import { IDE_MAPPINGS_PATH } from "../Constants/general";
import { Schema } from "../Schema/Schema";
import { LoadSchema } from "../Schema/SchemaLoader";

export interface IConverter {
  save(keymap: IUniversalKeymap): Promise<any>;
  load(): Promise<IUniversalKeymap>;
}

export abstract class Converter<IdeShortcut> implements IConverter {
  protected ideMappings: Promise<IdeMappings>;
  protected scConverter: IShortcutConverter<IdeShortcut>;
  protected schema?: Schema;

  constructor(
    ideMappingsName: string,
    scConverter: IShortcutConverter<IdeShortcut>,
    schema?: Schema
  ) {
    this.ideMappings = fsUtils.readJson<IdeMappings>(
      path.join(IDE_MAPPINGS_PATH, ideMappingsName)
    );
    this.scConverter = scConverter;
    this.schema = schema;
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
    const uniKm = KeymapUtils.toUniKeymap(
      await this.readIdeKeymap(),
      await this.ideMappings,
      this.scConverter
    );

    const baseKm: IUniversalKeymap = this.schema
      ? await LoadSchema(this.schema)
      : {};

    return { ...baseKm, ...uniKm };
  }

  protected abstract readIdeKeymap(): Promise<IKeymap<IdeShortcut[]>>;
  protected abstract writeIdeKeymap(
    ideKeymap: IKeymap<IdeShortcut[]>
  ): Promise<any>;
}
