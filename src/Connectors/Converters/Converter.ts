import { IdeMappings } from "../IdeMappings";
import { UniversalKeymap } from '../Keymap';
import { IShortcutConverter } from './ShortcutConverter';
import { Keymap } from '../Keymap';

export interface IConverter {
  save(keymap: UniversalKeymap): Promise<boolean>;
  load(): Promise<UniversalKeymap>;
}

export abstract class Converter<IdeShortcut> implements IConverter {
  protected ideMappings: IdeMappings;
  protected scConverter: IShortcutConverter<IdeShortcut>;

  constructor(
    ideMappings: IdeMappings,
    scConverter: IShortcutConverter<IdeShortcut>
  ) {
    this.ideMappings = ideMappings;
    this.scConverter = scConverter;
  }

  public abstract load(): Promise<UniversalKeymap>;
  public abstract save(keymap: UniversalKeymap): Promise<any>;

  protected async fromIdeKeymap(
    ideKeymap: Keymap<IdeShortcut>
  ): Promise<UniversalKeymap> {
    return ideKeymap.toUniKeymap(this.ideMappings, this.scConverter);
  }

  protected async toIdeKeymap(
    uniKeymap: UniversalKeymap
  ): Promise<Keymap<IdeShortcut>> {
    return uniKeymap.toIdeKeymap(this.ideMappings, this.scConverter);
  }
}
