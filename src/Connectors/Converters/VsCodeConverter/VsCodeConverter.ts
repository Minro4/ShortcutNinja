import { VS_CODE } from "../../Constants/VsCode";
import { IKeymap } from "../../IUniversalKeymap";
import { SCHEMA_TYPES } from "../../Schema/Schema";
import { fsUtils } from "../../Utils";
import { Converter } from "../Converter";
import { StrShortcutConverter } from "../ShortcutConverter";
import { VsCodeKeybinding, VsCondeConfig } from "./VsCodeConverter.models";

export class VsCodeConverter extends Converter<string> {
  private configPath: string;

  constructor(configPath?: string) {
    super("vscode.json", new StrShortcutConverter(), SCHEMA_TYPES.VS_CODE);

    this.configPath = configPath ?? VS_CODE.KB_PATH;
  }

  protected async readIdeKeymap(): Promise<IKeymap<string[]>> {
    let ideConfig = await fsUtils.readJson<VsCondeConfig>(this.configPath);
    return ideConfig.reduce<IKeymap<string[]>>((ideKm, vsCodeKb) => {
      ideKm[vsCodeKb.command] = [vsCodeKb.key];
      return ideKm;
    }, {});
  }

  protected writeIdeKeymap(ideKeymap: IKeymap<string[]>): Promise<unknown> {
    let newConfig = Object.keys(ideKeymap).map<VsCodeKeybinding>((ideKey) => {
      return {
        key: ideKeymap[ideKey][0],
        command: ideKey,
      };
    });

    return fsUtils.saveJson<VsCondeConfig>(this.configPath, newConfig);
  }
}
