import { IdeMappings } from '../Ide';
import { IKeymap, UniversalKeymap } from '../UniversalKeymap';
import { fsUtils } from '../Utils';
import * as path from 'path';
import { IShortcutConverter } from './ShortcutConverter';
import { IDE_MAPPINGS_PATH } from '../Constants/general';
import { Schema } from '../Schema/Schema';
import { LoadSchema } from '../Schema/SchemaLoader';

export interface IConverter {
  save(keymap: UniversalKeymap): Promise<any>;
  load(): Promise<UniversalKeymap>;
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

  public async save(uniKm: UniversalKeymap): Promise<any> {
    const ideKm = uniKm.toIdeKeymap(await this.ideMappings, this.scConverter);
    return this.writeIdeKeymap(ideKm);
  }

  public async load(): Promise<UniversalKeymap> {
    const uniKm = UniversalKeymap.fromIdeKeymap(
      await this.readIdeKeymap(),
      await this.ideMappings,
      this.scConverter
    );

    const baseKm: UniversalKeymap = this.schema
      ? await LoadSchema(this.schema)
      : new UniversalKeymap();

    return this.combineWithSchema(baseKm, uniKm);
  }

  protected combineWithSchema(
    schema: UniversalKeymap,
    uniKm: UniversalKeymap
  ): UniversalKeymap {
    return schema.overrideKeymap(uniKm);
  }

  protected abstract readIdeKeymap(): Promise<IKeymap<IdeShortcut[]>>;
  protected abstract writeIdeKeymap(
    ideKeymap: IKeymap<IdeShortcut[]>
  ): Promise<any>;
}
