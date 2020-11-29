import { IdeMappings } from "../Ide";
import { IUniversalKeymap } from "../IUniversalKeymap";
import { fsUtils } from "../Utils";

export abstract class Converter {
  protected configPath: string;
  protected ideMappings: Promise<IdeMappings>;

  constructor(configPath: string, ideMappingsPath: string) {
    this.configPath = configPath;
    this.ideMappings = fsUtils.readJson<IdeMappings>(ideMappingsPath);
  }

  public async save(keymap: IUniversalKeymap) {
    return fsUtils.saveFile(this.configPath, await this.convertTo(keymap));
  }
  public async load() {
    return this.convertFrom(await fsUtils.readJson(this.configPath));
  }

  protected abstract convertTo(keymap: IUniversalKeymap): Promise<string>;
  protected abstract convertFrom(data: string): IUniversalKeymap;
}
