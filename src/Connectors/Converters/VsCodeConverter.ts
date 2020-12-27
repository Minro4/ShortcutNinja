import { VS_CODE } from "../Constants/VsCode";
import { IKeymap } from "../IUniversalKeymap";
import { JsonConfigConverter } from "./JsonConfigConverter";
import { StrShortcutConverter } from "./ShortcutConverter";

export class VsCodeConverter extends JsonConfigConverter<
  VsCondeConfig,
  string
> {
  private static instance: VsCodeConverter;

  public static get(): VsCodeConverter {
    if (!VsCodeConverter.instance)
      VsCodeConverter.instance = new VsCodeConverter();
    return VsCodeConverter.instance;
  }
  private constructor() {
    super("vscode.json", VS_CODE.KB_PATH, new StrShortcutConverter());
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

type VsCondeConfig = VsCodeKeybinding[];
interface VsCodeKeybinding {
  key: string;
  command: string;
  when?: string;
}
