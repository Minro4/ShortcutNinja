import { IdeMappings } from "../Ide";
import { IKeymap, IUniversalKeymap, KeymapUtils } from "../IUniversalKeymap";
import { fsUtils } from "../Utils";
import * as path from "path";
import { IShortcutConverter } from "./ShortcutConverter";

export interface IConverter {
  save(keymap: IUniversalKeymap): void;
  load(): Promise<IUniversalKeymap>;
}

export abstract class Converter<IdeShortcut> implements IConverter {
  private static readonly ideMappingsBasePath = "src/Connectors/Config/ideMappings/";

  protected ideMappings: Promise<IdeMappings>;
  protected scConverter: IShortcutConverter<IdeShortcut>;

  constructor(
    ideMappingsName: string,
    scConverter: IShortcutConverter<IdeShortcut>
  ) {
    this.ideMappings = fsUtils.readJson<IdeMappings>(
      path.join(Converter.ideMappingsBasePath, ideMappingsName)
    );
    this.scConverter = scConverter;
  }

  public async save(uniKm: IUniversalKeymap) {
    let currentIdeKm = this.readIdeKeymap();

    let ideKm = KeymapUtils.toIdeKeymap(
      uniKm,
      await this.ideMappings,
      this.scConverter
    );

    Object.keys(ideKm).forEach(
      (ideKey) => (currentIdeKm[ideKey] = ideKey[ideKey])
    );
    this.writeIdeKeymap(ideKm);
  }
  public async load() {
    return KeymapUtils.toUniKeymap(
      await this.readIdeKeymap(),
      await this.ideMappings,
      this.scConverter
    );
  }

  protected abstract readIdeKeymap(): Promise<IKeymap<IdeShortcut>>;
  protected abstract writeIdeKeymap(
    ideKeymap: IKeymap<IdeShortcut>
  ): Promise<void>;
}
