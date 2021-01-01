import { IKeymap } from '../../UniversalKeymap';
import { SchemaTypes } from '../../Schema/Schema';
import { fsUtils } from '../../Utils';
import { Converter } from '../Converter';
import { StrShortcutConverter } from '../ShortcutConverter';
import { VsCodeKeybinding, VsCondeConfig } from './VsCodeConverter.models';
import { KEYBINDINGS_PATH } from '../../Constants/VsCode';

export class VsCodeConverter extends Converter<string> {
  private configPath: string;

  constructor(configPath?: string) {
    super('vscode.json', new StrShortcutConverter(), SchemaTypes.VS_CODE);

    this.configPath = configPath ?? KEYBINDINGS_PATH;
  }

  protected async readIdeKeymap(): Promise<IKeymap<string[]>> {
    const ideConfig = await fsUtils.readJson<VsCondeConfig>(this.configPath);
    return ideConfig.reduce<IKeymap<string[]>>((ideKm, vsCodeKb) => {
      ideKm[vsCodeKb.command] = [vsCodeKb.key];
      return ideKm;
    }, {});
  }

  protected writeIdeKeymap(ideKeymap: IKeymap<string[]>): Promise<unknown> {
    const newConfig = Object.keys(ideKeymap).map<VsCodeKeybinding>((ideKey) => {
      return {
        key: ideKeymap[ideKey][0],
        command: ideKey,
      };
    });

    return fsUtils.saveJson<VsCondeConfig>(this.configPath, newConfig);
  }
}
