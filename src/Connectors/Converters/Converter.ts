import { IdeMappings, IdeMappingsUtils } from '../Ide';
import { UniversalKeymap } from '../Keymap';
import { IShortcutConverter } from './ShortcutConverter';
import { Schema } from '../Schema/Schema';
import { LoadSchema } from '../Schema/SchemaLoader';
import { Keymap } from '../Keymap';

export interface IConverter {
  save(keymap: UniversalKeymap): Promise<boolean>;
  load(): Promise<UniversalKeymap>;
}

export abstract class Converter<IdeShortcut> implements IConverter {
  protected ideMappings: Promise<IdeMappings>;
  protected scConverter: IShortcutConverter<IdeShortcut>;

  constructor(
    ideMappingsName: string,
    scConverter: IShortcutConverter<IdeShortcut>
  ) {
    this.ideMappings = IdeMappingsUtils.read(ideMappingsName);
    this.scConverter = scConverter;
  }

  public abstract load(): Promise<UniversalKeymap>;
  public abstract save(keymap: UniversalKeymap): Promise<any>;

  protected async fromIdeKeymap(
    ideKeymap: Keymap<IdeShortcut>
  ): Promise<UniversalKeymap> {
    return ideKeymap.toUniKeymap(await this.ideMappings, this.scConverter);
  }

  protected async toIdeKeymap(
    uniKeymap: UniversalKeymap
  ): Promise<Keymap<IdeShortcut>> {
    return uniKeymap.toIdeKeymap(await this.ideMappings, this.scConverter);
  }

  protected async fetchIdeSchema(schema: Schema): Promise<Keymap<IdeShortcut>> {
    const uniSchema = await LoadSchema(schema);
    return this.toIdeKeymap(uniSchema);
  }
}
