import { VS_CODE } from "../Constants/VsCode";
import { IKeymap } from "../IUniversalKeymap";
import { SCHEMA_TYPES } from "../Schema/Schema";
import { JsonConfigConverter } from "./JsonConfigConverter";
import { StrShortcutConverter } from "./ShortcutConverter";

export class VsCodeConverter extends JsonConfigConverter<
  VsCondeConfig,
  string
> {
  constructor(configPath?: string) {
    super(
      "vscode.json",
      configPath ?? VS_CODE.KB_PATH,
      new StrShortcutConverter(),
      SCHEMA_TYPES.VS_CODE
    );
  }

  protected configToIdeKm(ideConfig: VsCondeConfig): IKeymap<string[]> {
    return ideConfig.reduce<IKeymap<string[]>>((ideKm, vsCodeKb) => {
      ideKm[vsCodeKb.command] = [vsCodeKb.key];
      return ideKm;
    }, {});
  }
  protected ideKmToConfig(ideKm: IKeymap<string[]>): VsCondeConfig {
    return Object.keys(ideKm).map<VsCodeKeybinding>((ideKey) => {
      return {
        key: ideKm[ideKey][0],
        command: ideKey,
      };
    });
  }
}

export type VsCondeConfig = VsCodeKeybinding[];
export interface VsCodeKeybinding {
  key: string;
  command: string;
  when?: string;
}
